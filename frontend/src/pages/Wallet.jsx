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

  const [rewardBalance, setRewardBalance] = useState("0.0000");
  const [totalWins, setTotalWins] = useState(0);
  const [userTickets, setUserTickets] = useState([]);

  const resetWalletData = useCallback(() => {
    setBalance("0.0000");
    setNetwork("");
    setContract(null);
    setContractReady(false);
    setRewardBalance("0.0000");
    setTotalWins(0);
    setUserTickets([]);

    contractService.reset();
  }, []);

  const initialize = useCallback(async () => {
    if (!wallet.isConnected || !wallet.walletAddress) {
      resetWalletData();
      setInitializing(false);
      return;
    }

    if (!window.ethereum) {
      resetWalletData();
      setInitializing(false);
      return;
    }

    setInitializing(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // ETH balance
      const balanceWei = await provider.getBalance(
        wallet.walletAddress
      );

      setBalance(
        Number(ethers.formatEther(balanceWei)).toFixed(4)
      );

      // Network
      const networkInfo = await provider.getNetwork();

      let networkName = networkInfo.name;

      if (!networkName || networkName === "unknown") {
        networkName = `Chain ID: ${networkInfo.chainId}`;
      }

      setNetwork(networkName);

      // Lottery contract
      const contractInstance =
        await contractService.getContract();

      if (!contractInstance) {
        setContract(null);
        setContractReady(false);
        setRewardBalance("0.0000");
        setTotalWins(0);
        setUserTickets([]);
        return;
      }

      setContract(contractInstance);
      setContractReady(true);

      // ==================================================
      // ACTUAL LOTTERY REWARD BALANCE
      // DO NOT USE SCAI TOKEN balanceOf()
      // ==================================================
      try {
        const reward =
          await contractInstance.getRewardBalance(
            wallet.walletAddress
          );

        const formattedReward =
          ethers.formatEther(reward);

        setRewardBalance(
          Number(formattedReward).toFixed(4)
        );

        console.log(
          "Lottery Reward Balance:",
          formattedReward,
          "SCAI"
        );
      } catch (error) {
        console.error(
          "Lottery reward balance read failed:",
          error
        );

        setRewardBalance("0.0000");
      }

      // Total wins
      try {
        const wins =
          await contractInstance.getTotalWins(
            wallet.walletAddress
          );

        setTotalWins(Number(wins));
      } catch (error) {
        console.error(
          "Total wins read failed:",
          error
        );

        setTotalWins(0);
      }

      // User tickets
      try {
        const tickets =
          await contractInstance.getUserTickets(
            wallet.walletAddress
          );

        setUserTickets(tickets || []);
      } catch (error) {
        console.error(
          "User tickets read failed:",
          error
        );

        setUserTickets([]);
      }
    } catch (error) {
      console.error(
        "Wallet/contract initialization failed:",
        error
      );

      setContract(null);
      setContractReady(false);
      setRewardBalance("0.0000");
      setTotalWins(0);
      setUserTickets([]);
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

  // MetaMask events
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = () => {
      contractService.reset();

      setInitializing(true);

      setTimeout(() => {
        initialize();
      }, 300);
    };

    const handleChainChanged = () => {
      contractService.reset();

      setTimeout(() => {
        initialize();
      }, 300);
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
    return await wallet.connectWallet();
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