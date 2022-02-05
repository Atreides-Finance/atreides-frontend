import { useState } from "react";
import { addresses } from "../../constants";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as sspiceTokenImg } from "../../assets/tokens/SSPICE.svg";
import { ReactComponent as spiceTokenImg } from "../../assets/tokens/SPICE.svg";

import "./spicemenu.scss";
import { usdt } from "src/helpers/AllBonds";
import { useWeb3Context } from "../../hooks/web3Context";

import SpiceImg from "src/assets/tokens/SPICE.svg";
import SSpiceImg from "src/assets/tokens/SSPICE.svg";

const addTokenToWallet = (tokenSymbol, tokenAddress) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    let tokenPath, decimals;
    switch (tokenSymbol) {
      case "SPICE":
        tokenPath = SpiceImg;
        decimals = 9;
        break;
      default:
        tokenPath = SSpiceImg;
        decimals = 9;
    }
    const imageURL = `${host}/${tokenPath}`;
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: decimals,
            image: imageURL,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

function SpiceMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { chainID } = useWeb3Context();

  const networkID = chainID;

  const SSPICE_ADDRESS = addresses[networkID].SSPICE_ADDRESS;
  const SPICE_ADDRESS = addresses[networkID].SPICE_ADDRESS;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = "spice-popper";
  const usdtAddress = usdt.getAddressForReserve(networkID);
  return (
    <Box
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="spice-menu-button-hover"
    >
      <Button id="spice-menu-button" size="large" variant="contained" color="secondary" title="SPICE" aria-describedby={id}>
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography>SPICE</Typography>
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="spice-menu" elevation={1}>
                <Box component="div" className="buy-tokens">
                  <Link
                    href={`https://app.yuzu-swap.com/#/swap?inputCurrency=${usdtAddress}&outputCurrency=${SPICE_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        Buy on YuzuSwap<SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>
                </Box>

                {isEthereumAPIAvailable ? (
                  <Box className="add-tokens">
                    <Divider color="secondary" />
                    <p>ADD TOKEN TO WALLET</p>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      <Button variant="contained" color="secondary" onClick={addTokenToWallet("SPICE", SPICE_ADDRESS)}>
                        <SvgIcon
                          component={spiceTokenImg}
                          viewBox="0 0 32 32"
                          style={{ height: "25px", width: "25px" }}
                        />
                        <Typography variant="body1">SPICE</Typography>
                      </Button>
                      <Button variant="contained" color="secondary" onClick={addTokenToWallet("sSPICE", SSPICE_ADDRESS)}>
                        <SvgIcon
                          component={sspiceTokenImg}
                          viewBox="0 0 32 32"
                          style={{ height: "25px", width: "25px" }}
                        />
                        <Typography variant="body1">sSPICE</Typography>
                      </Button>
                    </Box>
                  </Box>
                ) : null}
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
}

export default SpiceMenu;
