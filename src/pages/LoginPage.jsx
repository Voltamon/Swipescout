import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LoginPage = () => {
  return (
    <div>
      <Header />
      <section className="login-form">
        <div className="container">
          <h2>Welcome Back!</h2>
          <form>
            <input type="email" placeholder="Enter your email" required />
            <input type="password" placeholder="Enter your password" required />
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
            <button type="submit" className="btn-primary">Login</button>
            <div className="social-login">
              <button type="button" className="btn-secondary"><i className="fab fa-google"></i> Login with Google</button>
              <button type="button" className="btn-secondary"><i className="fab fa-linkedin"></i> Login with LinkedIn</button>
            </div>
            <p>Don’t have an account? <a href="/signup">Sign Up</a></p>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LoginPage;