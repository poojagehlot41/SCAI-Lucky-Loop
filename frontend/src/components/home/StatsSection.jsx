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
    winner: "No Winner Yet",
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!contractReady || !contract) return;

      try {
        const players = await contract.getPlayersCount();
        const prizePool = await contract.getPrizePool();
        const lotteryOpen = await contract.lotteryOpen();

        let winnerAddress = "No Winner Yet";

        try {
          const currentLotteryId =
            await contract.getCurrentLotteryId();

          if (Number(currentLotteryId) > 1) {
            const round =
              await contract.getLotteryRound(
                Number(currentLotteryId) - 1
              );

            if (
              round.completed &&
              round.winner !==
                "0x0000000000000000000000000000000000000000"
            ) {
              winnerAddress = `${round.winner.slice(
                0,
                6
              )}...${round.winner.slice(-4)}`;
            }
          }
        } catch (err) {
          console.log(
            "Winner data unavailable",
            err
          );
        }

        setStats({
          players: players.toString(),
          prizePool: `${Number(
            ethers.formatEther(prizePool)
          ).toFixed(4)} ETH`,
          status: lotteryOpen ? "Open" : "Closed",
          referrals: "Live",
          winner: winnerAddress,
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

    return () => clearInterval(interval);
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