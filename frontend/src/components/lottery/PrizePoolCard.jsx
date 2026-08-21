import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { ethers } from "ethers";

import { useWalletContext } from "../../context/WalletContext";
import contractService from "../../services/contractService";

function PrizePoolCard() {
  const { contractReady } =
    useWalletContext();

  const [prizePool, setPrizePool] =
    useState("0.0000");

  useEffect(() => {
    if (!contractReady) {
      setPrizePool("0.0000");
      return;
    }

    let interval;

    const loadPrizePool = async () => {
      try {
        const contract =
          await contractService.getContract();

        if (!contract) {
          setPrizePool("0.0000");
          return;
        }

        const pool =
          await contract.getPrizePool();

        const formatted =
          Number(
            ethers.formatEther(pool)
          ).toFixed(4);

        setPrizePool(formatted);
      } catch (error) {
        console.error(
          "Prize pool loading failed:",
          error
        );

        setPrizePool("0.0000");
      }
    };

    loadPrizePool();

    interval = setInterval(
      loadPrizePool,
      5000
    );

    return () => {
      clearInterval(interval);
    };
  }, [contractReady]);

  return (
    <div className="lottery-card">
      <div className="card-icon">
        <Trophy size={34} />
      </div>

      <h2>Prize Pool</h2>

      <h1>
        {prizePool} ETH
      </h1>

      <p>
        Live ETH prize pool currently
        held by the lottery smart contract
        for the active lottery round.
      </p>

      <div className="lottery-info">
        <span>Status</span>

        <strong
          className={
            contractReady
              ? "status-live"
              : "status-pending"
          }
        >
          {contractReady
            ? "Live"
            : "Connection Failed"}
        </strong>
      </div>
    </div>
  );
}

export default PrizePoolCard;