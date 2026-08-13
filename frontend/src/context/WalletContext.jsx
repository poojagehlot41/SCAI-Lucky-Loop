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

        setRewardBalance("0");
        setTotalWins(0);
        setUserTickets([]);

        return;
      }

      console.log(
        "Contract connected:",
        contractInstance.target
      );

      // IMPORTANT:
      // Set contract ready immediately after successful
      // contract initialization.
      setContract(contractInstance);
      setContractReady(true);

      // Read contract data independently.
      try {
        const reward =
          await contractInstance.getRewardBalance(
            wallet.walletAddress
          );

        setRewardBalance(
          Number(
            ethers.formatEther(reward)
          ).toFixed(4)
        );
      } catch (error) {
        console.error(
          "Reward balance read failed:",
          error
        );

        setRewardBalance("0");
      }

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

      // Do NOT destroy the contract state unless
      // the actual contract initialization failed.
      setContract(null);
      setContractReady(false);

      setRewardBalance("0");
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

  // Initialize after wallet state is actually updated.
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

      // useWallet will update its own state,
      // then initialize() will run from the state change.
      setInitializing(true);
    };

    const handleChainChanged = async () => {
      contractService.reset();

      // Give MetaMask time to finish switching network.
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

  // IMPORTANT:
  // Do NOT call initialize() immediately after
  // wallet.connectWallet().
  // React state needs to update first.
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