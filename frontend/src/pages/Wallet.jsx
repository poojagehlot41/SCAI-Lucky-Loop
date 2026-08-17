import {
  Wallet as WalletIcon,
  Copy,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useWalletContext } from "../context/WalletContext";
import contractService from "../services/contractService";

import "../styles/wallet.css";

function Wallet() {
  const {
    walletAddress,
    isConnected,
    network,
    balance,
    rewardBalance,
    totalWins,
    userTickets,
    connectWallet,
    disconnectWallet,
    loading,
    contractReady,
  } = useWalletContext();

  const [copied, setCopied] = useState(false);
  const [resultTime, setResultTime] = useState("--");
  const [walletReward, setWalletReward] = useState("0");

  // Today's tickets only
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  // Previous 7 days, excluding today
  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const todayTickets = userTickets.filter((ticket) => {
    const ticketDate = new Date(
      Number(ticket.timestamp) * 1000
    );

    return (
      ticketDate >= todayStart &&
      ticketDate < tomorrowStart
    );
  });

  const previousWeekTickets = userTickets.filter((ticket) => {
    const ticketDate = new Date(
      Number(ticket.timestamp) * 1000
    );

    return (
      ticketDate >= sevenDaysAgo &&
      ticketDate < todayStart
    );
  });

  useEffect(() => {
    const loadResultTime = async () => {
      try {
        if (!isConnected || !contractReady) {
          setResultTime("--");
          return;
        }

        const contract =
          await contractService.getContract();

        if (!contract) {
          setResultTime("--");
          return;
        }

        const lotteryEndTime =
          await contract.lotteryEndTime();

        const resultDelay =
          await contract.lotteryResultDelay();

        const expectedResultTimestamp =
          (Number(lotteryEndTime) +
            Number(resultDelay)) *
          1000;

        setResultTime(
          new Date(
            expectedResultTimestamp
          ).toLocaleString()
        );
      } catch (error) {
        console.error(
          "Result time loading failed:",
          error
        );

        setResultTime("--");
      }
    };

    loadResultTime();
  }, [isConnected, contractReady]);

  // Load the same referral reward shown on the Referral page
  useEffect(() => {
    const loadWalletReward = async () => {
      try {
        if (
          !isConnected ||
          !contractReady ||
          !walletAddress
        ) {
          setWalletReward("0");
          return;
        }

        const contract =
          await contractService.getContract();

        if (!contract) {
          setWalletReward("0");
          return;
        }

        const rewards =
          await contract.getReferralRewards(
            walletAddress
          );

        setWalletReward(
          Number(
            ethers.formatEther(rewards)
          ).toFixed(4)
        );
      } catch (error) {
        console.error(
          "Wallet reward loading failed:",
          error
        );

        setWalletReward("0");
      }
    };

    loadWalletReward();
  }, [
    isConnected,
    contractReady,
    walletAddress,
  ]);

  const copyAddress = async () => {
    if (!walletAddress) return;

    try {
      await navigator.clipboard.writeText(
        walletAddress
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const renderTicket = (
    ticket,
    index,
    showTodayPurchase = false
  ) => (
    <div
      key={`${ticket.ticketNumber}-${ticket.lotteryId}-${index}`}
      className="ticket-card"
    >
      <p>
        <strong>Ticket #</strong>{" "}
        {ticket.ticketNumber.toString()}
      </p>

      <p>
        <strong>Lottery ID</strong>{" "}
        {ticket.lotteryId.toString()}
      </p>

      <p>
        <strong>Purchased</strong>{" "}
        {new Date(
          Number(ticket.timestamp) * 1000
        ).toLocaleString()}
      </p>

      {showTodayPurchase && (
        <p>
          <strong>Today Purchase</strong> Yes
        </p>
      )}

      <p>
        <strong>Status</strong>{" "}
        {ticket.winner
          ? "🏆 Winner"
          : "❌ Not Winner"}
      </p>
    </div>
  );

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
              Connect your wallet to access SCAI Lucky Loop
              and interact with the lottery smart contract.
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
                  <strong>
                    {network || "--"}
                  </strong>
                </div>

                <div className="wallet-info">
                  <span>Balance</span>
                  <strong>
                    {balance} ETH
                  </strong>
                </div>

                <div className="wallet-info">
                  <span>Reward Balance</span>

                  <strong>
                    {walletReward} ETH
                  </strong>
                </div>

                <div className="wallet-info">
                  <span>Total Wins</span>

                  <strong>
                    {totalWins}
                  </strong>
                </div>

                <div className="wallet-info">
                  <span>Reward Status</span>

                  <strong
                    className={
                      Number(walletReward) > 0
                        ? "status-live"
                        : "status-pending"
                    }
                  >
                    {Number(walletReward) > 0
                      ? "Reward Earned"
                      : "No Reward Yet"}
                  </strong>
                </div>

                <div className="wallet-info">
                  <span>Expected Result Time</span>

                  <strong>
                    {resultTime}
                  </strong>
                </div>

                <div className="wallet-info">
                  <span>How Rewards Work</span>

                  <p>
                    Referral rewards are recorded on-chain
                    and displayed in your wallet dashboard
                    after they are earned.
                  </p>
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
                      ⚠️ Unable to connect to the smart
                      contract. Please check your wallet
                      network and try again.
                    </p>
                  </div>
                )}

                {/* TODAY'S TICKETS */}
                <div className="wallet-info">
                  <span>
                    Today&apos;s Tickets
                  </span>

                  {todayTickets.length === 0 ? (
                    <p>
                      No tickets purchased today.
                    </p>
                  ) : (
                    <div className="ticket-history">
                      {todayTickets.map(
                        (ticket, index) =>
                          renderTicket(
                            ticket,
                            index,
                            true
                          )
                      )}
                    </div>
                  )}
                </div>

                {/* PREVIOUS WEEK - TODAY EXCLUDED */}
                <div className="wallet-info">
                  <span>
                    Previous Week History
                  </span>

                  {previousWeekTickets.length === 0 ? (
                    <p>
                      No ticket history from the
                      previous 7 days.
                    </p>
                  ) : (
                    <div className="ticket-history">
                      {previousWeekTickets.map(
                        (ticket, index) =>
                          renderTicket(
                            ticket,
                            index
                          )
                      )}
                    </div>
                  )}
                </div>

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