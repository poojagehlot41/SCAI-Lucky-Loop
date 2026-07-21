import { useNavigate } from "react-router-dom";
import { useWalletContext } from "../../context/WalletContext";
import Button from "../ui/Button";

const CTASection = () => {
  const navigate = useNavigate();

  const {
    isConnected,
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

  return (
    <section className="cta-section">
      <div className="container">
        <h2>Ready To Join SCAI Lucky Loop?</h2>

        <p>
          Connect your wallet, purchase your first lottery ticket,
          and experience transparent blockchain gaming.
        </p>

        <div className="hero-buttons">
          <Button onClick={handleConnect}>
            {loading
              ? "Connecting..."
              : isConnected
              ? "Wallet Connected"
              : "Connect Wallet"}
          </Button>

          <Button
            type="secondary"
            onClick={handleBuyTicket}
          >
            Buy Ticket
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;