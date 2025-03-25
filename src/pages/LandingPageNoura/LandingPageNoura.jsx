import React from "react";
import Header3 from "../../components/Header3/Header3";
import HeroSection from "../../components/HeroSection/HeroSection";
import "./LandingPageNoura.css";
import Feature from "../../components/Feature/Feature";
import phoneImage from "../../assets/phone.png";
import FeatureCard from "../../components/FeatureCard";
import { LuArrowLeftRight } from "react-icons/lu";
import TestimonialCard from "../../components/TestimonialCard";
import news1 from "../../assets/news1.png";
import news2 from "../../assets/news2.png";
import news3 from "../../assets/news3.png";
const LandingPageNoura = () => {
  console.log("LandingPageNoura loaded");
  return (
    <div>
      <Header3 />
      <HeroSection />
      <h2>What Makes Swipe Scout Unique?</h2>
      <div className="features-container">
        <div className="phone-image">
          <img src={phoneImage} alt="App Preview" />
        </div>
        <div className="features-text">
          <Feature
            title="Video Resumes"
            description="Arcu At Dictum Sapien, Mollis. Volutpatte Sit Id Accumsan, Ultricies. In Ultricies Maecenas Etiam Mauris Etiam Odio. Duis Tristique Lacus."
          />

          <Feature
            style={{ marginLeft: 60 }}
            title="Swipe Feature"
            description="Arcu At Dictum Sapien, Mollis. Volutpatte Sit Id Accumsan, Ultricies. In Ultricies Maecenas Etiam Mauris Etiam Odio. Duis Tristique Lacus."
          />
        </div>
      </div>
      
      <div className="feature-grid">
        <FeatureCard
          icon={<LuArrowLeftRight />}
          title={"Stuff"}
          description={
            "Lorem ipsum dolor sit amet consectetur. Egestas egestas eu eleifend laoreet fringilla egestas tincidunt mauris. Non mi fringilla vel leo mauris proin urna turpis. Sodales laoreet turpis suscipit sapien velit senectus ipsum. Orci donec vel vel vulputate."
          }
        />

        <FeatureCard
          icon={<LuArrowLeftRight />}
          title={"Stuff"}
          description={
            "Lorem ipsum dolor sit amet consectetur. Egestas egestas eu eleifend laoreet fringilla egestas tincidunt mauris. Non mi fringilla vel leo mauris proin urna turpis. Sodales laoreet turpis suscipit sapien velit senectus ipsum. Orci donec vel vel vulputate."
          }
        />

        <FeatureCard
          icon={<LuArrowLeftRight />}
          title={"Stuff"}
          description={
            "Lorem ipsum dolor sit amet consectetur. Egestas egestas eu eleifend laoreet fringilla egestas tincidunt mauris. Non mi fringilla vel leo mauris proin urna turpis. Sodales laoreet turpis suscipit sapien velit senectus ipsum. Orci donec vel vel vulputate."
          }
        />
      </div>

      <h2>SwipeScout News </h2>
      <p style={{ textAlign: "center" }}>
        Here’s the latest news about SwipeScout.
      </p>

      <div className="testimonials-container">
      <TestimonialCard name={'The Snap Pixel: How It Works and How to Install '} role={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim.'} testimonial={'Read more'} image={news1} />
      <TestimonialCard name={'The Snap Pixel: How It Works and How to Install '} role={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim.'} testimonial={'Read more'} image={news2} />
      <TestimonialCard name={'The Snap Pixel: How It Works and How to Install '} role={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim.'} testimonial={'Read more'} image={news3} />
    </div>
    </div>
  );
};

export default LandingPageNoura;
