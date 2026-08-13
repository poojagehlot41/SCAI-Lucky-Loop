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
    rewardBalance,
    totalWins,
    userTickets,
    connectWallet,
    disconnectWallet,
    loading,
    contractReady,
  } = useWalletContext();

  const [copied, setCopied] = useState(false);

  const now = new Date();

  // Today's tickets only
  const todayTickets = userTickets.filter((ticket) => {
    const ticketDate = new Date(Number(ticket.timestamp) * 1000);

    return (
      ticketDate.getFullYear() === now.getFullYear() &&
      ticketDate.getMonth() === now.getMonth() &&
      ticketDate.getDate() === now.getDate()
    );
  });

  // Previous tickets = older than today, within last 7 days
  const previousWeekTickets = userTickets.filter((ticket) => {
    const ticketDate = new Date(Number(ticket.timestamp) * 1000);

    const difference =
      now.getTime() - ticketDate.getTime();

    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    const isOlderThanToday =
      ticketDate.getFullYear() !== now.getFullYear() ||
      ticketDate.getMonth() !== now.getMonth() ||
      ticketDate.getDate() !== now.getDate();

    return (
      isOlderThanToday &&
      difference >= 0 &&
      difference <= sevenDays
    );
  });

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

  const renderTicket = (ticket, index) => (
    <div
      key={`${ticket.ticketNumber?.toString()}-${ticket.timestamp?.toString()}-${index}`}
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
              Connect your wallet to access SCAI Lucky Loop and interact with
              the lottery smart contract.
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
                  <strong>{network || "--"}</strong>
                </div>

                <div className="wallet-info">
                  <span>Balance</span>
                  <strong>{balance} ETH</strong>
                </div>

                <div className="wallet-info">
                  <span>Reward Balance</span>
                  <strong>{rewardBalance} SCAI</strong>
                </div>

                <div className="wallet-info">
                  <span>Total Wins</span>
                  <strong>{totalWins}</strong>
                </div>

                <div className="wallet-info">
                  <span>Reward Status</span>

                  <strong
                    className={
                      Number(rewardBalance) > 0
                        ? "status-live"
                        : "status-pending"
                    }
                  >
                    {Number(rewardBalance) > 0
                      ? "Reward Credited"
                      : "No Reward Yet"}
                  </strong>
                </div>

                <div className="wallet-info">
                  <span>How Rewards Work</span>

                  <p>
                    Winners automatically receive SCAI reward credits after the
                    lottery winner is selected. These rewards can be used to
                    purchase future lottery tickets, if reward-based ticket
                    purchases are enabled.
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
                      ⚠️ Unable to connect to the smart contract. Please check
                      your wallet network and try again.
                    </p>
                  </div>
                )}

                {/* TODAY'S TICKETS */}
                <div className="wallet-info">
                  <span>My Tickets</span>

                  {todayTickets.length === 0 ? (
                    <p>No tickets purchased today.</p>
                  ) : (
                    <div className="ticket-history">
                      {todayTickets.map(renderTicket)}
                    </div>
                  )}
                </div>

                {/* PREVIOUS 7 DAYS */}
                <div className="wallet-info">
                  <span>Previous Week History</span>

                  {previousWeekTickets.length === 0 ? (
                    <p>
                      No previous ticket history from the last 7 days.
                    </p>
                  ) : (
                    <div className="ticket-history">
                      {previousWeekTickets.map(renderTicket)}
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