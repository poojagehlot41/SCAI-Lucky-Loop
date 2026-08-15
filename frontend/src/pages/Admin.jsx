import { useState } from "react";
import {
  ShieldCheck,
  Trophy,
  Play,
  Square,
  Lock,
  LogIn,
} from "lucide-react";

import { useWalletContext } from "../context/WalletContext";
import contractService from "../services/contractService";

import "../styles/admin.css";

// Change this password if you want a different admin password.
const ADMIN_PASSWORD = "SCAIAdmin@2026";

function Admin() {
  const {
    walletAddress,
    isConnected,
    connectWallet,
    loading,
    contractReady,
  } = useWalletContext();

  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError("");
      setPassword("");
    } else {
      setPasswordError("Incorrect admin password.");
    }
  };

  const handlePickWinner = async () => {
    try {
      setProcessing(true);

      const contract =
        await contractService.getContract();

      if (!contract) {
        throw new Error("Contract unavailable.");
      }

      // Winner is selected randomly by the smart contract.
      // Admin does NOT choose the winner manually.
      const tx = await contract.selectWinner();

      await tx.wait();

      alert("🎉 Winner selected randomly and successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.reason ||
          error.shortMessage ||
          error.message ||
          "Winner selection failed."
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

      if (!contract) {
        throw new Error("Contract unavailable.");
      }

      const tx =
        await contract.openLottery();

      await tx.wait();

      alert("Lottery opened successfully.");
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

      if (!contract) {
        throw new Error("Contract unavailable.");
      }

      const tx =
        await contract.closeLottery();

      await tx.wait();

      alert("Lottery closed successfully.");
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

  // -------------------------
  // PASSWORD LOGIN
  // -------------------------

  if (!authenticated) {
    return (
      <main className="admin-page">
        <section className="admin-section">
          <div className="container">
            <div className="admin-card">

              <div className="admin-icon">
                <Lock size={45} />
              </div>

              <h1>Admin Login</h1>

              <p>
                Enter the administrator password
                to access the dashboard.
              </p>

              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Enter admin password"
                  className="admin-password-input"
                />

                {passwordError && (
                  <p className="admin-password-error">
                    {passwordError}
                  </p>
                )}

                <button
                  type="submit"
                  className="primary-btn"
                >
                  <LogIn size={18} />
                  Login
                </button>
              </form>

            </div>
          </div>
        </section>
      </main>
    );
  }

  // -------------------------
  // ADMIN DASHBOARD
  // -------------------------

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
              Manage SCAI Lucky Loop lottery
              rounds and administrator operations.
            </p>

            <div className="admin-actions">

              <button
                className="primary-btn"
                onClick={handlePickWinner}
                disabled={processing}
              >
                <Trophy size={18} />

                {processing
                  ? "Processing..."
                  : "Select Random Winner"}
              </button>

              <button
                className="secondary-btn"
                onClick={handleOpenLottery}
                disabled={processing}
              >
                <Play size={18} />

                Open Lottery
              </button>

              <button
                className="secondary-btn"
                onClick={handleCloseLottery}
                disabled={processing}
              >
                <Square size={18} />

                Close Lottery
              </button>

            </div>

            <div className="admin-status">

              <div className="admin-guide">

                <h2>Admin Controls</h2>

                <div className="guide-item">
                  <strong>
                    Random Winner Selection
                  </strong>

                  <p>
                    The smart contract randomly
                    selects the winner. The admin
                    cannot manually choose a winner.
                  </p>
                </div>

                <div className="guide-item">
                  <strong>
                    Open Lottery
                  </strong>

                  <p>
                    Starts a new lottery round.
                  </p>
                </div>

                <div className="guide-item">
                  <strong>
                    Close Lottery
                  </strong>

                  <p>
                    Stops ticket purchases for
                    the current lottery round.
                  </p>
                </div>

                <div className="guide-item">
                  <strong>
                    Winner Reward
                  </strong>

                  <p>
                    The winner receives a reward
                    balance and can claim the
                    SCAI tokens to their wallet.
                  </p>
                </div>

              </div>

              <div className="status-card">
                <span>Admin Access</span>

                <strong className="status-live">
                  Authorized
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
                <span>Connected Wallet</span>

                <strong>
                  {isConnected && walletAddress
                    ? `${walletAddress.slice(
                        0,
                        8
                      )}...${walletAddress.slice(-6)}`
                    : "Required for transaction"}
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