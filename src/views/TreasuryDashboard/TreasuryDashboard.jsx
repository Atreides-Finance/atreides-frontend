import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSelector } from "react-redux";
import { trim, formatCurrency } from "../../helpers";
import "./treasury-dashboard.scss";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip.jsx";
import { allBondsMap } from "src/helpers/AllBonds";

function TreasuryDashboard() {
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });
  const totalSupply = useSelector(state => {
    return state.app.totalSupply;
  });
  const marketCap = useSelector(state => {
    return state.app.marketCap;
  });
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const treasury = useSelector(state => {
    let tokenBalances = 0;
    // Investment
    const boughtRose = 16097.872;
    tokenBalances += boughtRose * state.app.rosePrice;
    const stableLizard = 40000;
    tokenBalances += stableLizard;
    for (const bond in allBondsMap) {
      if (state.bonding[bond]) {
        tokenBalances += state.bonding[bond].purchased;
      }
    }
    return tokenBalances;
  });
  const stakingAPY = useSelector(state => {
    return trim(state.app.stakingAPY * 100, 1);
  });
  const stakedRatio = useSelector(state => {
    return state.app.stakedRatio;
  });
  const backingPerHec = useSelector(state => {
    let tokenBalances = 0;
    // Investment
    const boughtRose = 16097.872;
    tokenBalances += boughtRose * state.app.rosePrice;
    const stableLizard = 40000;
    tokenBalances += stableLizard;
    // Bonds
    if (state.bonding.loading === false) {
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased;
        }
      }
      return tokenBalances / state.app.totalSupply;
    }
  });

  return (
    <div id="treasury-dashboard-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
        }}
      >


        <Zoom in={true}>
          <Grid container spacing={2} className="data-grid">
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Box className={`hero-metrics`}>
                <Paper className="atreides-card">
                  <Box >
                    <Typography variant="h6" color="textSecondary">
                      SPICE Price
                    </Typography>
                    <Typography variant="h5">
                      {marketPrice ? formatCurrency(marketPrice, 2) : <Skeleton type="text" />}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Box className={`hero-metrics`}>
                <Paper className="atreides-card">
                  <Box >
                    <Typography variant="h6" color="textSecondary">
                      Market Cap
                    </Typography>
                    <Typography variant="h5">
                      {marketCap && formatCurrency(marketCap, 0)}
                      {!marketCap && <Skeleton type="text" />}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Box className={`hero-metrics`}>
                <Paper className="atreides-card">
                  <Box >
                    <Typography variant="h6" color="textSecondary">
                      APY
                    </Typography>
                    <Typography variant="h5">
                      {stakingAPY ? (
                        <>{new Intl.NumberFormat("en-US").format(stakingAPY)}%</>
                      ) : (
                        <Skeleton width="150px" />
                      )}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Box className={`hero-metrics`}>
                <Paper className="atreides-card">
                  <Box >
                    <Typography variant="h6" color="textSecondary">
                      Treasury value
                    </Typography>
                    <Typography variant="h5">
                      {treasury && formatCurrency(treasury, 0)}
                      {!treasury && <Skeleton type="text" />}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Box className={`hero-metrics`}>
                <Paper className="atreides-card">
                  <Box >
                    <Typography variant="h6" color="textSecondary">
                      Total supply
                    </Typography>
                    <Typography variant="h5">
                      {totalSupply ? (
                        parseInt(totalSupply)
                      ) : (
                        <Skeleton type="text" />
                      )}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Box className={`hero-metrics`}>
                <Paper className="atreides-card">
                  <Box >
                    <Typography variant="h6" color="textSecondary">
                      Staked ratio
                    </Typography>
                    <Typography variant="h5">
                      {stakedRatio ? (
                        <>{new Intl.NumberFormat("en-US").format(stakedRatio * 100)}%</>
                      ) : (
                        <Skeleton width="150px" />
                      )}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Box className={`hero-metrics`}>
                <Paper className="atreides-card">
                  <Box >
                    <Typography variant="h6" color="textSecondary">
                      Backing per SPICE
                    </Typography>
                    <Typography variant="h5">
                      {backingPerHec ? formatCurrency(backingPerHec, 2) : <Skeleton type="text" />}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Box className={`hero-metrics`}>
                <Paper className="atreides-card">
                  <Box >
                    <Typography variant="h6" color="textSecondary">
                      Current index
                      <InfoTooltip
                        message={
                          "The current index tracks the amount of sSPICE accumulated since the beginning of staking. Basically, how much sSPICE one would have if they staked and held a single SPICE from day 1."
                        }
                      />
                    </Typography>
                    <Typography variant="h5">
                      {currentIndex ? trim(currentIndex, 2) + " sSPICE" : <Skeleton type="text" />}

                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Zoom>
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
