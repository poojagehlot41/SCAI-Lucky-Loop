import {
  Gift,
  Copy,
  CheckCircle,
  Users,
  Wallet,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useWalletContext } from "../context/WalletContext";
import contractService from "../services/contractService";

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
  const [referralCount, setReferralCount] = useState(0);
  const [referralRewards, setReferralRewards] = useState("0");
  const [referrer, setReferrer] = useState("");
  const [registering, setRegistering] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const referralAddress = params.get("ref");

  const referralLink = isConnected
    ? `${window.location.origin}/referral?ref=${walletAddress}`
    : "";

  const loadReferralData = async () => {
    try {
      const contract = await contractService.getContract();

      if (!contract || !walletAddress) {
        return;
      }

      const count = await contract.getReferralCount(
        walletAddress
      );

      const rewards = await contract.getReferralRewards(
        walletAddress
      );

      const userReferrer = await contract.getReferrer(
        walletAddress
      );

      setReferralCount(Number(count));

      setReferralRewards(
        Number(ethers.formatEther(rewards)).toFixed(4)
      );

      if (
        userReferrer &&
        userReferrer !==
          "0x0000000000000000000000000000000000000000"
      ) {
        setReferrer(userReferrer);
      } else {
        setReferrer("");
      }
    } catch (error) {
      console.error(
        "Referral data loading failed:",
        error
      );

      setReferralCount(0);
      setReferralRewards("0");
      setReferrer("");
    }
  };

  useEffect(() => {
    if (isConnected && contractReady) {
      loadReferralData();
    }
  }, [
    isConnected,
    contractReady,
    walletAddress,
  ]);

  const copyReferral = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(
        referralLink
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const registerReferral = async () => {
    try {
      if (!isConnected) {
        const connected = await connectWallet();

        if (!connected) {
          return;
        }

        return;
      }

      if (!contractReady) {
        alert(
          "Unable to connect to the smart contract."
        );
        return;
      }

      if (!referralAddress) {
        alert("No referral link detected.");
        return;
      }

      if (!ethers.isAddress(referralAddress)) {
        alert("Invalid referral address.");
        return;
      }

      if (
        referralAddress.toLowerCase() ===
        walletAddress.toLowerCase()
      ) {
        alert(
          "You cannot use your own referral link."
        );
        return;
      }

      setRegistering(true);

      const contract =
        await contractService.getContract();

      if (!contract) {
        throw new Error(
          "Contract unavailable."
        );
      }

      const existingReferrer =
        await contract.getReferrer(
          walletAddress
        );

      if (
        existingReferrer &&
        existingReferrer !==
          "0x0000000000000000000000000000000000000000"
      ) {
        alert(
          "Referral is already registered for this wallet."
        );

        await loadReferralData();
        return;
      }

      const tx =
        await contract.registerReferral(
          referralAddress
        );

      await tx.wait();

      alert(
        "🎉 Referral registered successfully!"
      );

      await loadReferralData();
    } catch (error) {
      console.error(
        "Referral registration failed:",
        error
      );

      const message =
        error.reason ||
        error.shortMessage ||
        error.message ||
        "Referral registration failed.";

      alert(message);
    } finally {
      setRegistering(false);
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
              Invite friends to join SCAI Lucky Loop.
              Share your referral link and earn
              rewards when your referrals participate
              in the lottery.
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
                <div className="referral-box">
                  <span>
                    Your Referral Link
                  </span>

                  <div className="referral-link">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                    />

                    <button
                      className="copy-btn"
                      onClick={copyReferral}
                      title="Copy Referral Link"
                    >
                      {copied ? (
                        <CheckCircle size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {referralAddress && (
                  <div className="referral-box">
                    <span>
                      Referral Invitation
                    </span>

                    <p>
                      You opened this page using a
                      referral link.
                    </p>

                    <button
                      className="primary-btn"
                      onClick={registerReferral}
                      disabled={
                        registering ||
                        !!referrer
                      }
                    >
                      <UserPlus size={18} />

                      {registering
                        ? "Registering..."
                        : referrer
                        ? "Referral Registered"
                        : "Activate Referral"}
                    </button>
                  </div>
                )}

                <div className="referral-stats">

                  <div className="stat-card">
                    <Users size={24} />

                    <h2>
                      {referralCount}
                    </h2>

                    <p>
                      Total Referrals
                    </p>
                  </div>

                  <div className="stat-card">
                    <Gift size={24} />

                    <h2>
                      {referralRewards} ETH
                    </h2>

                    <p>
                      Rewards Earned
                    </p>
                  </div>

                  <div className="stat-card">
                    <Wallet size={24} />

                    <h2>
                      {contractReady
                        ? "Live"
                        : "Pending"}
                    </h2>

                    <p>
                      Contract Status
                    </p>
                  </div>

                </div>

                <div className="wallet-info">
                  <span>
                    Referral Status
                  </span>

                  <strong
                    className={
                      referrer
                        ? "status-live"
                        : "status-pending"
                    }
                  >
                    {referrer
                      ? "Registered"
                      : "Not Registered"}
                  </strong>
                </div>

                {referrer && (
                  <div className="wallet-info">
                    <span>
                      Referred By
                    </span>

                    <strong>
                      {referrer.slice(0, 8)}
                      ...
                      {referrer.slice(-6)}
                    </strong>
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