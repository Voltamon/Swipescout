import React, { useState } from 'react';
import './LoginForm.css';
import { Link } from 'react-router-dom';
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add login logic here
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>Welcome Back</h2>
        <p>Log in to your account</p>
        <form onSubmit={handleSubmit}>
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
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="login-btn">Log In</button>

          <div className="divider">Or log in with</div>

          <div className="social-buttons">
            <button className="google-btn">Google</button>
            <button className="linkedin-btn">LinkedIn</button>
          </div>

          <p className="signup-link">Don't have an account? <Link to="/RegisterForm">Sign Up</Link></p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
