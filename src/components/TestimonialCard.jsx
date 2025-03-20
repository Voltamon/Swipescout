import React from "react";

const TestimonialCard = ({ image, name, role, testimonial }) => {
  return (
    <div className="testimonial-card">
      <img src={image} alt={name} />
      <h3>
        {name}
      </h3>
      <p>
        {role}
      </p>
      <p>
        {testimonial}
      </p>
    </div>
  );
};

export default TestimonialCard;
