import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as AtreidesStaking } from "../abi/Staking.json";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sSPICE } from "../abi/sSpiceToken.json";
import { setAll, getTokenPrice, getMarketPrice } from "../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";
import { abi as PairContract } from "../abi/PairContract.json";

const initialState = {
  loading: false,
  loadingMarketPrice: false,
};
const circulatingSupply = {
  inputs: [],
  name: "circulatingSupply",
  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  stateMutability: "view",
  type: "function",
};
export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    const stakingContract = new ethers.Contract(
      addresses[networkID].STAKING_ADDRESS as string,
      AtreidesStaking,
      provider,
    );

    // NOTE (appleseed): marketPrice from Graph was delayed, so get CoinGecko price
    let marketPrice;
    try {
      const originalPromiseResult = await dispatch(
        loadMarketPrice({ networkID: networkID, provider: provider }),
      ).unwrap();
      marketPrice = originalPromiseResult?.marketPrice;
    } catch (rejectedValueOrSerializedError) {
      // handle error here
      console.error("Returned a null response from dispatch(loadMarketPrice)");
      return;
    }
    const sSpiceMainContract = new ethers.Contract(addresses[networkID].SSPICE_ADDRESS as string, sSPICE, provider);
    const spiceContract = new ethers.Contract(addresses[networkID].SPICE_ADDRESS as string, ierc20Abi, provider);
    const roseUsdtAddress = "0x38310B0dB7E04B5791d2Dc8dF404F83838960473";
    const pairContract = new ethers.Contract(roseUsdtAddress as string, PairContract, provider);


    const circ = await sSpiceMainContract.circulatingSupply();
    const total = await spiceContract.totalSupply();
    const totalSupply = total / Math.pow(10, 9);
    const stakedRatio = circ / Math.pow(10, 9) / totalSupply;
    const stakingTVL = marketPrice * circ / Math.pow(10, 9);
    const marketCap = marketPrice * totalSupply;
    const marketPriceString = marketPrice ? "$" + marketPrice.toFixed(2) : "";
    document.title = `AtreidesDAO - ${marketPriceString}`;
    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {
        marketPrice,
        marketCap,
        totalSupply,
      };
    }
    const currentBlock = await provider.getBlockNumber();

    // Calculating staking
    const epoch = await stakingContract.epoch();
    //const old_epoch = await old_stakingContract.epoch();
    const stakingReward = epoch.distribute;
    //const old_stakingReward = old_epoch.distribute;
    const stakingRebase = stakingReward / circ;
    //const old_stakingRebase = old_stakingReward / old_circ;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    //const old_fiveDayRate = Math.pow(1 + old_stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;
    // Current index
    const currentIndex = await stakingContract.index();
    const endBlock = epoch.endBlock;

    // Rose price
    const reserves = await pairContract.getReserves();
    const rosePrice = reserves[1] / reserves[0] * 10 ** 12;

    return {
      currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
      currentBlock,
      fiveDayRate,
      stakingAPY,
      stakingRebase,
      marketCap,
      marketPrice,
      totalSupply,
      stakedRatio,
      stakingTVL,
      endBlock,
      rosePrice
    } as IAppData;
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ networkID: networkID, provider: provider }),
        ).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice };
  },
);

/**
 * - fetches the SPICE price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from spice-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
    marketPrice = await getMarketPrice({ networkID, provider });
    marketPrice = marketPrice * 10 ** 3;
  } catch (e) {
    marketPrice = await getTokenPrice("spice");
  }
  return { marketPrice };
});

interface IAppData {
  readonly circSupply: number;
  readonly currentIndex?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly old_fiveDayRate?: number;
  readonly marketCap: number;
  readonly marketPrice: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly old_stakingRebase?: number;
  readonly stakingTVL: number;
  readonly totalSupply: number;
  readonly stakedRatio: number;
  readonly treasuryBalance?: number;
  readonly endBlock?: number;
  readonly rosePrice?: number;
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
