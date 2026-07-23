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
            🎟 SCAI Lucky Loop
          </span>

          <h1>Lottery Dashboard</h1>

          <p>
            Purchase lottery tickets securely, monitor the live prize pool,
            track active participants and verify winners through a transparent
            blockchain lottery system.
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

          <div className="lottery-note">
            <h3>Lottery Announcement</h3>

            <ul>
              <li>✅ Ticket sales remain open until the closing time.</li>
              <li>✅ The admin closes the lottery after ticket sales end.</li>
              <li>✅ A winner is selected transparently by the smart contract.</li>
              <li>✅ The result is permanently stored on-chain.</li>
              <li>✅ Users can verify the latest winner directly from the dashboard.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Lottery;