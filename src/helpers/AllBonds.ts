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
      bondAddress: "0x5804a27F56483E667F908513c41Cca9ADfDf039d",
      reserveAddress: "0xdC19A122e268128B5eE20366299fc7b5b199C8e3",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
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
      bondAddress: "0x2Aeb914723ebe496ed09c6F79BFB62F1E4554aAE",
      reserveAddress: "0xed6A043Aa99eAdeCf1c644c95d7fF67e6fF1aE5A",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkID.Local]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  lpUrl:
    "https://www.duneswap.com/exchange/add/0x095c5A33aA796605F5dc8C421975549C1c80b7F0/0xdC19A122e268128B5eE20366299fc7b5b199C8e3",
});

export const usdt_spice_gemkeeper = new LPBond({
  name: "spice_usdt_lp_v2",
  displayName: "SPICE-USDT LP V2",
  bondToken: "USDT",
  bondIconSvg: SpiceUsdtimg,
  bondContractABI: SpiceUsdtBondContract,
  reserveContract: ReserveSpiceUsdtContract,
  decimals: 6,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xCc3F195c2Cb69f38EcDCe8Ab44E067D6649d2F50",
      reserveAddress: "0x4658419f81F20F293FB3aa8409E3eE14F1749558",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkID.Local]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  lpUrl:
    "https://app.gemkeeper.finance/#/add/0x095c5A33aA796605F5dc8C421975549C1c80b7F0/0xdC19A122e268128B5eE20366299fc7b5b199C8e3",
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [
  usdt,
  usdt_spice,
  usdt_spice_gemkeeper
];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

export default allBonds;
