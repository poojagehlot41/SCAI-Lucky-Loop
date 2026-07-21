import { useState } from "react";
import {
  ShieldCheck,
  Trophy,
  Play,
  Square,
  AlertTriangle,
} from "lucide-react";

import { useWalletContext } from "../context/WalletContext";
import contractService from "../services/contractService";

import "../styles/admin.css";

function Admin() {
  const {
    isConnected,
    connectWallet,
    loading,
    contractReady,
  } = useWalletContext();

  const [processing, setProcessing] = useState(false);

  const handlePickWinner = async () => {
    try {
      if (!isConnected) {
        await connectWallet();
        return;
      }

      if (!contractReady) {
        alert(
          "Smart contract has not been deployed yet."
        );
        return;
      }

      setProcessing(true);

      const contract = await contractService.getContract();

      if (!contract) {
        throw new Error("Contract unavailable.");
      }

      const tx = await contract.selectWinner();

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
      if (!isConnected) {
        await connectWallet();
        return;
      }

      if (!contractReady) {
        alert(
          "Smart contract has not been deployed yet."
        );
        return;
      }

      setProcessing(true);

      const contract = await contractService.getContract();

      if (!contract) {
        throw new Error("Contract unavailable.");
      }

      const tx = await contract.openLottery();

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
      if (!isConnected) {
        await connectWallet();
        return;
      }

      if (!contractReady) {
        alert(
          "Smart contract has not been deployed yet."
        );
        return;
      }

      setProcessing(true);

      const contract = await contractService.getContract();

      if (!contract) {
        throw new Error("Contract unavailable.");
      }

      const tx = await contract.closeLottery();

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
              Manage SCAI Lucky Loop lottery rounds and
              administrator operations.
            </p>

            {!isConnected ? (
              <button
                className="primary-btn"
                onClick={connectWallet}
                disabled={loading}
              >
                {loading
                  ? "Connecting..."
                  : "Connect Wallet"}
              </button>
            ) : (
              <>
                {!contractReady && (
                  <div className="admin-warning">
                    <AlertTriangle size={22} />

                    <div>
                      <strong>
                        Smart Contract Not Deployed
                      </strong>

                      <p>
                        Deploy the lottery contract first.
                        Admin actions will become available
                        automatically after deployment.
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
                        : "Pending Deployment"}
                    </strong>
                  </div>

                  <div className="status-card">
                    <span>Admin Access</span>

                    <strong className="status-live">
                      Granted
                    </strong>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Admin;