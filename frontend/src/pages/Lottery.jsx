import TicketCard from "../components/lottery/TicketCard";
import PrizePoolCard from "../components/lottery/PrizePoolCard";
import PlayersCard from "../components/lottery/PlayersCard";
import WinnerCard from "../components/lottery/WinnerCard";

import "../styles/lottery.css";

function Lottery() {
  return (
    <main className="lottery-page">
      <section className="lottery-hero">
        <div className="container">
          <span className="section-tag">
            🎟 SCAI Mainnet Lottery
          </span>

          <h1>Lottery Dashboard</h1>

          <p>
            Join the current lottery round, purchase tickets securely,
            monitor the prize pool in real time, and track winners
            through transparent blockchain technology.
          </p>
        </div>
      </section>

      <section className="lottery-content">
        <div className="container">
          <div className="lottery-grid">
            <TicketCard />
            <PrizePoolCard />
            <PlayersCard />
            <WinnerCard />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Lottery;