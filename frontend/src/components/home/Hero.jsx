import HeroContent from "./HeroContent";
import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">

        <div className="hero-left">
          <HeroContent />

          <HeroButtons />
        </div>

        <div className="hero-right">
          <HeroStats />
        </div>

      </div>
    </section>
  );
};

export default Hero;