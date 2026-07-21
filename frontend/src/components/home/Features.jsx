import {
  FaWallet,
  FaTelegramPlane,
  FaTicketAlt,
  FaUsers,
  FaGift,
  FaShieldAlt,
} from "react-icons/fa";

import FeatureCard from "./FeatureCard";
import "../../styles/features.css";

const Features = () => {
  const features = [
    {
      icon: <FaTelegramPlane />,
      title: "Telegram Mini App",
      description:
        "Play directly inside Telegram with a seamless Web3 gaming experience.",
    },
    {
      icon: <FaWallet />,
      title: "MetaMask Wallet",
      description:
        "Secure wallet authentication for transparent blockchain transactions.",
    },
    {
      icon: <FaTicketAlt />,
      title: "Lottery Tickets",
      description:
        "Purchase tickets using SCAI coins and participate in live lottery rounds.",
    },
    {
      icon: <FaUsers />,
      title: "Referral Rewards",
      description:
        "Invite friends and earn referral bonuses while growing the community.",
    },
    {
      icon: <FaGift />,
      title: "Blockchain Rewards",
      description:
        "Winners receive secure blockchain rewards directly to their wallet.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Smart Contract Security",
      description:
        "Lottery logic is powered by secure smart contracts for fairness and transparency.",
    },
  ];

  return (
    <section className="features-section">

      <div className="section-heading">
        <span>Platform Features</span>

        <h2>Everything You Need In One Web3 Lottery Platform</h2>

        <p>
          SCAI Lucky Loop combines Telegram, blockchain, MetaMask,
          smart contracts, referral rewards and decentralized lottery
          gameplay into one secure ecosystem.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

    </section>
  );
};

export default Features;