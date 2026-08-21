import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useWalletContext } from "../../context/WalletContext";

const StatsSection = () => {
  const { contract, contractReady } = useWalletContext();

  const [stats, setStats] = useState({
    players: "--",
    prizePool: "--",
    referrals: "Live",
    status: "--",
    winner: "No Winner Yet",
  });

  useEffect(() => {
    if (!contractReady || !contract) {
      return;
    }

    let active = true;

    const loadStats = async () => {
      try {
        // Current lottery details
        const details =
          await contract.getLotteryDetails();

        // Current contract holds ETH, not SCAI
        const prizePoolRaw =
          await contract.getContractEthBalance();

        const prizePool =
          Number(
            ethers.formatEther(prizePoolRaw)
          ).toFixed(4);

        // Get latest completed lottery result
        let winner = "No Winner Yet";

        try {
          const latestResult =
            await contract.getLatestLotteryResult();

          const winnerAddress =
            latestResult.winner;

          if (
            winnerAddress &&
            winnerAddress !==
              "0x0000000000000000000000000000000000000000"
          ) {
            winner =
              `${winnerAddress.slice(
                0,
                6
              )}...${winnerAddress.slice(-4)}`;
          }
        } catch (winnerError) {
          console.warn(
            "Latest winner not available yet:",
            winnerError
          );
        }

        if (!active) return;

        setStats({
          players:
            details.playersCount.toString(),

          prizePool:
            `${prizePool} ETH`,

          referrals: "Live",

          status:
            details.isOpen
              ? "Open"
              : "Closed",

          winner,
        });
      } catch (error) {
        console.error(
          "Failed to load live lottery stats:",
          error
        );
      }
    };

    // Initial load
    loadStats();

    // Refresh every 5 seconds
    const interval = setInterval(
      loadStats,
      5000
    );

    return () => {
      active = false;
      clearInterval(interval);
    };
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