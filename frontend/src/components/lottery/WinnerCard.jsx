import { useEffect, useState } from "react";
import { Crown } from "lucide-react";

import { useWalletContext } from "../../context/WalletContext";
import contractService from "../../services/contractService";

function WinnerCard() {
  const { contractReady } = useWalletContext();

  const [winner, setWinner] = useState("No Winner Yet");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWinner = async () => {
      setLoading(true);

      try {
        if (!contractReady) {
          setWinner("No Winner Yet");
          return;
        }

        const contract = await contractService.getContract();

        if (!contract) {
          setWinner("No Winner Yet");
          return;
        }

        const currentLotteryId = Number(
          await contract.getCurrentLotteryId()
        );

        if (currentLotteryId <= 1) {
          setWinner("No Winner Yet");
          return;
        }

        const previousRound = await contract.getLotteryRound(
          currentLotteryId - 1
        );

        const address = previousRound.winner;

        if (
          !address ||
          address ===
            "0x0000000000000000000000000000000000000000"
        ) {
          setWinner("No Winner Yet");
          return;
        }

        setWinner(
          `${address.slice(0, 6)}...${address.slice(-4)}`
        );
      } catch (error) {
        console.error("WinnerCard:", error);
        setWinner("No Winner Yet");
      } finally {
        setLoading(false);
      }
    };

    loadWinner();
  }, [contractReady]);

  return (
    <div className="lottery-card">
      <div className="card-icon">
        <Crown size={34} />
      </div>

      <h2>Last Winner</h2>

      <h3>{loading ? "Loading..." : winner}</h3>

      <p>
        Winner of the previous SCAI Lucky Loop lottery round
        recorded on the blockchain.
      </p>

      <div className="lottery-info">
        <span>Verification</span>

        <strong
          className={
            contractReady
              ? "status-live"
              : "status-pending"
          }
        >
          {contractReady
            ? "On-Chain Verified"
            : "Wallet Not Connected"}
        </strong>
      </div>
    </div>
  );
}

export default WinnerCard;