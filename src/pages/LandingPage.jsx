import React from "react";
import Header from "../components/Header3/Header3";
import Footer from "../components/Footer";
import FeatureCard from "../components/FeatureCard";
import TestimonialCard from "../components/TestimonialCard";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  const features = [
    {
      icon: "fas fa-swimmer",
      title: "Swipe-Based Matching",
      description: "Easily find jobs or candidates with a simple swipe."
    },
    {
      icon: "fas fa-video",
      title: "Video Resumes",
      description: "Showcase your skills with video resumes."
    },
    {
      icon: "fas fa-comments",
      title: "Real-Time Chat",
      description: "Communicate instantly with employers or job seekers."
    },
    {
      icon: "fas fa-brain",
      title: "AI-Powered Recommendations",
      description: "Get personalized job or candidate recommendations."
    }
  ];

  const testimonials = [
    {
      image: "https://via.placeholder.com/80",
      name: "John Doe",
      role: "Software Engineer",
      testimonial: "Swipscout helped me find my dream job in no time!"
    },
    {
      image: "https://via.placeholder.com/80",
      name: "Jane Smith",
      role: "HR Manager",
      testimonial: "The AI recommendations are spot on. Highly recommend!"
    }
  ];

  return (
    <div>
      <Header />
      <section className="hero">
        <div className="container">
          <h1>Find Your Dream Job with Swipscout</h1>
          <p>Swipe, Match, and Connect with Employers.</p>
          <div className="cta-buttons">
            <a href="/signup" className="btn-primary">
              Sign Up as Job Seeker
            </a>
            <a href="/signup" className="btn-secondary">
              Sign Up as Employer
            </a>
          </div>
        </div>
      </section>
      <section className="features">
        <div className="container">
          <h2>Why Choose Swipscout?</h2>
          <div className="feature-grid">
            {features.map((feature, index) =>
              <FeatureCard key={index} {...feature} />
            )}
          </div>
        </div>
      </section>
      <Navbar></Navbar>
      <section className="testimonials">
        <div className="container">
          <h2>What Our Users Say</h2>
          <div className="testimonial-carousel">
            {testimonials.map((testimonial, index) =>
              <TestimonialCard key={index} {...testimonial} />
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;
