import React from "react";
import Header3 from "../../components/Header3/Header3";
import HeroSection from "../../components/HeroSection/HeroSection";
import "./LandingPageNoura.css";
import Feature from "../../components/Feature/Feature";
import phoneImage from "../../assets/phone.png";
import FeatureCard from "../../components/FeatureCard";
import { LuArrowLeftRight } from "react-icons/lu";
import TestimonialCard from "../../components/TestimonialCard";
// import news1 from "../../assets/news1.png";
// import news2 from "../../assets/news2.png";
// import news3 from "../../assets/news3.png";
import FAQAccordion from "../../components/FAQAccordion/FAQAccordion";
import Footer2 from "../../components/Footer2/Footer2";
import { useWindowSize } from "../../hooks/useWindowSize.js";

const LandingPageNoura = () => {
  console.log("LandingPageNoura loaded");
  const { width } = useWindowSize();
  const faqs = [
    {
      question: "How long until we deliver your first blog post?",
      answer:
        "Really boy law country she unable her sister. Feet you off its like like sea..."
    },
    {
      question: "What are the benefits of using Swipe Scout?",
      answer:
        "Swipe Scout helps you find opportunities faster with AI-powered recommendations..."
    },
    {
      question: "Is Swipe Scout available on mobile?",
      answer: "Yes! Our app is available for both Android and iOS devices..."
    }
  ];
  return (
    <div className="landing">
      <Header3 />
      <HeroSection />
      <div>
        <h2 style={{ color: "#5D9BCF" }}>What Makes Swipe Scout Unique?</h2>
        <div className="features-container">
          <div className="phone-image">
            <img src={phoneImage} alt="App Preview" />
          </div>
          <div className="features-text">
            <Feature
              title="Video Resumes"
              description="
🔔 Showcase Personality in Seconds
SwipeScout lets job seekers express themselves with short 15–45 second video pitches—making it easier for companies to connect with confident, creative talent."
            />

            <Feature
              style={{ marginLeft: width >= 1025 ? 60 : -8 }}
              className="feature-container"
              title="Swipe Feature"
              description="🔔 Swipe Featuregit
Fast, Fun, and Intentional Matching
Swipe through jobs or candidates just like you would on social apps. Tap in for full profiles, then connect if there’s mutual interest—no ghosting, no clutter."
            />
          </div>
        </div>
      </div>
      <div style={{ background: "#ffffff" }}>
        <div className="feature-grid" style={{ margin: "50px" }}>
          <FeatureCard
            icon={<LuArrowLeftRight />}
            title={"Video Resumes"}
            subtitle={"🔔 Unlock Real Talent"}
            description={
              " SwipeScout lets job seekers upload 15–45 second video resumes, giving employers a real glimpse of their personality, communication, and creativity—far beyond what paper resumes can offer."
            }
          />

          <FeatureCard
            icon={<LuArrowLeftRight />}
            title={"Swipe to Discover"}
            subtitle={"🔔 Smarter Matching"}
            description={
              " Our intuitive swipe interface allows job seekers and employers to discover each other quickly, creating matches based on real impressions, not just text."
            }
          />

          <FeatureCard
            icon={<LuArrowLeftRight />}
            title={"Real-Time Connections"}
            subtitle={"🔔 Chat and Connect"}
            description={
              " Once there’s a match, messaging opens up—making it easy to schedule interviews, ask questions, and take the next step, all in-app."
            }
          />
        </div>
        {/* <h2 style={{ color: "black" }}>SwipeScout News </h2>
        <p style={{ textAlign: "center", color: "black" }}>
          Here’s the latest news about SwipeScout.
        </p>
        <div className="testimonials-container" style={{ margin: "50px" }}>
          <TestimonialCard name={"The Snap Pixel: How It Works and How to Install "} role={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim."} testimonial={""} image={news1} />
          <TestimonialCard name={"The Snap Pixel: How It Works and How to Install "} role={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim."} testimonial={""} image={news2} />
          <TestimonialCard name={"The Snap Pixel: How It Works and How to Install "} role={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra nunc ante velit vitae. Est tellus vitae, nullam lobortis enim."} testimonial={""} image={news3} />
        </div> */}
        <br />
        <br />{" "}
      </div>

      <Footer2 />
    </div>
  );
};

export default LandingPageNoura;
