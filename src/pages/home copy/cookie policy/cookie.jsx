import React from 'react';
import './cookie.css';

const CookiePolicy = ({ isOpen, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cookie-overlay" onClick={handleOverlayClick}>
      <div className="cookie-popup">
        <div className="cookie-header">
          <h2>Cookie Policy</h2>
          <button className="cookie-close-btn" onClick={onClose} aria-label="Close Cookie Policy">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="cookie-content">
          <div className="cookie-meta">
            <p><strong>Effective Date:</strong> 19 August 2025</p>
            <p><strong>Company:</strong> SwipeScout Ltd, United Kingdom</p>
          </div>

          <section className="cookie-section">
            <h3>1. What Are Cookies?</h3>
            <p>
              Cookies are small files stored on your device that help us improve your experience. 
              Similar technologies (such as SDKs in apps, pixels, and local storage) are also 
              covered in this policy.
            </p>
          </section>

          <section className="cookie-section">
            <h3>2. How We Use Cookies</h3>
            <p>SwipeScout uses cookies and similar tools to:</p>
            <ul>
              <li><strong>Essential cookies</strong> â€“ keep you logged in, enable swipe and video functions.</li>
              <li><strong>Performance cookies</strong> â€“ understand how users interact with the app (analytics, crash reports).</li>
              <li><strong>Functionality cookies</strong> â€“ remember preferences and settings.</li>
              <li><strong>Advertising cookies (future use)</strong> â€“ show relevant jobs or promotions (only if you consent).</li>
            </ul>
          </section>

          <section className="cookie-section">
            <h3>3. Third-Party Cookies</h3>
            <p>
              We may use trusted providers (e.g., analytics, cloud hosting, security tools) that 
              place cookies on your device. These providers must follow data protection laws.
            </p>
          </section>

          <section className="cookie-section">
            <h3>4. Managing Cookies</h3>
            <ul>
              <li><strong>On web:</strong> you can manage cookies through your browser settings (accept, block, or delete).</li>
              <li><strong>On mobile app:</strong> you can manage permissions in device settings.</li>
              <li>Some cookies are essential and cannot be disabled if you want to use SwipeScout.</li>
            </ul>
          </section>

          <section className="cookie-section">
            <h3>5. Consent</h3>
            <ul>
              <li>When you first visit SwipeScout, you will see a banner asking for cookie consent.</li>
              <li>By clicking "Accept", you agree to our use of cookies as described here.</li>
              <li>You can withdraw consent at any time by updating your settings.</li>
            </ul>
          </section>

          <section className="cookie-section">
            <h3>6. Updates</h3>
            <p>
              We may update this Cookie Policy if we add new features or services. If changes are 
              significant, we will notify you.
            </p>
          </section>

          <section className="cookie-section">
            <h3>7. Contact Us</h3>
            <p>For questions about this Cookie Policy, contact us at:</p>
            <div className="cookie-contact-info">
              <p><strong>SwipeScout Ltd</strong></p>
              <p>London, United Kingdom</p>
              <p><strong>Email:</strong> support@swipescout.xyz</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
