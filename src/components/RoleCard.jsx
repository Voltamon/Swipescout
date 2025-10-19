import React, { useContext } from "react";

const RoleCard = ({ icon, title, description }) => {
  return (
    <div className="role-card">
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

export default RoleCard;
