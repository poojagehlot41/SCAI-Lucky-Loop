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

  const [balance, setBalance] = useState("0.000");
  const [network, setNetwork] = useState("");
  const [contract, setContract] = useState(null);
  const [contractReady, setContractReady] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const [rewardBalance, setRewardBalance] = useState("0.0000");
  const [totalWins, setTotalWins] = useState(0);
  const [userTickets, setUserTickets] = useState([]);

  const resetWalletData = useCallback(() => {
    setBalance("0.000");
    setNetwork("");
    setContract(null);
    setContractReady(false);
    setRewardBalance("0.0000");
    setTotalWins(0);
    setUserTickets([]);

    contractService.reset();
  }, []);

  const initialize = useCallback(async () => {
    if (
      !wallet.isConnected ||
      !wallet.walletAddress ||
      !window.ethereum
    ) {
      resetWalletData();
      setInitializing(false);
      return;
    }

    setInitializing(true);

    try {
      const provider = new ethers.BrowserProvider(
        window.ethereum
      );

      const balanceWei = await provider.getBalance(
        wallet.walletAddress
      );

      setBalance(
        Number(
          ethers.formatEther(balanceWei)
        ).toFixed(3)
      );

      const networkInfo =
        await provider.getNetwork();

      const chainId =
        Number(networkInfo.chainId);

      setNetwork(
        networkInfo.name &&
        networkInfo.name !== "unknown"
          ? networkInfo.name
          : `Chain ID: ${chainId}`
      );

      const contractInstance =
        await contractService.getContract();

      if (!contractInstance) {
        resetWalletData();
        return;
      }

      setContract(contractInstance);
      setContractReady(true);

      // IMPORTANT:
      // Actual SCAI reward balance
      // comes from getRewardBalance().
      try {
        const rewards =
          await contractInstance.getRewardBalance(
            wallet.walletAddress
          );

        setRewardBalance(
          Number(
            ethers.formatEther(rewards)
          ).toFixed(4)
        );
      } catch (error) {
        console.error(
          "SCAI reward balance read failed:",
          error
        );

        setRewardBalance("0.0000");
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

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (
      accounts
    ) => {
      contractService.reset();

      if (
        !accounts ||
        accounts.length === 0
      ) {
        resetWalletData();
        return;
      }

      setInitializing(true);
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
  }, [
    initialize,
    resetWalletData,
  ]);

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
        walletAddress:
          wallet.walletAddress,

        isConnected:
          wallet.isConnected,

        loading:
          wallet.loading ||
          initializing,

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