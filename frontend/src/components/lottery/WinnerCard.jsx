import { useEffect, useState } from "react";
import { Crown } from "lucide-react";

import { useWalletContext } from "../../context/WalletContext";
import contractService from "../../services/contractService";

function WinnerCard() {
  const { contractReady } =
    useWalletContext();

  const [winner, setWinner] =
    useState("No Winner Yet");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!contractReady) {
      setWinner("No Winner Yet");
      setLoading(false);
      return;
    }

    let interval;

    const loadWinner =
      async () => {
        setLoading(true);

        try {
          const contract =
            await contractService.getContract();

          if (!contract) {
            setWinner(
              "No Winner Yet"
            );
            return;
          }

          const result =
            await contract.getLatestLotteryResult();

          const address =
            result.winner;

          const zeroAddress =
            "0x0000000000000000000000000000000000000000";

          if (
            !address ||
            address.toLowerCase() ===
              zeroAddress
          ) {
            setWinner(
              "No Winner Yet"
            );
            return;
          }

          setWinner(
            `${address.slice(
              0,
              6
            )}...${address.slice(-4)}`
          );
        } catch (error) {
          console.error(
            "WinnerCard:",
            error
          );

          setWinner(
            "No Winner Yet"
          );
        } finally {
          setLoading(false);
        }
      };

    loadWinner();

    interval = setInterval(
      loadWinner,
      5000
    );

    return () => {
      clearInterval(interval);
    };
  }, [contractReady]);

  return (
    <div className="lottery-card">
      <div className="card-icon">
        <Crown size={34} />
      </div>

      <h2>Last Winner</h2>

      <h3>
        {loading
          ? "Loading..."
          : winner}
      </h3>

      <p>
        Winner of the previous SCAI
        Lucky Loop lottery round
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