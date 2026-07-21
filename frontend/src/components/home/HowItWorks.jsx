import {
  FaWallet,
  FaTicketAlt,
  FaDice,
  FaGift,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaWallet />,
    title: "Connect Wallet",
    description:
      "Securely connect your wallet on the SCAI Mainnet to access all lottery features.",
  },
  {
    icon: <FaTicketAlt />,
    title: "Buy Ticket",
    description:
      "Purchase lottery tickets using SCAI tokens and join the current lottery round.",
  },
  {
    icon: <FaDice />,
    title: "Live Draw",
    description:
      "The winner is selected transparently using the deployed smart contract.",
  },
  {
    icon: <FaGift />,
    title: "Claim Rewards",
    description:
      "Winning rewards are transferred directly to your connected wallet.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how-section">
      <div className="container">

        <div className="section-heading">
          <span>How It Works</span>

          <h2>Play Lottery In Four Easy Steps</h2>

          <p>
            Join the SecureChain AI lottery ecosystem in just a few clicks.
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