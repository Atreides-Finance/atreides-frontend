import { StableBond, LPBond, NetworkID } from "src/lib/Bond";
import { addresses, DEFAULT_NETWORK } from "src/constants";

import { ReactComponent as UsdtImg } from "src/assets/tokens/USDT.svg";
import { ReactComponent as SpiceUsdtimg } from "src/assets/tokens/SPICE-USDT.svg";

import { abi as SpiceUsdtBondContract } from "src/abi/bonds/SpiceUsdtContract.json";
import { abi as UsdtBondContract } from "src/abi/bonds/UsdtContract.json";
import { abi as ReserveSpiceUsdtContract } from "src/abi/reserves/SpiceUsdt.json";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const usdt = new StableBond({
  name: "usdt",
  displayName: "USDT",
  bondToken: "USDT",
  bondIconSvg: UsdtImg,
  bondContractABI: UsdtBondContract,
  decimals: 6,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x6031fDd3b82D5b24092895224FE97EdE04672789",
      reserveAddress: "0x840e2404dF8420B0f4794F67A50f2B4112362cD9",
    },
    [NetworkID.Local]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
});

export const usdt_spice = new LPBond({
  name: "spice_usdt_lp",
  displayName: "SPICE-USDT LP",
  bondToken: "USDT",
  bondIconSvg: SpiceUsdtimg,
  bondContractABI: SpiceUsdtBondContract,
  reserveContract: ReserveSpiceUsdtContract,
  decimals: 6,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xF4FF40f25f0d59e937a47831aea2eFE3e597D198",
      reserveAddress: "0x0D61cafCf246cFbe1A0e648FC1B2bDfaCae1617e",
    },
    [NetworkID.Local]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  lpUrl:
    "https://app.yuzu-swap.com/#/add/0x614e3c1EF0fC94Eb4588c50cAbceADCCE28A3893/0x840e2404dF8420B0f4794F67A50f2B4112362cD9",
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [
  usdt,
  usdt_spice
];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

export default allBonds;
