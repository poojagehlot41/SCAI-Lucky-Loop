import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { ethers } from "ethers";

import useWallet from "../hooks/useWallet";
import contractService from "../services/contractService";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const wallet = useWallet();

  const [balance, setBalance] = useState("0.0000");
  const [network, setNetwork] = useState("");
  const [contract, setContract] = useState(null);
  const [contractReady, setContractReady] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const resetWalletData = useCallback(() => {
    setBalance("0.0000");
    setNetwork("");
    setContract(null);
    setContractReady(false);
    contractService.reset();
  }, []);

  const initialize = useCallback(async () => {
    setInitializing(true);

    try {
      if (!wallet.isConnected || !wallet.walletAddress) {
        resetWalletData();
        return;
      }

      if (!window.ethereum) {
        resetWalletData();
        return;
      }

      const provider = new ethers.BrowserProvider(
        window.ethereum
      );

      const balanceWei = await provider.getBalance(
        wallet.walletAddress
      );

      setBalance(
        Number(
          ethers.formatEther(balanceWei)
        ).toFixed(4)
      );

      const networkInfo = await provider.getNetwork();
      setNetwork(networkInfo.name);

      const contractInstance =
        await contractService.getContract();

      if (contractInstance) {
        setContract(contractInstance);
        setContractReady(true);
      } else {
        setContract(null);
        setContractReady(false);
      }
    } catch (error) {
      console.error(error);
      resetWalletData();
    } finally {
      setInitializing(false);
    }
  }, [
    wallet.walletAddress,
    wallet.isConnected,
    resetWalletData,
  ]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async () => {
      await initialize();
    };

    const handleChainChanged = async () => {
      contractService.reset();
      await initialize();
    };

    window.ethereum.on(
      "accountsChanged",
      handleAccountsChanged
    );

    window.ethereum.on(
      "chainChanged",
      handleChainChanged
    );

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );

      window.ethereum.removeListener(
        "chainChanged",
        handleChainChanged
      );
    };
  }, [initialize]);

  const connectWallet = async () => {
    const connected = await wallet.connectWallet();

    if (connected) {
      await initialize();
    }

    return connected;
  };

  const disconnectWallet = () => {
    wallet.disconnectWallet();
    resetWalletData();
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress: wallet.walletAddress,
        isConnected: wallet.isConnected,
        loading:
          wallet.loading || initializing,

        connectWallet,
        disconnectWallet,

        balance,
        network,

        contract,
        contractReady,

        setBalance,
        setNetwork,
        setContract,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error(
      "useWalletContext must be used inside WalletProvider."
    );
  }

  return context;
};

export default WalletContext;