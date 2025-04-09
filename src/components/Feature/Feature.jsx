import React from "react";

const Feature = ({ title, description, style }) => {
  return (
    <div className="feature" style={style}>
      <p className="advantage" style={{fontSize:'8px'}}>ADVANTAGES</p>
      <p className="title" style={{fontSize:'18px'}}>{title}</p>
      <p className="stuff">🔔 <strong>Some Stuff</strong></p>
      <p>{description}</p>
    </div>
  );
};

export default Feature;
