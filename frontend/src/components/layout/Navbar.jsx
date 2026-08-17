import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useWalletContext } from "../../context/WalletContext";
import "../../styles/navbar.css";

const ADMIN_WALLET =
  "0x4aBb2b8724E3677Bd685e0036aDe9F2bD7d5A860";

function Navbar() {
  const {
    walletAddress,
    isConnected,
    loading,
    connectWallet,
    disconnectWallet,
  } = useWalletContext();

  const [menuOpen, setMenuOpen] = useState(false);

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
      setMenuOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <NavLink
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <h2>SCAI Lucky Loop</h2>
          <span>Powered by EtherAuthority</span>
        </NavLink>

        {/* DESKTOP / MOBILE NAV */}
        <nav
          className={`nav-links ${
            menuOpen ? "active" : ""
          }`}
        >
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink
            to="/lottery"
            onClick={closeMenu}
          >
            Lottery
          </NavLink>

          <NavLink
            to="/wallet"
            onClick={closeMenu}
          >
            Wallet
          </NavLink>

          <NavLink
            to="/referral"
            onClick={closeMenu}
          >
            Referral
          </NavLink>

          <NavLink
            to="/profile"
            onClick={closeMenu}
          >
            Profile
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={closeMenu}
            >
              Admin
            </NavLink>
          )}
        </nav>

        {/* DESKTOP WALLET ACTIONS */}
        <div className="desktop-wallet-actions">
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

        {/* MOBILE MENU BUTTON */}
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </header>
  );
}

export default Navbar;