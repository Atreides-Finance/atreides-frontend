import { ethers, BigNumber } from "ethers";
import { addresses, messages } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as AtreidesStaking } from "../abi/Staking.json";
import { abi as StakingHelper } from "../abi/StakingHelper.json";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, loadAccountDetails } from "./AccountSlice";
import { error, info, success } from "../slices/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { metamaskErrorWrap } from "src/helpers/MetamaskErrorWrap";
import { sleep } from "../helpers/Sleep";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

function alreadyApprovedToken(token: string, stakeAllowance: BigNumber, unstakeAllowance: BigNumber) {
  // set defaults
  let bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;

  // determine which allowance to check
  if (token === "spice") {
    applicableAllowance = stakeAllowance;
  } else if (token === "sspice") {
    applicableAllowance = unstakeAllowance;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const changeApproval = createAsyncThunk(
  "stake/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const spiceContract = new ethers.Contract(addresses[networkID].SPICE_ADDRESS as string, ierc20Abi, signer);
    const sspiceContract = new ethers.Contract(addresses[networkID].SSPICE_ADDRESS as string, ierc20Abi, signer);

    //const oldsspiceContract = new ethers.Contract(addresses[networkID].OLD_SSPICE_ADDRESS as string, ierc20Abi, signer);
    let approveTx;
    let stakeAllowance = await spiceContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    let unstakeAllowance = await sspiceContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    //let oldunstakeAllowance = await oldsspiceContract.allowance(address, addresses[networkID].OLD_STAKING_ADDRESS);

    // return early if approval has already happened
    if (alreadyApprovedToken(token, stakeAllowance, unstakeAllowance)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          staking: {
            spiceStake: +stakeAllowance,
            spiceUnstake: +unstakeAllowance,
          },
        }),
      );
    }

    try {
      if (token === "spice") {
        // won't run if stakeAllowance > 0
        approveTx = await spiceContract.approve(
          addresses[networkID].STAKING_HELPER_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else if (token === "sspice") {
        approveTx = await sspiceContract.approve(
          addresses[networkID].STAKING_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      }

      const text = "Approve " + (token === "spice" ? "Staking" : "Unstaking");
      const pendingTxnType = token === "spice" ? "approve_staking" : "approve_unstaking";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

      await approveTx.wait();
      dispatch(success(messages.tx_successfully_send));
    } catch (e: any) {
      ``;
      // dispatch(error((e as IJsonRPCError).message));
      return metamaskErrorWrap(e, dispatch);
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    await sleep(2);

    // go get fresh allowances
    stakeAllowance = await spiceContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    unstakeAllowance = await sspiceContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    //oldunstakeAllowance = await sspiceContract.allowance(address, addresses[networkID].OLD_STAKING_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        staking: {
          spiceStake: +stakeAllowance,
          spiceUnstake: +unstakeAllowance,
          //oldspiceUnstake: +oldunstakeAllowance,
        },
      }),
    );
  },
);

export const changeStake = createAsyncThunk(
  "stake/changeStake",
  async ({ action, value, provider, address, networkID, callback, isOld }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    let staking, stakingHelper;
    if (isOld) {
      staking = new ethers.Contract(addresses[networkID].OLD_STAKING_ADDRESS as string, AtreidesStaking, signer);
      stakingHelper = new ethers.Contract(
        addresses[networkID].OLD_STAKING_HELPER_ADDRESS as string,
        StakingHelper,
        signer,
      );
    } else {
      staking = new ethers.Contract(addresses[networkID].STAKING_ADDRESS as string, AtreidesStaking, signer);
      stakingHelper = new ethers.Contract(addresses[networkID].STAKING_HELPER_ADDRESS as string, StakingHelper, signer);
    }
    let stakeTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };

    try {
      if (action === "stake") {
        uaData.type = "stake";
        stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"), address);
      } else {
        uaData.type = "unstake";
        stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true);
      }
      const pendingTxnType = action === "stake" ? "staking" : "unstaking";
      uaData.txHash = stakeTx.hash;
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      callback?.();
      await stakeTx.wait();
      dispatch(success(messages.tx_successfully_send));
    } catch (e: any) {
      return metamaskErrorWrap(e, dispatch);
    } finally {
      if (stakeTx) {

        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    await sleep(7);
    dispatch(info(messages.your_balance_update_soon));
    await sleep(15);
    await dispatch(loadAccountDetails({ address, networkID, provider }));
    dispatch(info(messages.your_balance_updated));
    return;
  },
);
