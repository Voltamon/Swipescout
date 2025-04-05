import React from "react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div
        className="icon"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(52.09deg, #5D9BCF 18%, #A9C4F3 98.44%)"
               }}
      >
        {icon}
      </div>
      <h3>{title}</h3>
      <p style={{ color: "black" }}>{description}</p>
    </div>
  );
};

export default FeatureCard;
