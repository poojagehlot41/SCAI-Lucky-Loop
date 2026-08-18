import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useWalletContext } from "../../context/WalletContext";
import contractService from "../../services/contractService";

const HeroStats = () => {
  const { contractReady, walletAddress } = useWalletContext();

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

        const contract = await contractService.getContract();

        if (!contract) return;

        // Current lottery details
        const details = await contract.getLotteryDetails();

        const players = details.playersCount;
        const lotteryOpen = details.isOpen;
        const endTime = details.endTime;

        // Current SCAI balance held by lottery contract
        const prizePoolRaw =
          await contract.getContractScaiBalance();

        const prizePool = Number(
          ethers.formatEther(prizePoolRaw)
        ).toFixed(4);

        const updateCountdown = () => {
          const now = Math.floor(Date.now() / 1000);
          const remaining = Number(endTime) - now;

          if (remaining <= 0) {
            setStats((prev) => ({
              ...prev,
              countdown: "Result Pending",
            }));
            return;
          }

          const h = String(
            Math.floor(remaining / 3600)
          ).padStart(2, "0");

          const m = String(
            Math.floor((remaining % 3600) / 60)
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

        if (interval) {
          clearInterval(interval);
        }

        interval = setInterval(
          updateCountdown,
          1000
        );

        setStats((prev) => ({
          ...prev,
          players: players.toString(),
          prizePool: `${prizePool} SCAI`,
          lotteryStatus: lotteryOpen
            ? "Open"
            : "Closed",
          referralStatus: "Live",

          // Current ABI does not expose previous-round
          // winner getter, so don't make a broken call.
          winner: "",
          winnerPrize: "",
          resultReady: false,
          isWinner: false,
        }));
      } catch (error) {
        console.error(
          "Failed to load lottery stats:",
          error
        );
      }
    };

    loadStats();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
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
    </div>
  );
};

export default HeroStats;