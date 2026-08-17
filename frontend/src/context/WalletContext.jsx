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
      const provider = new ethers.BrowserProvider(
        window.ethereum
      );

      console.log("Initializing wallet...");
      console.log("Wallet:", wallet.walletAddress);

      // Wallet balance
      const balanceWei = await provider.getBalance(
        wallet.walletAddress
      );

      setBalance(
        Number(
          ethers.formatEther(balanceWei)
        ).toFixed(4)
      );

      // Network
      const networkInfo = await provider.getNetwork();
      const chainId = Number(networkInfo.chainId);

      console.log("Network:", networkInfo);
      console.log("Chain ID:", chainId);

      let networkName = networkInfo.name;

      if (
        !networkName ||
        networkName === "unknown"
      ) {
        networkName = `Chain ID: ${chainId}`;
      }

      setNetwork(networkName);

      // Contract
      const contractInstance =
        await contractService.getContract();

      if (!contractInstance) {
        console.error(
          "Contract instance could not be created."
        );

        setContract(null);
        setContractReady(false);

        setRewardBalance("0.0000");
        setTotalWins(0);
        setUserTickets([]);

        return;
      }

      console.log(
        "Contract connected:",
        contractInstance.target
      );

      setContract(contractInstance);
      setContractReady(true);

      // --------------------------------------------------
      // REWARD BALANCE
      // Use the same source as Referral page
      // --------------------------------------------------
      try {
        const rewards =
          await contractInstance.getReferralRewards(
            wallet.walletAddress
          );

        const formattedRewards = Number(
          ethers.formatEther(rewards)
        ).toFixed(4);

        setRewardBalance(formattedRewards);

        console.log(
          "Reward Balance:",
          formattedRewards,
          "ETH"
        );
      } catch (error) {
        console.error(
          "Reward balance read failed:",
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

  // Initialize after wallet state is updated
  useEffect(() => {
    initialize();
  }, [initialize]);

  // MetaMask events
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      contractService.reset();

      if (!accounts || accounts.length === 0) {
        resetWalletData();
        return;
      }

      setInitializing(true);
    };

    const handleChainChanged = async () => {
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
  }, [initialize, resetWalletData]);

  const connectWallet = async () => {
    const connected =
      await wallet.connectWallet();

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
  const context =
    useContext(WalletContext);

  if (!context) {
    throw new Error(
      "useWalletContext must be used inside WalletProvider."
    );
  }

  return context;
};

export default WalletContext;