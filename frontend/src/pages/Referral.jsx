import { Gift, Copy, CheckCircle, Users, Wallet } from "lucide-react";
import { useState } from "react";

import { useWalletContext } from "../context/WalletContext";

import "../styles/referral.css";

function Referral() {
  const {
    walletAddress,
    isConnected,
    connectWallet,
    loading,
    contractReady,
  } = useWalletContext();

  const [copied, setCopied] = useState(false);

  const referralLink = isConnected
    ? `${window.location.origin}/referral?ref=${walletAddress}`
    : "";

  const copyReferral = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="referral-page">
      <section className="referral-section">
        <div className="container">
          <div className="referral-card">
            <div className="referral-icon">
              <Gift size={42} />
            </div>

            <h1>Referral Program</h1>

            <p>
              Invite friends to join SCAI Lucky Loop. Share your referral
              link and earn rewards after smart contract deployment.
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
                <div className="referral-box">
                  <span>Your Referral Link</span>

                  <div className="referral-link">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                    />

                    <button
                      className="copy-btn"
                      onClick={copyReferral}
                    >
                      {copied ? (
                        <CheckCircle size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="referral-stats">
                  <div className="stat-card">
                    <Users size={24} />
                    <h2>0</h2>
                    <p>Total Referrals</p>
                  </div>

                  <div className="stat-card">
                    <Gift size={24} />
                    <h2>0 SCAI</h2>
                    <p>Rewards Earned</p>
                  </div>

                  <div className="stat-card">
                    <Wallet size={24} />
                    <h2>
                      {contractReady ? "Live" : "Pending"}
                    </h2>
                    <p>Contract Status</p>
                  </div>
                </div>

                {!contractReady && (
                  <div className="referral-warning">
                    <p>
                      ⚠️ Smart contract is not deployed yet. Your referral
                      link is ready, but referral rewards will become active
                      after blockchain deployment.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Referral;