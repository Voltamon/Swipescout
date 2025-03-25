const TestimonialCard = ({ image, name, role, testimonial }) => {
  return (
    <div className="testimonial-card"
    style={{
      width: '300px',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      background:'#380F63',
      color:'#FFFFFF'
    }}
    >
      {image && <img src={image} alt={name} className="testimonial-image"
       style={{
        width: '100%', 
        height: 'auto', 
        maxHeight: '200px', 
        objectFit: 'cover', 
        borderRadius: '10px'
       }}
      />}
      <h3>{name}</h3>
      <p>{role}</p>
      <p>{testimonial}</p>
    </div>
  );
};
export default TestimonialCard