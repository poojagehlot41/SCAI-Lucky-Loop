import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { useWalletContext } from "../../context/WalletContext";
import contractService from "../../services/contractService";

function PlayersCard() {
  const { contractReady } = useWalletContext();

  const [players, setPlayers] = useState(0);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const contract = await contractService.getContract();

        if (!contract) {
          setPlayers(0);
          return;
        }

        const totalPlayers = await contract.getPlayersCount();

        setPlayers(Number(totalPlayers));
      } catch (error) {
        console.error(error);
        setPlayers(0);
      }
    };

    loadPlayers();
  }, []);

  return (
    <div className="lottery-card">
      <div className="card-icon">
        <Users size={34} />
      </div>

      <h2>Total Players</h2>

      <h1>{players}</h1>

      <p>
        Number of participants currently registered in this
        lottery round.
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
          {contractReady
            ? "Active"
            : "Connection Failed"}
        </strong>
      </div>
    </div>
  );
}

export default PlayersCard;