import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useWalletContext } from "../../context/WalletContext";
import contractService from "../../services/contractService";

const HeroStats = () => {
  const {
    contractReady,
    walletAddress,
  } = useWalletContext();

  const [stats, setStats] = useState({
    players: "--",
    prizePool: "--",
    lotteryStatus: "--",
    referralStatus: "Live",
    countdown: "--:--:--",

    winner: "",
    winnerPrize: "",
    isWinner: false,
    resultReady: false,
  });

  useEffect(() => {
    let interval;

    const loadStats = async () => {
      try {
        if (!contractReady) return;

        const contract =
          await contractService.getContract();

        if (!contract) return;

        const players =
          await contract.getPlayersCount();

        const prizePool =
          await contract.getPrizePool();

        const lotteryOpen =
          await contract.lotteryOpen();

        const endTime =
          await contract.lotteryEndTime();

        let winner = "";
        let winnerPrize = "";
        let resultReady = false;
        let isWinner = false;

        try {
          const currentId =
            await contract.getCurrentLotteryId();

          if (Number(currentId) > 1) {
            const round =
              await contract.getLotteryRound(
                Number(currentId) - 1
              );

            if (round.completed) {
              resultReady = true;

              winner = round.winner;

              winnerPrize = Number(
                ethers.formatEther(
                  round.prizePool
                )
              ).toFixed(4);

              if (
                walletAddress &&
                winner.toLowerCase() ===
                  walletAddress.toLowerCase()
              ) {
                isWinner = true;
              }
            }
          }
        } catch (err) {
          console.log(err);
        }

        const updateCountdown = () => {
          const now = Math.floor(
            Date.now() / 1000
          );

          const remaining =
            Number(endTime) - now;

          if (remaining <= 0) {
            setStats((prev) => ({
              ...prev,
              countdown:
                "Winner Selection Pending",
            }));

            return;
          }

          const h = String(
            Math.floor(remaining / 3600)
          ).padStart(2, "0");

          const m = String(
            Math.floor(
              (remaining % 3600) / 60
            )
          ).padStart(2, "0");

          const s = String(
            remaining % 60
          ).padStart(2, "0");

          setStats((prev) => ({
            ...prev,
            countdown: `${h}:${m}:${s}`,
          }));
        };

        updateCountdown();

        if (interval)
          clearInterval(interval);

        interval = setInterval(
          updateCountdown,
          1000
        );

        setStats((prev) => ({
          ...prev,
          players: players.toString(),

          prizePool: `${Number(
            ethers.formatEther(prizePool)
          ).toFixed(4)} SCAI`,

          lotteryStatus: lotteryOpen
            ? "Open"
            : "Closed",

          referralStatus: "Live",

          winner,

          winnerPrize,

          resultReady,

          isWinner,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    loadStats();

    return () => {
      if (interval)
        clearInterval(interval);
    };
  }, [contractReady, walletAddress]);

  return (
    <div className="hero-card">

      <h3>Live Lottery Overview</h3>

            <div className="stat-item">
        <span>Total Players</span>
        <strong>{stats.players}</strong>
      </div>

      <div className="stat-item">
        <span>Total Prize Pool</span>
        <strong>{stats.prizePool}</strong>
      </div>

      <div className="stat-item">
        <span>Today's Lottery</span>
        <strong>{stats.lotteryStatus}</strong>
      </div>

      <div className="stat-item">
        <span>Referral Rewards</span>
        <strong>{stats.referralStatus}</strong>
      </div>

      <div className="stat-item">
        <span>Next Draw In</span>
        <strong>{stats.countdown}</strong>
      </div>

      {stats.resultReady && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            textAlign: "center",
          }}
        >
          {stats.isWinner ? (
            <>
              <h3
                style={{
                  color: "#22c55e",
                  marginBottom: "10px",
                }}
              >
                🎉 Congratulations!
              </h3>

              <p>You won this lottery.</p>

              <p>
                Prize: <strong>{stats.winnerPrize} SCAI</strong>
              </p>

              <small>
                Reward has been credited to your wallet.
              </small>
            </>
          ) : (
            <>
              <h3
                style={{
                  color: "#facc15",
                  marginBottom: "10px",
                }}
              >
                🏆 Lottery Result
              </h3>

              <p>Winner</p>

              <strong>
                {stats.winner.slice(0, 6)}...
                {stats.winner.slice(-4)}
              </strong>

              <p
                style={{
                  marginTop: "10px",
                }}
              >
                Prize: {stats.winnerPrize} SCAI
              </p>

              <small>
                Better luck next time!
              </small>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HeroStats;