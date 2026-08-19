import { useEffect, useRef, useState } from "react";
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
  });

  const winnerSelectionStarted = useRef(false);

  useEffect(() => {
    let interval;
    let resultTimeout;

    const loadStats = async () => {
      try {
        if (!contractReady) return;

        const contract = await contractService.getContract();

        if (!contract) return;

        const details = await contract.getLotteryDetails();

        const players = Number(details.playersCount);
        const lotteryOpen = details.isOpen;
        const endTime = Number(details.endTime);

        const prizePoolRaw =
          await contract.getContractEthBalance();

        const prizePool = Number(
          ethers.formatEther(prizePoolRaw)
        ).toFixed(3);

        const updateCountdown = async () => {
          try {
            const now = Math.floor(Date.now() / 1000);
            const remaining = endTime - now;

            if (remaining <= 0) {
              if (!winnerSelectionStarted.current) {
                winnerSelectionStarted.current = true;

                setStats((prev) => ({
                  ...prev,
                  countdown: "Result Pending",
                  lotteryStatus: "Result Pending",
                }));

                resultTimeout = setTimeout(async () => {
                  try {
                    const currentContract =
                      await contractService.getContract();

                    if (!currentContract) return;

                    const currentDetails =
                      await currentContract.getLotteryDetails();

                    const currentPlayers =
                      Number(currentDetails.playersCount);

                    if (currentPlayers === 0) {
                      winnerSelectionStarted.current = false;
                      return;
                    }

                    await currentContract.selectWinner();

                    await loadStatsAfterWinner();
                  } catch (error) {
                    console.error(
                      "Automatic winner selection failed:",
                      error
                    );

                    winnerSelectionStarted.current = false;
                  }
                }, 5000);
              }

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
          } catch (error) {
            console.error(
              "Countdown update failed:",
              error
            );
          }
        };

        const loadStatsAfterWinner = async () => {
          try {
            const updatedContract =
              await contractService.getContract();

            if (!updatedContract) return;

            const updatedDetails =
              await updatedContract.getLotteryDetails();

            const updatedPrizePoolRaw =
              await updatedContract.getContractEthBalance();

            const updatedPrizePool = Number(
              ethers.formatEther(
                updatedPrizePoolRaw
              )
            ).toFixed(3);

            winnerSelectionStarted.current = false;

            setStats((prev) => ({
              ...prev,
              players: Number(
                updatedDetails.playersCount
              ).toString(),
              prizePool: `${updatedPrizePool} ETH`,
              lotteryStatus: updatedDetails.isOpen
                ? "Open"
                : "Closed",
              countdown: "--:--:--",
            }));

            if (updatedDetails.isOpen) {
              const newEndTime =
                Number(updatedDetails.endTime);

              const now = Math.floor(
                Date.now() / 1000
              );

              const remaining =
                newEndTime - now;

              if (remaining > 0) {
                const h = String(
                  Math.floor(
                    remaining / 3600
                  )
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
              }
            }
          } catch (error) {
            console.error(
              "Failed to refresh lottery:",
              error
            );
          }
        };

        updateCountdown();

        interval = setInterval(
          updateCountdown,
          1000
        );

        setStats((prev) => ({
          ...prev,
          players: players.toString(),
          prizePool: `${prizePool} ETH`,
          lotteryStatus: lotteryOpen
            ? "Open"
            : "Closed",
          referralStatus: "Live",
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

      if (resultTimeout) {
        clearTimeout(resultTimeout);
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