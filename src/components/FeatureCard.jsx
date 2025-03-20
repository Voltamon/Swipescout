import React from "react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <i className={icon} />
      <h3>
        {title}
      </h3>
      <p>
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
