import Card from "../ui/Card";
import "../../styles/features.css";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card className="feature-card">
      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </Card>
  );
};

export default FeatureCard;