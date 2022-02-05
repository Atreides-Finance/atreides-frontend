import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sSPICE } from "../abi/sSpiceToken.json";
import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const spiceContract = new ethers.Contract(addresses[networkID].SPICE_ADDRESS as string, ierc20Abi, provider);
    const spiceBalance = await spiceContract.balanceOf(address);
    const sspiceContract = new ethers.Contract(addresses[networkID].SSPICE_ADDRESS as string, ierc20Abi, provider);
    const sspiceBalance = await sspiceContract.balanceOf(address);

    return {
      balances: {
        spice: ethers.utils.formatUnits(spiceBalance, "gwei"),
        sspice: ethers.utils.formatUnits(sspiceBalance, "gwei"),
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    let spiceBalance = 0;
    let sspiceBalance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;
    let usdtBondAllowance = 0;

    const usdtContract = new ethers.Contract(addresses[networkID].USDT_ADDRESS as string, ierc20Abi, provider);
    const usdtBalance = await usdtContract.balanceOf(address);

    const spiceContract = new ethers.Contract(addresses[networkID].SPICE_ADDRESS as string, ierc20Abi, provider);
    spiceBalance = await spiceContract.balanceOf(address);
    stakeAllowance = await spiceContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);

    const sspiceContract = new ethers.Contract(addresses[networkID].SSPICE_ADDRESS as string, sSPICE, provider);
    sspiceBalance = await sspiceContract.balanceOf(address);
    unstakeAllowance = await sspiceContract.allowance(address, addresses[networkID].STAKING_ADDRESS);

    return {
      balances: {
        usdt: ethers.utils.formatEther(usdtBalance),
        spice: ethers.utils.formatUnits(spiceBalance, "gwei"),
        sspice: ethers.utils.formatUnits(sspiceBalance, "gwei"),
      },
      staking: {
        spiceStake: +stakeAllowance,
        spiceUnstake: +unstakeAllowance,
      },

      bonding: {
        usdtAllowance: usdtBondAllowance,
      },
    };
  },
);

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);
    let interestDue, pendingPayout, bondMaturationBlock;
    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = 0;
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    let balanceVal;
    balanceVal = ethers.utils.formatEther(balance);
    if (bond.decimals) {
      balanceVal = ethers.utils.formatUnits(balance, "mwei");
    }
    if (bond.isLP) {
      balanceVal = ethers.utils.formatEther(balance);
    }
    const t = {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance),
      balance: balanceVal.toString(),
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
    return t;
  },
);

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails; };
  balances: {
    spice: string;
    sspice: string;
    usdt: string;
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { spice: "", sspice: "", usdt: "" },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
