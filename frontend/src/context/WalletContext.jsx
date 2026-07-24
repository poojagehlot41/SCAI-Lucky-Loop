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

  const [rewardBalance, setRewardBalance] = useState("0");
  const [totalWins, setTotalWins] = useState(0);
  const [userTickets, setUserTickets] = useState([]);

  const resetWalletData = useCallback(() => {
    setBalance("0.0000");
    setNetwork("");

    setContract(null);
    setContractReady(false);

    setRewardBalance("0");
    setTotalWins(0);
    setUserTickets([]);

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

      const provider = new ethers.BrowserProvider(window.ethereum);

      const balanceWei = await provider.getBalance(
        wallet.walletAddress
      );

      setBalance(
        Number(
          ethers.formatEther(balanceWei)
        ).toFixed(4)
      );

      const networkInfo = await provider.getNetwork();

const chainId = Number(networkInfo.chainId);

if (chainId === 11155111) {
  setNetwork("Sepolia");
} else if (chainId === 31337) {
  setNetwork("Hardhat Local");
} else if (chainId === 1337) {
  setNetwork("Localhost");
} else {
  setNetwork(networkInfo.name);
}

      const contractInstance =
        await contractService.getContract();

      if (contractInstance) {
        setContract(contractInstance);
        setContractReady(true);

        try {
          const reward =
            await contractInstance.getRewardBalance(
              wallet.walletAddress
            );

          const wins =
            await contractInstance.getTotalWins(
              wallet.walletAddress
            );

          const tickets =
            await contractInstance.getUserTickets(
              wallet.walletAddress
            );

          setRewardBalance(reward.toString());
          setTotalWins(Number(wins));
          setUserTickets(tickets);
        } catch (error) {
          console.error(error);

          setRewardBalance("0");
          setTotalWins(0);
          setUserTickets([]);
        }
      } else {
        setContract(null);
        setContractReady(false);

        setRewardBalance("0");
        setTotalWins(0);
        setUserTickets([]);
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
        loading: wallet.loading || initializing,

        connectWallet,
        disconnectWallet,

        balance,
        network,

        rewardBalance,
        totalWins,
        userTickets,

        contract,
        contractReady,

        setBalance,
        setNetwork,

        setRewardBalance,
        setTotalWins,
        setUserTickets,

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