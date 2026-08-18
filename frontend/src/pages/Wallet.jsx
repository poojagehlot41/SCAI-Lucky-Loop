import {
  Wallet as WalletIcon,
  Copy,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

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

  // --------------------------------------------------
  // DATE RANGES
  // --------------------------------------------------

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // --------------------------------------------------
  // REMOVE DUPLICATE TICKETS
  // --------------------------------------------------

  const uniqueTickets = Array.from(
    new Map(
      (userTickets || []).map((ticket) => [
        `${ticket.ticketNumber}-${ticket.lotteryId}`,
        ticket,
      ])
    ).values()
  );

  // --------------------------------------------------
  // TODAY'S TICKETS
  // --------------------------------------------------

  const todayTickets = uniqueTickets.filter((ticket) => {
    const ticketDate = new Date(
      Number(ticket.timestamp) * 1000
    );

    return (
      ticketDate >= todayStart &&
      ticketDate < tomorrowStart
    );
  });

  // --------------------------------------------------
  // PREVIOUS 7 DAYS
  // TODAY EXCLUDED
  // --------------------------------------------------

  const previousWeekTickets = uniqueTickets.filter(
    (ticket) => {
      const ticketDate = new Date(
        Number(ticket.timestamp) * 1000
      );

      return (
        ticketDate >= sevenDaysAgo &&
        ticketDate < todayStart
      );
    }
  );

  // --------------------------------------------------
  // EXPECTED RESULT TIME
  // --------------------------------------------------

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

  // --------------------------------------------------
  // COPY WALLET ADDRESS
  // --------------------------------------------------

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

  // --------------------------------------------------
  // RENDER TICKET
  // --------------------------------------------------

  const renderTicket = (
    ticket,
    index,
    showTodayPurchase = false
  ) => {
    const ticketNumber =
      ticket.ticketNumber?.toString() || "--";

    const lotteryId =
      ticket.lotteryId?.toString() || "--";

    const purchasedDate = new Date(
      Number(ticket.timestamp) * 1000
    );

    return (
      <div
        key={`${ticketNumber}-${lotteryId}-${index}`}
        className="ticket-card"
      >
        <p>
          <strong>Ticket #</strong>{" "}
          {ticketNumber}
        </p>

        <p>
          <strong>Lottery ID</strong>{" "}
          {lotteryId}
        </p>

        <p>
          <strong>Purchased</strong>{" "}
          {purchasedDate.toLocaleString()}
        </p>

        {showTodayPurchase && (
          <p>
            <strong>Today Purchase</strong>{" "}
            Yes
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
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

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
              Connect your wallet to access SCAI
              Lucky Loop and interact with the
              lottery smart contract.
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
                {/* WALLET ADDRESS */}

                <div className="wallet-info">
                  <span>Wallet Address</span>

                  <div className="wallet-address">
                    <strong>
                      {walletAddress.slice(0, 8)}
                      ...
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

                {/* NETWORK */}

                <div className="wallet-info">
                  <span>Network</span>

                  <strong>
                    {network || "--"}
                  </strong>
                </div>

                {/* BALANCE */}

                <div className="wallet-info">
                  <span>Balance</span>

                  <strong>
                    {balance} ETH
                  </strong>
                </div>

                {/* REWARD BALANCE */}

                <div className="wallet-info">
                  <span>Reward Balance</span>

                  <strong>
                    {rewardBalance} SCAI
                  </strong>
                </div>

                {/* TOTAL WINS */}

                <div className="wallet-info">
                  <span>Total Wins</span>

                  <strong>
                    {totalWins}
                  </strong>
                </div>

                {/* REWARD STATUS */}

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

                {/* RESULT TIME */}

                <div className="wallet-info">
                  <span>
                    Expected Result Time
                  </span>

                  <strong>
                    {resultTime}
                  </strong>
                </div>

                {/* HOW REWARDS WORK */}

                <div className="wallet-info">
                  <span>
                    How Rewards Work
                  </span>

                  <p>
                    Winners automatically receive
                    SCAI reward credits after the
                    lottery winner is selected.
                    These rewards can be used to
                    purchase future lottery tickets,
                    if reward-based ticket purchases
                    are enabled.
                  </p>
                </div>

                {/* WALLET STATUS */}

                <div className="wallet-info">
                  <span>Wallet Status</span>

                  <strong className="status-live">
                    Connected
                  </strong>
                </div>

                {/* CONTRACT STATUS */}

                <div className="wallet-info">
                  <span>
                    Smart Contract
                  </span>

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
                      ⚠️ Unable to connect to the
                      smart contract. Please check
                      your wallet network and try
                      again.
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

                {/* PREVIOUS WEEK */}

                <div className="wallet-info">
                  <span>
                    Previous Week History
                  </span>

                  {previousWeekTickets.length ===
                  0 ? (
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

                {/* DISCONNECT */}

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