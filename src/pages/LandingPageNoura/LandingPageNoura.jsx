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
import FAQAccordion from "../../components/FAQAccordion/FAQAccordion";
import Footer2 from "../../components/Footer2/Footer2";

const LandingPageNoura = () => {
  console.log("LandingPageNoura loaded");
  const faqs = [
    {
      question: "How long until we deliver your first blog post?",
      answer:
        "Really boy law country she unable her sister. Feet you off its like like sea...",
    },
    {
      question: "What are the benefits of using Swipe Scout?",
      answer:
        "Swipe Scout helps you find opportunities faster with AI-powered recommendations...",
    },
    {
      question: "Is Swipe Scout available on mobile?",
      answer: "Yes! Our app is available for both Android and iOS devices...",
    },
  ];
  return (
    <div className="landing">
      <Header3 />
      <HeroSection />
      <div>
      <h2 style={{color:'#5D9BCF'}}>What Makes Swipe Scout Unique?</h2>
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
      </div>
      <div style={{background:'#ffffff'}}>
      <div className="feature-grid" style={{ margin: "50px"}}>
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

      <h2 style={{color:"black"}}>SwipeScout News </h2>
      <p style={{ textAlign: "center",color:"black" }}>
        Here’s the latest news about SwipeScout.
      </p>

      <div className="testimonials-container" style={{ margin: "50px" }}>
        <TestimonialCard
          name={"The Snap Pixel: How It Works and How to Install "}
          role={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim."
          }
          testimonial={"Read more"}
          image={news1}
        />
        <TestimonialCard
          name={"The Snap Pixel: How It Works and How to Install "}
          role={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim."
          }
          testimonial={"Read more"}
          image={news2}
        />
        <TestimonialCard
          name={"The Snap Pixel: How It Works and How to Install "}
          role={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim."
          }
          testimonial={"Read more"}
          image={news3}
        />
      </div>
      <a>Older News </a>
      </div>
      <h2 style={{color:'#5D9BCF'}}>Frequently Ask Questions</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <React.Fragment key={index}>
            <FAQAccordion faqs={[faq]} />
            {index % 2 === 0 && index + 1 < faqs.length && (
              <FAQAccordion faqs={[faqs[index + 1]]} />
            )}
          </React.Fragment>
        ))}
      </div>
      <Footer2 />
    </div>
  );
};

export default LandingPageNoura;
