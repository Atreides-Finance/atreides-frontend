import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
} from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import { BondDataCard, BondTableData } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { formatCurrency } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import ClaimBonds from "./ClaimBonds";
import _ from "lodash";
import { allBondsMap } from "src/helpers/AllBonds";
import { INVESTMENT } from "src/constants";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";

function ChooseBond() {
  const { bonds } = useBonds();
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const isAppLoading = useSelector(state => state.app.loading);
  const isAccountLoading = useSelector(state => state.account.loading);

  const accountBonds = useSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });


  const treasuryBalance = useSelector(state => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0;
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased;
        }
      }
      return tokenBalances;
    }
  });

  return (
    <>
      <div id="choose-bond-view">
        {!isAccountLoading && !_.isEmpty(accountBonds) && <ClaimBonds activeBonds={accountBonds} />}


      </div>
      <div id="choose-bond-view">
        <Zoom in={true}>
          <Paper className="atreides-card">
            <Box className="card-header">
              <Typography variant="h5">Bond (1,1)</Typography>
            </Box>

            {!isSmallScreen && (
              <Grid container item>
                <TableContainer>
                  <Table aria-label="Available bonds">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Bond</TableCell>
                        <TableCell align="left">Price</TableCell>
                        <TableCell align="left">ROI (5 days)</TableCell>
                        <TableCell align="right">Purchased</TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bonds
                        .map(bond => (
                          <BondTableData key={bond.name} bond={bond} />
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
          </Paper>
        </Zoom>

        {isSmallScreen && (
          <Box className="atreides-card-container">
            <Grid container item spacing={2}>
              {bonds
                .map(bond => (
                  <Grid item xs={12} key={bond.name}>
                    <BondDataCard key={bond.name} bond={bond} />
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}
      </div>
    </>
  );
}

export default ChooseBond;
