import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractService from "../services/contractService";

const SEPOLIA_CHAIN_ID = 11155111;

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

      const chainId = Number(networkData.chainId);

      if (chainId !== SEPOLIA_CHAIN_ID) {
        setWalletAddress(address);
        setNetwork("Wrong Network");
        setIsConnected(false);
        contractService.reset();

        console.warn(
          `Wrong network. Please switch to Sepolia. Current Chain ID: ${chainId}`
        );

        return;
      }

      setWalletAddress(address);
      setNetwork("Sepolia");
      setIsConnected(true);
    } catch (error) {
      console.error("Wallet state update failed:", error);

      setWalletAddress("");
      setNetwork("");
      setIsConnected(false);

      contractService.reset();
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
      console.error("Wallet loading failed:", error);
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
        return false;
      }

      const networkData = await provider.getNetwork();
      const chainId = Number(networkData.chainId);

      if (chainId !== SEPOLIA_CHAIN_ID) {
        contractService.reset();

        setWalletAddress(accounts[0]);
        setNetwork("Wrong Network");
        setIsConnected(false);

        alert(
          "Please switch MetaMask to the Sepolia Test Network."
        );

        return false;
      }

      contractService.reset();

      await updateWalletState(accounts[0]);

      return true;
    } catch (error) {
      console.error("Wallet connection failed:", error);

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