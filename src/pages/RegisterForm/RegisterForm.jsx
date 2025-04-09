import React, { useState } from "react";
import "./RegisterForm.css";
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role: prev.role === role ? "" : role,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add submission logic
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Create Your Account</h2>
        <p>Join our platform to find your perfect job match</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <div className="role-selection">
            <label>Select your role</label>
            <div className="roles">
              <div
                className={`role ${
                  formData.role === "job_seeker" ? "active" : ""
                }`}
                onClick={() => handleRoleChange("job_seeker")}
              >
                👤 Job Seeker
              </div>
              <div
                className={`role ${
                  formData.role === "employer" ? "active" : ""
                }`}
                onClick={() => handleRoleChange("employer")}
              >
                🏢 Employer
              </div>
            </div>
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>

          <div className="divider">Or sign up with</div>

          <div className="social-buttons">
            <button className="google-btn">Google</button>
            <button className="linkedin-btn">LinkedIn</button>
          </div>

          <p className="login-link">
            Already have an account? <Link to="/LoginForm">Logn in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
