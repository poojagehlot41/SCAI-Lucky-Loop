import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractService from "../services/contractService";

const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState("");
  const [loading, setLoading] = useState(false);

  const updateWalletState = async (address) => {
    try {
      if (!window.ethereum || !address) {
        setWalletAddress("");
        setNetwork("");
        setIsConnected(false);
        contractService.reset();
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const networkData = await provider.getNetwork();

      setWalletAddress(address);
      setNetwork(networkData.name);
      setIsConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const loadWallet = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);

      const accounts = await provider.send("eth_accounts", []);

      if (accounts.length > 0) {
        await updateWalletState(accounts[0]);
      } else {
        contractService.reset();
        setWalletAddress("");
        setNetwork("");
        setIsConnected(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return false;
      }

      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);

      const accounts = await provider.send(
        "eth_requestAccounts",
        []
      );

      if (!accounts.length) {
        setLoading(false);
        return false;
      }

      contractService.reset();

      await updateWalletState(accounts[0]);

      return true;
    } catch (error) {
      console.error(error);

      contractService.reset();

      setWalletAddress("");
      setNetwork("");
      setIsConnected(false);

      return false;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    contractService.reset();

    setWalletAddress("");
    setNetwork("");
    setIsConnected(false);
  };

  useEffect(() => {
    loadWallet();

    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        contractService.reset();
        await updateWalletState(accounts[0]);
      }
    };

    const handleChainChanged = async () => {
      contractService.reset();
      await loadWallet();
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
  }, []);

  return {
    walletAddress,
    isConnected,
    network,
    loading,
    connectWallet,
    disconnectWallet,
  };
};

export default useWallet;