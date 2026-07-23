import { NavLink } from "react-router-dom";
import { useWalletContext } from "../../context/WalletContext";
import "../../styles/navbar.css";

const ADMIN_WALLET = "0x4aBb2b8724E3677Bd685e0036aDe9F2bD7d5A860";

function Navbar() {
  const {
    walletAddress,
    isConnected,
    loading,
    connectWallet,
    disconnectWallet,
  } = useWalletContext();

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  const isAdmin =
    isConnected &&
    walletAddress &&
    walletAddress.toLowerCase() ===
      ADMIN_WALLET.toLowerCase();

  const handleConnect = async () => {
    if (loading || isConnected) return;

    try {
      await connectWallet();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="logo">
          <h2>SCAI Lucky Loop</h2>
          <span>Powered by EtherAuthority</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/lottery">Lottery</NavLink>
          <NavLink to="/wallet">Wallet</NavLink>
          <NavLink to="/referral">Referral</NavLink>
          <NavLink to="/profile">Profile</NavLink>

          {isAdmin && (
            <NavLink to="/admin">
              Admin
            </NavLink>
          )}
        </nav>

        {!isConnected ? (
          <button
            className="wallet-btn"
            onClick={handleConnect}
            disabled={loading}
          >
            {loading
              ? "Connecting..."
              : "Connect Wallet"}
          </button>
        ) : (
          <div className="wallet-actions">
            <button
              className="wallet-btn connected-btn"
              title={walletAddress}
            >
              {shortAddress}
            </button>

            <button
              className="disconnect-btn"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;