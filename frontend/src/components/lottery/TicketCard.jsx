import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import { ethers } from "ethers";

import { useWalletContext } from "../../context/WalletContext";
import contractService from "../../services/contractService";

function TicketCard() {
const {
  isConnected,
  contractReady,
  walletAddress,
  rewardBalance,
} = useWalletContext();

  const [loading, setLoading] = useState(false);
  const [ticketPrice, setTicketPrice] = useState("Unavailable");
  const [ticketNumber, setTicketNumber] = useState("--");

  const loadTicketDetails = async () => {
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
        ).toFixed(4)} ETH`
      );

      if (walletAddress) {
        const tickets = await contract.getUserTickets(
          walletAddress
        );

        if (tickets.length > 0) {
          const latestTicket =
            tickets[tickets.length - 1];

          setTicketNumber(
            latestTicket.ticketNumber.toString()
          );
        } else {
          setTicketNumber("--");
        }
      }
   } catch (error) {
  console.error(error);

  setTicketPrice("Unavailable");
  setTicketNumber("--");
}
  };

  useEffect(() => {
    loadTicketDetails();
  }, [walletAddress]);

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

      await loadTicketDetails();

const tickets = await contract.getUserTickets(
  walletAddress
);

const latestTicket =
  tickets[tickets.length - 1];

alert(
  `🎉 Ticket purchased successfully!\n\nYour Ticket Number: ${latestTicket.ticketNumber}`
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

   const handleRewardTicket = async () => {
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

    const contract =
      await contractService.getContract();

    const tx =
      await contract.buyTicketUsingReward();

    await tx.wait();

    await loadTicketDetails();

    alert(
      "🎉 Ticket purchased using Reward Balance!"
    );
  } catch (error) {
    console.error(error);

    alert(
      error.reason ||
      error.message ||
      "Reward purchase failed."
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
        <span>Your Ticket</span>
        <strong>{ticketNumber}</strong>
      </div>

      <div className="lottery-info">
        <span>Reward Balance</span>
        <strong>{rewardBalance} SCAI</strong>
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
      
      <button
  className="secondary-btn"
  onClick={handleRewardTicket}
  disabled={
    loading ||
    Number(rewardBalance) <= 0
  }
>
  {loading
    ? "Processing..."
    : "Buy Using Reward"}
</button>
      
    </div>
  );
}

export default TicketCard;