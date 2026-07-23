import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useWalletContext } from "../../context/WalletContext";

const StatsSection = () => {
  const { contract, contractReady } = useWalletContext();

  const [stats, setStats] = useState({
    players: "--",
    prizePool: "--",
    status: "--",
    referrals: "Live",
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!contractReady || !contract) return;

      try {
        const players = await contract.getPlayersCount();
        const prizePool = await contract.getPrizePool();
        const lotteryOpen = await contract.lotteryOpen();

        setStats({
          players: players.toString(),
          prizePool: `${Number(
            ethers.formatEther(prizePool)
          ).toFixed(4)} ETH`,
          status: lotteryOpen ? "Open" : "Closed",
          referrals: "Live",
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };

    loadStats();
  }, [contract, contractReady]);

  const heroStats = [
    {
      id: 1,
      value: stats.players,
      title: "Active Players",
    },
    {
      id: 2,
      value: stats.prizePool,
      title: "Prize Pool",
    },
    {
      id: 3,
      value: stats.referrals,
      title: "Referral Rewards",
    },
    {
      id: 4,
      value: stats.status,
      title: "Lottery Status",
    },
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {heroStats.map((item) => (
            <div key={item.id} className="stat-card">
              <h2>{item.value}</h2>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;