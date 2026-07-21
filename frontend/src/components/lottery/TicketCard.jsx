import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import { ethers } from "ethers";

import { useWalletContext } from "../../context/WalletContext";
import contractService from "../../services/contractService";

function TicketCard() {
  const {
    isConnected,
    contractReady,
  } = useWalletContext();

  const [loading, setLoading] = useState(false);
  const [ticketPrice, setTicketPrice] = useState("Unavailable");

  useEffect(() => {
    const loadTicketPrice = async () => {
      try {
        const contract = await contractService.getContract();

        if (!contract) {
          setTicketPrice("Unavailable");
          return;
        }

        const price = await contract.ticketPrice();

        setTicketPrice(
          `${Number(
            ethers.formatEther(price)
          ).toFixed(4)} SCAI`
        );
      } catch (error) {
        console.error(error);
        setTicketPrice("Unavailable");
      }
    };

    loadTicketPrice();
  }, []);

  const handleBuyTicket = async () => {
    try {
      if (!isConnected) {
        alert("Please connect your wallet first.");
        return;
      }

      if (!contractReady) {
        alert("Unable to connect to the smart contract.");
        return;
      }

      setLoading(true);

      const contract = await contractService.getContract();

      if (!contract) {
        throw new Error("Contract unavailable.");
      }

      const price = await contract.ticketPrice();

      const tx = await contract.buyTicket({
        value: price,
      });

      await tx.wait();

      alert("🎉 Ticket purchased successfully!");

      const latestPrice = await contract.ticketPrice();

      setTicketPrice(
        `${Number(
          ethers.formatEther(latestPrice)
        ).toFixed(4)} SCAI`
      );
    } catch (error) {
      console.error(error);

      alert(
        error.reason ||
          error.message ||
          "Transaction failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lottery-card">
      <div className="card-icon">
        <Ticket size={34} />
      </div>

      <h2>Buy Ticket</h2>

      <p>
        Purchase a ticket and participate in the
        current SCAI Lucky Loop lottery round.
      </p>

      <div className="lottery-info">
        <span>Ticket Price</span>

        <strong>{ticketPrice}</strong>
      </div>

      <div className="lottery-info">
        <span>Contract</span>

        <strong
          className={
            contractReady
              ? "status-live"
              : "status-pending"
          }
        >
          {contractReady
            ? "Ready"
            : "Connection Failed"}
        </strong>
      </div>

      <button
        className="primary-btn"
        onClick={handleBuyTicket}
        disabled={loading}
      >
        {loading
          ? "Processing..."
          : "Buy Ticket"}
      </button>
    </div>
  );
}

export default TicketCard;