import {
  FaWallet,
  FaTicketAlt,
  FaDice,
  FaGift,
  FaTelegramPlane,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaWallet />,
    title: "Connect Wallet",
    description:
      "Securely connect your wallet to join the current SCAI Lucky Loop lottery round.",
  },
  {
    icon: <FaTicketAlt />,
    title: "Buy Ticket",
    description:
      "Purchase your lottery ticket on-chain and participate before the ticket closing time.",
  },
  {
    icon: <FaDice />,
    title: "Winner Selection",
    description:
      "After ticket sales close, the smart contract selects the winner transparently and records the result on-chain.",
  },
  {
    icon: <FaTelegramPlane />,
    title: "Telegram Updates",
    description:
      "Users can receive lottery announcements, winner updates and important notifications through the Telegram community and bot.",
  },
  {
    icon: <FaGift />,
    title: "Claim Rewards",
    description:
      "The winning reward is credited securely after the lottery result is finalized.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how-section">
      <div className="container">
        <div className="section-heading">
          <span>How It Works</span>

          <h2>SCAI Lucky Loop Workflow</h2>

          <p>
            Participate in a transparent blockchain lottery with secure wallet
            connectivity, automated winner selection and Telegram updates.
          </p>
        </div>

        <div className="features-grid">
          {steps.map((step, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{step.icon}</div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;