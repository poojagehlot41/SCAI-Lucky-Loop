import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { useWalletContext } from "../../context/WalletContext";
import contractService from "../../services/contractService";

function PlayersCard() {
  const { contractReady } = useWalletContext();

  const [players, setPlayers] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!contractReady) {
      setPlayers(0);
      setIsOpen(false);
      return;
    }

    let interval;

    const loadPlayers = async () => {
      try {
        const contract =
          await contractService.getContract();

        if (!contract) {
          setPlayers(0);
          setIsOpen(false);
          return;
        }

        const details =
          await contract.getLotteryDetails();

        // getLotteryDetails()
        // returns:
        // [id, price, isOpen, endTime, playersCount]

        setPlayers(
          Number(details[4])
        );

        setIsOpen(
          Boolean(details[2])
        );
      } catch (error) {
        console.error(
          "Players loading failed:",
          error
        );

        setPlayers(0);
        setIsOpen(false);
      }
    };

    loadPlayers();

    interval = setInterval(
      loadPlayers,
      5000
    );

    return () => {
      clearInterval(interval);
    };
  }, [contractReady]);

  return (
    <div className="lottery-card">
      <div className="card-icon">
        <Users size={34} />
      </div>

      <h2>Total Players</h2>

      <h1>{players}</h1>

      <p>
        Number of participants currently
        registered in this lottery round.
      </p>

      <div className="lottery-info">
        <span>Round Status</span>

        <strong
          className={
            contractReady
              ? "status-live"
              : "status-pending"
          }
        >
          {!contractReady
            ? "Connection Failed"
            : isOpen
            ? "Active"
            : "Closed"}
        </strong>
      </div>
    </div>
  );
}

export default PlayersCard;