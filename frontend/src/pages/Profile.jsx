import {
  User,
  Wallet,
  Globe,
  Shield,
  Trophy,
  Ticket,
} from "lucide-react";

import { useWalletContext } from "../context/WalletContext";

import "../styles/profile.css";

function Profile() {
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

  return (
    <main className="profile-page">
      <section className="profile-section">
        <div className="container">
          <div className="profile-card">
            <div className="profile-avatar">
              <User size={42} />
            </div>

            <h1>User Profile</h1>

            <p>
              Manage your wallet and view your SCAI Lucky Loop profile
              information.
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
                <div className="profile-info">
                  <Wallet size={20} />

                  <div>
                    <span>Wallet Address</span>
                    <strong>{walletAddress}</strong>
                  </div>
                </div>

                <div className="profile-info">
                  <Globe size={20} />

                  <div>
                    <span>Network</span>
                    <strong>{network || "--"}</strong>
                  </div>
                </div>

                <div className="profile-info">
                  <Shield size={20} />

                  <div>
                    <span>Wallet Balance</span>
                    <strong>{balance} ETH</strong>
                  </div>
                </div>

                <div className="profile-info">
                  <Ticket size={20} />

                  <div>
                    <span>Total Tickets</span>
                    <strong>
                      {contractReady ? "Loading..." : "0"}
                    </strong>
                  </div>
                </div>

                <div className="profile-info">
                  <Trophy size={20} />

                  <div>
                    <span>Total Wins</span>
                    <strong>
                      {contractReady ? "Loading..." : "0"}
                    </strong>
                  </div>
                </div>

                <div className="profile-status">
                  <span>Wallet Status</span>

                  <strong className="status-connected">
                    Connected
                  </strong>
                </div>

                <div className="profile-status">
                  <span>Contract Status</span>

                  <strong
                    className={
                      contractReady
                        ? "status-connected"
                        : "status-pending"
                    }
                  >
                    {contractReady
                      ? "Connected"
                      : "Not Deployed Yet"}
                  </strong>
                </div>

                {!contractReady && (
                  <div className="profile-warning">
                    <p>
                      ⚠️ Smart contract has not been deployed yet.
                      Your wallet is connected successfully. Lottery
                      statistics will become available after deployment.
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

export default Profile;