import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useWalletContext } from "../../context/WalletContext";

const StatsSection = () => {
  const { contract, contractReady } =
    useWalletContext();

  const [stats, setStats] = useState({
    players: "--",
    prizePool: "--",
    status: "--",
    referrals: "Live",
    winner: "No Winner Yet",
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!contractReady || !contract) return;

      try {
        const details =
          await contract.getLotteryDetails();

        const prizePoolRaw =
          await contract.getContractScaiBalance();

        const prizePool = Number(
          ethers.formatEther(prizePoolRaw)
        ).toFixed(4);

        setStats({
          players:
            details.playersCount.toString(),

          prizePool:
            `${prizePool} SCAI`,

          status:
            details.isOpen
              ? "Open"
              : "Closed",

          referrals: "Live",

          // Current contract ABI doesn't expose
          // previous winner getter.
          winner: "No Winner Yet",
        });
      } catch (error) {
        console.error(
          "Failed to load stats:",
          error
        );
      }
    };

    loadStats();

    const interval = setInterval(
      loadStats,
      10000
    );

    return () =>
      clearInterval(interval);
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
    {
      id: 5,
      value: stats.winner,
      title: "Previous Winner",
    },
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {heroStats.map((item) => (
            <div
              key={item.id}
              className="stat-card"
            >
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