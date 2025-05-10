import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom"; // If using React Router

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // For navigation after login
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async e => {
  e.preventDefault();
  setError(null);
  setIsSubmitting(true);

  // Basic validation
  if (!formData.email || !formData.password) {
    setError("Please fill in all fields");
    setIsSubmitting(false);
    return;
  }

  const result = await login(formData.email, formData.password);

  if (result.error) {
    setError(result.message || "Login failed. Please try again.");
  } else {
    // Redirect on success
    navigate("/post-job"); // or use navigate if using React Router
  }

  setIsSubmitting(false);
};
  return (
    <div>
      <Header />
      <section className="login-form">
        <div className="container">
          <h2>Welcome Back!</h2>
          {error &&
            <div className="error-message">
              {error}
            </div>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <br />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
            <div className="social-login">
              <button type="button" className="btn-secondary">
                <i className="fab fa-google" /> Login with Google
              </button>
              <button type="button" className="btn-secondary">
                <i className="fab fa-linkedin" /> Login with LinkedIn
              </button>
            </div>
            <p>
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LoginPage;
