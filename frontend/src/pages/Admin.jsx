import { useState } from "react";
import {
  ShieldCheck,
  Trophy,
  Play,
  Square,
  AlertTriangle,
  Lock,
} from "lucide-react";

import { useWalletContext } from "../context/WalletContext";
import contractService from "../services/contractService";

import "../styles/admin.css";

function Admin() {
  const {
    walletAddress,
    isConnected,
    connectWallet,
    loading,
    contractReady,
  } = useWalletContext();

  const [processing, setProcessing] = useState(false);

  const handlePickWinner = async () => {
    try {
      setProcessing(true);

      const contract =
        await contractService.getContract();

      if (!contract) {
        throw new Error(
          "Contract unavailable."
        );
      }

      const tx =
        await contract.selectWinner();

      await tx.wait();

      alert(
        "🎉 Winner selected successfully."
      );
    } catch (error) {
      console.error(error);

      alert(
        error.reason ||
          error.shortMessage ||
          error.message ||
          "Failed to select winner."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenLottery = async () => {
    try {
      setProcessing(true);

      const contract =
        await contractService.getContract();

      const tx =
        await contract.openLottery();

      await tx.wait();

      alert(
        "Lottery opened successfully."
      );
    } catch (error) {
      console.error(error);

      alert(
        error.reason ||
          error.shortMessage ||
          error.message ||
          "Only the contract owner can open the lottery."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseLottery = async () => {
    try {
      setProcessing(true);

      const contract =
        await contractService.getContract();

      const tx =
        await contract.closeLottery();

      await tx.wait();

      alert(
        "Lottery closed successfully."
      );
    } catch (error) {
      console.error(error);

      alert(
        error.reason ||
          error.shortMessage ||
          error.message ||
          "Only the contract owner can close the lottery."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (!isConnected) {
    return (
      <main className="admin-page">
        <section className="admin-section">
          <div className="container">
            <div className="admin-card">

              <div className="admin-icon">
                <Lock size={45} />
              </div>

              <h1>
                Admin Login Required
              </h1>

              <p>
                Connect your wallet to access
                the administrator dashboard.
              </p>

              <button
                className="primary-btn"
                onClick={connectWallet}
                disabled={loading}
              >
                {loading
                  ? "Connecting..."
                  : "Connect Wallet"}
              </button>

            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-section">
        <div className="container">
          <div className="admin-card">

            <div className="admin-icon">
              <ShieldCheck size={42} />
            </div>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Manage SCAI Lucky Loop lottery
              rounds and administrator operations.
            </p>

            {!contractReady && (
              <div className="admin-warning">

                <AlertTriangle size={22} />

                <div>

                  <strong>
                    Smart Contract Not Ready
                  </strong>

                  <p>
                    Deploy the contract before
                    performing admin actions.
                  </p>

                </div>

              </div>
            )}

            <div className="admin-actions">

              <button
                className="primary-btn"
                onClick={handlePickWinner}
                disabled={
                  processing ||
                  !contractReady
                }
              >
                <Trophy size={18} />

                {processing
                  ? "Processing..."
                  : "Run Winner Selection"}
              </button>

              <button
                className="secondary-btn"
                onClick={handleOpenLottery}
                disabled={
                  processing ||
                  !contractReady
                }
              >
                <Play size={18} />

                Open Lottery
              </button>

              <button
                className="secondary-btn"
                onClick={handleCloseLottery}
                disabled={
                  processing ||
                  !contractReady
                }
              >
                <Square size={18} />

                Close Lottery
              </button>

            </div>

            <div className="admin-status">

              <div className="admin-guide">

                <h2>
                  Admin Controls
                </h2>

                <div className="guide-item">

                  <strong>
                    Run Winner Selection
                  </strong>

                  <p>
                    After the configured lottery
                    period and result delay, the
                    winner can be selected from
                    the purchased tickets.
                  </p>

                </div>

                <div className="guide-item">

                  <strong>
                    Open Lottery
                  </strong>

                  <p>
                    Starts a new lottery round.
                    This action requires the
                    contract owner.
                  </p>

                </div>

                <div className="guide-item">

                  <strong>
                    Close Lottery
                  </strong>

                  <p>
                    Stops further ticket purchases
                    and prepares the round for
                    winner selection. This action
                    requires the contract owner.
                  </p>

                </div>

                <div className="guide-item">

                  <strong>
                    Transparency
                  </strong>

                  <p>
                    Lottery actions are executed
                    through the deployed smart
                    contract.
                  </p>

                </div>

              </div>

              <div className="status-card">

                <span>
                  Wallet
                </span>

                <strong className="status-live">
                  Connected
                </strong>

              </div>

              <div className="status-card">

                <span>
                  Contract
                </span>

                <strong
                  className={
                    contractReady
                      ? "status-live"
                      : "status-pending"
                  }
                >
                  {contractReady
                    ? "Active"
                    : "Pending"}
                </strong>

              </div>

              <div className="status-card">

                <span>
                  Connected Address
                </span>

                <strong>
                  {walletAddress
                    ? `${walletAddress.slice(
                        0,
                        8
                      )}...${walletAddress.slice(
                        -6
                      )}`
                    : "--"}
                </strong>

              </div>

            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

export default Admin;