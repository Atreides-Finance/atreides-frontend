const switchRequest = () => {
    return window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xa516" }],
    });
};

const addChainRequest = () => {
    return window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
            {
                chainId: "0xa516",
                chainName: "Emerald Paratime Mainnet",
                rpcUrls: ["https://emerald.oasis.dev"],
                blockExplorerUrls: ["https://explorer.emerald.oasis.dev/"],
                nativeCurrency: {
                    name: "ROSE",
                    symbol: "ROSE",
                    decimals: 18,
                },
            },
        ],
    });
};

export const switchNetwork = async () => {
    if (window.ethereum) {
        try {
            await switchRequest();
        } catch (error: any) {
            if (error.code === 4902) {
                try {
                    await addChainRequest();
                    await switchRequest();
                } catch (addError) {
                    console.log(error);
                }
            }
            console.log(error);
        }
    }
};
