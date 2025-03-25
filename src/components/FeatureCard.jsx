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
          background: "linear-gradient(52.09deg, #982DEC -11.18%, #DC8DF8 58.92%, #A9C4F3 98.44%)"

        }}
      >
        {icon}
      </div>
      <h3>{title}</h3>
      <p style={{ color: "#898CA9" }}>{description}</p>
    </div>
  );
};

export default FeatureCard;
