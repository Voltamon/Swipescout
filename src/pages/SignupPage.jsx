import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RoleCard from "../components/RoleCard";

const SignupPage = () => {
  const roles = [
    {
      icon: "fas fa-user",
      title: "Job Seeker",
      description: "Find your dream job."
    },
    {
      icon: "fas fa-briefcase",
      title: "Employer",
      description: "Hire top talent."
    }
  ];

  return (
    <div>
      <Header />
      <section className="signup-form">
        <div className="container">
          <h2>Join Swipscout Today!</h2>
          <div className="role-selection">
            {roles.map((role, index) => <RoleCard key={index} {...role} />)}
          </div>
          <form>
            <input type="text" placeholder="Enter your full name" required />
            <input type="email" placeholder="Enter your email" required />
            <input type="password" placeholder="Create a password" required />
            <input
              type="password"
              placeholder="Confirm your password"
              required
            />
            <button type="submit" className="btn-primary">
              Sign Up
            </button>
            <div className="social-signup">
              <button type="button" className="btn-secondary">
                <i className="fab fa-google" /> Sign Up with Google
              </button>
              <button type="button" className="btn-secondary">
                <i className="fab fa-linkedin" /> Sign Up with LinkedIn
              </button>
            </div>
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SignupPage;
