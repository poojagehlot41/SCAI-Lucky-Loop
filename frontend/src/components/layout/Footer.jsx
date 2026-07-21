import {
  FaGithub,
  FaLinkedin,
  FaTelegramPlane,
  FaShieldAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h2>SCAI Lucky Loop</h2>

          <p className="footer-description">
            A transparent and decentralized Telegram Web3 Lottery Platform
            powered by SecureChain AI Mainnet, delivering secure, fair,
            and blockchain-powered gaming experiences.
          </p>

          <div className="footer-meta">
            <p>
              <strong>Built by:</strong> Pooja Gehlot
            </p>

            <p>
              <strong>Organization:</strong> EtherAuthority
            </p>

            <p>
              <strong>Network:</strong> SecureChain AI Mainnet
            </p>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/lottery">Lottery</Link>
          <Link to="/wallet">Wallet</Link>
          <Link to="/referral">Referral</Link>
          <Link to="/profile">Profile</Link>
        </div>

        <div className="footer-social">
          <h3>Community</h3>

          <div className="social-icons">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://t.me/"
              target="_blank"
              rel="noreferrer"
            >
              <FaTelegramPlane />
            </a>
          </div>

          <div className="footer-security">
            <FaShieldAlt />
            <span>Blockchain Secured</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 SCAI Lucky Loop. All Rights Reserved.</p>

        <p>
          Powered by <strong>EtherAuthority</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;