import { ethers } from "ethers";
import LotteryABI from "../contracts/LotteryABI";
import LotteryConfig from "../contracts/LotteryConfig";

class ContractService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
  }

  async initialize() {
    if (this.contract) {
      return this.contract;
    }

    if (!window.ethereum) {
      console.warn("MetaMask is not installed.");
      return null;
    }

    if (
      !LotteryConfig.CONTRACT_ADDRESS ||
      LotteryConfig.CONTRACT_ADDRESS.trim() === "" ||
      !LotteryABI ||
      LotteryABI.length === 0
    ) {
      console.warn("Lottery contract is not deployed yet.");
      return null;
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);

      await this.provider.send("eth_requestAccounts", []);

      this.signer = await this.provider.getSigner();

      this.contract = new ethers.Contract(
        LotteryConfig.CONTRACT_ADDRESS,
        LotteryABI,
        this.signer
      );

      return this.contract;
    } catch (error) {
      console.error("Contract initialization failed:", error);

      this.provider = null;
      this.signer = null;
      this.contract = null;

      return null;
    }
  }

  async getContract() {
    if (!this.contract) {
      await this.initialize();
    }

    return this.contract;
  }

  async getProvider() {
    if (!window.ethereum) return null;

    if (!this.provider) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }

    return this.provider;
  }

  async getSigner() {
    if (!this.signer) {
      await this.initialize();
    }

    return this.signer;
  }

  async getCurrentAccount() {
    try {
      if (!window.ethereum) return null;

      const provider = await this.getProvider();

      const accounts = await provider.send(
        "eth_accounts",
        []
      );

      return accounts.length ? accounts[0] : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getNetwork() {
    try {
      const provider = await this.getProvider();

      if (!provider) return null;

      const network = await provider.getNetwork();

      return network.name;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async isContractReady() {
    const contract = await this.getContract();
    return contract !== null;
  }

  reset() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
  }
}

export default new ContractService();