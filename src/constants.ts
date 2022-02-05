export const EPOCH_INTERVAL = 4800;

export const BLOCK_RATE_SECONDS = 6;

export const TOKEN_DECIMALS = 9;

export const DEFAULT_NETWORK = 42261;

interface IAddresses {
  [key: number]: { [key: string]: string; };
}

export const addresses: IAddresses = {
  // TODO change for release
  42262: {
    USDT_ADDRESS: "",
    SPICE_ADDRESS: "",
    TREASURY_ADDRESS: "",
    BONDINGCALC_ADDRESS1: "",
    DISTRIBUTOR_ADDRESS: "",
    SSPICE_ADDRESS: "",
    STAKING_ADDRESS: "",
    STAKING_HELPER_ADDRESS: "",
  },
  42261: {
    USDT_ADDRESS: "0x840e2404dF8420B0f4794F67A50f2B4112362cD9",
    SPICE_ADDRESS: "0x614e3c1EF0fC94Eb4588c50cAbceADCCE28A3893",
    SSPICE_ADDRESS: "0xb3d5B01D1c81aaDDAf38F4893A5C0016D264eD54",
    STAKING_ADDRESS: "0x73B76E9ad4e44799E1a42bc7e96731e3D80A78cE",
    STAKING_HELPER_ADDRESS: "0x482d6988eFBaA6838766127Ab8ec16cb4F404c90",
    DISTRIBUTOR_ADDRESS: "0xfBa04C5c64E26242120a9afF1edFBBcCB7FfBB5A",
    BONDINGCALC_ADDRESS1: "0xA70F2f13885A48B75222aE5C9E421e8abFf3a3F3",
    TREASURY_ADDRESS: "0xaa1403C290d515D784eD786dE0a30E7C5b83Ab62",
  },
  31337: {
    USDT_ADDRESS: "0xE87ffEc032517cff7303C53Af23112b856692c04",
    SPICE_ADDRESS: "0x9dbE94D8175dB58d51995EebbdBa91C75DfcF483",
    SSPICE_ADDRESS: "0xB725a3963Bb8bB9b542e74F234EE6d9d23024bd0",
    STAKING_ADDRESS: "0xCDE7cb7bE74Ba0ee24041B020145Cb4bC67461e8",
    STAKING_HELPER_ADDRESS: "0xB01544B7857C49218CeBb03f9a1CdB197A3994D9",
    DISTRIBUTOR_ADDRESS: "0xf65C658FdBD50350Ea1cfB4C0cB28B2412997a56",
    BONDINGCALC_ADDRESS1: "0x064e5Eb95701cACD712425EC05AEFa968e70d80A",
    TREASURY_ADDRESS: "0x2220faF31E219E557Cd00e3C94D3e72F7D55f3B7",
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
