export const EPOCH_INTERVAL = 4800;

export const BLOCK_RATE_SECONDS = 6;

export const TOKEN_DECIMALS = 9;

export const DEFAULT_NETWORK = 42262;

interface IAddresses {
  [key: number]: { [key: string]: string; };
}

export const addresses: IAddresses = {
  // TODO change for release
  42262: {
    USDT_ADDRESS: "0xdC19A122e268128B5eE20366299fc7b5b199C8e3",
    SPICE_ADDRESS: "0x095c5A33aA796605F5dc8C421975549C1c80b7F0",
    TREASURY_ADDRESS: "0x9439E4C7e97e5d3176D7764b69FE6353a7acAB8e",
    BONDINGCALC_ADDRESS1: "0x00E27aF839e7FFcBca742d9fa7316EC5c4E86a65",
    DISTRIBUTOR_ADDRESS: "0x471DEFAeF7F00C4610EA530d06003660536Dafc2",
    SSPICE_ADDRESS: "0x843495cC47Acd9B066Ee5289c2111153e3E122F8",
    STAKING_ADDRESS: "0x67578bA7ea46F65bB7d480EdD7F2FAE3c91E82A6",
    STAKING_HELPER_ADDRESS: "0x6BFfF7331E61ec00175e3fC00B0038DEca4cbfbd",
  },
  42261: {
    USDT_ADDRESS: "",
    SPICE_ADDRESS: "",
    SSPICE_ADDRESS: "",
    STAKING_ADDRESS: "",
    STAKING_HELPER_ADDRESS: "",
    DISTRIBUTOR_ADDRESS: "",
    BONDINGCALC_ADDRESS1: "",
    TREASURY_ADDRESS: "",
  },
  31337: {
    USDT_ADDRESS: "",
    SPICE_ADDRESS: "",
    SSPICE_ADDRESS: "",
    STAKING_ADDRESS: "",
    STAKING_HELPER_ADDRESS: "",
    DISTRIBUTOR_ADDRESS: "",
    BONDINGCALC_ADDRESS1: "",
    TREASURY_ADDRESS: "",
  },
};

export const messages = {
  please_connect: "Please connect your wallet to the Emerald Paratime network to use AtreidesDAO.",
  please_connect_wallet: "Please connect your wallet.",
  try_mint_more: (value: string) => `You're trying to mint more than the maximum payout available! The maximum mint payout is ${value} SPICE.`,
  before_minting: "Before minting, enter a value.",
  existing_mint:
    "You have an existing mint. Minting will reset your vesting period and forfeit any pending claimable rewards. We recommend claiming rewards first or using a fresh wallet. Do you still wish to proceed?",
  before_stake: "Before staking, enter a value.",
  before_unstake: "Before un staking, enter a value.",
  tx_successfully_send: "Your transaction was successful",
  your_balance_updated: "Your balance was successfully updated",
  nothing_to_claim: "You have nothing to claim",
  something_wrong: "Something went wrong",
  switch_to_emerald_paratime: "Switch to the Emeral Paratime network?",
  slippage_too_small: "Slippage too small",
  slippage_too_big: "Slippage too big",
  your_balance_update_soon: "Your balance will update soon",
};
