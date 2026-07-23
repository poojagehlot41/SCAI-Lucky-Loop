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

const ADMIN_WALLET = "0x4aBb2b8724E3677Bd685e0036aDe9F2bD7d5A860";

function Admin() {
  const {
    walletAddress,
    isConnected,
    connectWallet,
    loading,
    contractReady,
  } = useWalletContext();

  const [processing, setProcessing] = useState(false);

  const isAdmin =
    isConnected &&
    walletAddress &&
    walletAddress.toLowerCase() ===
      ADMIN_WALLET.toLowerCase();

  const handlePickWinner = async () => {
    try {
      const contract = await contractService.getContract();

      const tx = await contract.selectWinner();

      setProcessing(true);

      await tx.wait();

      alert("🎉 Winner selected successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.reason ||
          error.message ||
          "Failed to select winner."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenLottery = async () => {
    try {
      const contract = await contractService.getContract();

      const tx = await contract.openLottery();

      setProcessing(true);

      await tx.wait();

      alert("Lottery opened successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.reason ||
          error.message ||
          "Failed to open lottery."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseLottery = async () => {
    try {
      const contract = await contractService.getContract();

      const tx = await contract.closeLottery();

      setProcessing(true);

      await tx.wait();

      alert("Lottery closed successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.reason ||
          error.message ||
          "Failed to close lottery."
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

              <h1>Admin Login Required</h1>

              <p>
                Connect the administrator wallet to continue.
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

  if (!isAdmin) {
    return (
      <main className="admin-page">
        <section className="admin-section">
          <div className="container">
            <div className="admin-card">
              <div className="admin-icon">
                <Lock size={45} />
              </div>

              <h1>Access Denied</h1>

              <p>
                This dashboard is restricted to the
                authorized administrator wallet only.
              </p>

              <div className="admin-warning">
                <AlertTriangle size={22} />

                <div>
                  <strong>Unauthorized Wallet</strong>

                  <p>
                    Current wallet is not registered
                    as the project administrator.
                  </p>
                </div>
              </div>
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

            <h1>Admin Dashboard</h1>

            <p>
              Manage SCAI Lucky Loop lottery rounds
              and administrator operations.
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
                  processing || !contractReady
                }
              >
                <Trophy size={18} />
                {processing
                  ? "Processing..."
                  : "Select Winner"}
              </button>

              <button
                className="secondary-btn"
                onClick={handleOpenLottery}
                disabled={
                  processing || !contractReady
                }
              >
                <Play size={18} />
                Open Lottery
              </button>

              <button
                className="secondary-btn"
                onClick={handleCloseLottery}
                disabled={
                  processing || !contractReady
                }
              >
                <Square size={18} />
                Close Lottery
              </button>
            </div>

            <div className="admin-status">
              <div className="admin-guide">
                <h2>Admin Controls</h2>

              <div className="guide-item">
               <strong>Open Lottery</strong>
                <p>
                  Starts a new lottery round and allows users to purchase tickets.
                </p>
             </div>
 
             <div className="guide-item">
                  <strong>Close Lottery</strong>
                <p>
                          Stops further ticket purchases and prepares the round for winner
                          selection.
               </p>
              </div>

              <div className="guide-item">
                      <strong>Select Winner</strong>
                   <p>
                           Randomly selects a winner from all purchased tickets and records
                           the result on-chain.
                  </p>
             </div>

            <div className="guide-item">
                     <strong>Transparency</strong>
               <p>
                       Every transaction is executed through the deployed smart contract,
                       ensuring secure and transparent lottery management.
                </p>
              </div>
            </div>
              <div className="status-card">
                <span>Wallet</span>
                <strong className="status-live">
                  Connected
                </strong>
              </div>

              <div className="status-card">
                <span>Contract</span>
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
                <span>Role</span>
                <strong className="status-live">
                  Administrator
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