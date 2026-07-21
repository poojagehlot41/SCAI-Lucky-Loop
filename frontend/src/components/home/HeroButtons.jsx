import { FaWallet, FaTicketAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useWalletContext } from "../../context/WalletContext";

const HeroButtons = () => {
  const navigate = useNavigate();

  const {
    isConnected,
    walletAddress,
    loading,
    connectWallet,
  } = useWalletContext();

  const handleConnect = async () => {
    if (loading || isConnected) return;

    try {
      await connectWallet();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuyTicket = () => {
    navigate("/lottery");
  };

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  return (
    <div className="hero-buttons">
      {!isConnected ? (
        <button
          className="primary-btn"
          onClick={handleConnect}
          disabled={loading}
        >
          <FaWallet />
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <button
          className="primary-btn"
          disabled
        >
          <FaWallet />
          {shortAddress}
        </button>
      )}

      <button
        className="secondary-btn"
        onClick={handleBuyTicket}
      >
        <FaTicketAlt />
        Buy Ticket
      </button>
    </div>
  );
};

export default HeroButtons;