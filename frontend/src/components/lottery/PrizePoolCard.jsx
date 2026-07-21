import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { ethers } from "ethers";

import { useWalletContext } from "../../context/WalletContext";
import contractService from "../../services/contractService";

function PrizePoolCard() {
  const { contractReady } = useWalletContext();

  const [prizePool, setPrizePool] = useState("0.0000");

  useEffect(() => {
    const loadPrizePool = async () => {
      try {
        const contract = await contractService.getContract();

        if (!contract) {
          setPrizePool("0.0000");
          return;
        }

        const pool = await contract.getPrizePool();

        setPrizePool(
          Number(ethers.formatEther(pool)).toFixed(4)
        );
      } catch (error) {
        console.error(error);
        setPrizePool("0.0000");
      }
    };

    loadPrizePool();
  }, []);

  return (
    <div className="lottery-card">
      <div className="card-icon">
        <Trophy size={34} />
      </div>

      <h2>Prize Pool</h2>

      <h1>{prizePool} SCAI</h1>

      <p>
        Live reward amount currently locked in the smart
        contract for this lottery round.
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