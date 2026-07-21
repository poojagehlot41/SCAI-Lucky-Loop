import { heroStats } from "../../constants/homeData";

const StatsSection = () => {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {heroStats.map((item) => (
            <div key={item.id} className="stat-card">
              <h2>{item.value}</h2>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;