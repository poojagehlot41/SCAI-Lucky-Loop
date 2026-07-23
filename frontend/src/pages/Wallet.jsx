import { Wallet as WalletIcon, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

import { useWalletContext } from "../context/WalletContext";

import "../styles/wallet.css";

function Wallet() {
  const {
    walletAddress,
    isConnected,
    network,
    balance,
    connectWallet,
    disconnectWallet,
    loading,
    contractReady,
  } = useWalletContext();

  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (!walletAddress) return;

    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="wallet-page">
      <section className="wallet-hero">
        <div className="container">
          <div className="wallet-card">
            <div className="wallet-icon">
              <WalletIcon size={42} />
            </div>

            <h1>Wallet Dashboard</h1>

            <p>
              Connect your wallet to access SCAI Lucky Loop and interact with
              the lottery smart contract.
            </p>

            {!isConnected ? (
              <button
                className="primary-btn"
                onClick={connectWallet}
                disabled={loading}
              >
                {loading ? "Connecting..." : "Connect Wallet"}
              </button>
            ) : (
              <>
                <div className="wallet-info">
                  <span>Wallet Address</span>

                  <div className="wallet-address">
                    <strong>
                      {walletAddress.slice(0, 8)}...
                      {walletAddress.slice(-6)}
                    </strong>

                    <button
                      className="copy-btn"
                      onClick={copyAddress}
                      title="Copy Address"
                    >
                      {copied ? (
                        <CheckCircle size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="wallet-info">
                  <span>Network</span>
                  <strong>{network || "Ethereum Sepolia"}</strong>
                </div>

                <div className="wallet-info">
                  <span>Balance</span>
                  <strong>{balance} ETH</strong>
                </div>

                <div className="wallet-info">
                  <span>Wallet Status</span>

                  <strong className="status-live">
                    Connected
                  </strong>
                </div>

                <div className="wallet-info">
                  <span>Smart Contract</span>

                  <strong
                    className={
                      contractReady
                        ? "status-live"
                        : "status-pending"
                    }
                  >
                    {contractReady
                      ? "Connected"
                      : "Connection Failed"}
                  </strong>
                </div>

                {!contractReady && (
                  <div className="wallet-warning">
                    <p>
                      ⚠️ Unable to connect to the smart contract. Please check
                      your wallet network and try again.
                    </p>
                  </div>
                )}

                <button
                  className="secondary-btn"
                  onClick={disconnectWallet}
                >
                  Disconnect Wallet
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Wallet;