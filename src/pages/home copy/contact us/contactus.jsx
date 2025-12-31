import i18n from 'i18next';
import React from 'react';
import './contactus.css';

const ContactUs = ({ isOpen, onClose }) => {

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="contact-overlay" onClick={handleOverlayClick}>
      <div className="contact-popup">
        <div className="contact-header">
          <h2>{i18n.t('auto_contact_us')}</h2>
          <button className="contact-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-method">
              <div className="contact-icon email-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="contact-details">
                <h3>{i18n.t('auto_email_us')}</h3>
                <p>{i18n.t('auto_for_general_questions_or_inquiries')}</p>
                <a href="mailto:support@swipescout.xyz" className="contact-link">
                  support@swipescout.xyz
                </a>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-icon discord-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.17,1.83a2.38,2.38,0,0,0-1.28-.79C17.75,0,14.63,0,11.5,0A22.82,22.82,0,0,0,1.72,1.15a2.37,2.37,0,0,0-1.28.79A2.37,2.37,0,0,0,0,2.94,22.39,22.39,0,0,0,1.3,16.27,2.37,2.37,0,0,0,2,17.43a2.38,2.38,0,0,0,1.28.79A22.82,22.82,0,0,0,11.5,19.34a22.82,22.82,0,0,0,8.22-1.12,2.38,2.38,0,0,0,1.28-.79,2.37,2.37,0,0,0,.72-1.16,22.39,22.39,0,0,0,1.3-13.33A2.37,2.37,0,0,0,21.17,1.83Zm-1.84,14.4a.79.79,0,0,1-.46.33,18.73,18.73,0,0,1-7.37,1,18.73,18.73,0,0,1-7.37-1,.79.79,0,0,1-.46-.33,18.84,18.84,0,0,1-.7-3.95A19.46,19.46,0,0,1,2.83,6.23a.79.79,0,0,1,.46-.33A18.73,18.73,0,0,1,11.5,5a18.73,18.73,0,0,1,7.37,1,.79.79,0,0,1,.46.33A19.46,19.46,0,0,1,20.08,12.3Z"/>
                  <path d="M12.91,12.35a2.4,2.4,0,0,1-1.39.46,2.4,2.4,0,0,1-1.39-.46,2.16,2.16,0,0,1-.39-.56,3.87,3.87,0,0,1-.13-.7,4.3,4.3,0,0,1,.13-.7,2.16,2.16,0,0,1,.39-.56A2.4,2.4,0,0,1,11.5,9.45a2.4,2.4,0,0,1,1.39.46,2.16,2.16,0,0,1,.39.56,3.87,3.87,0,0,1,.13.7,4.3,4.3,0,0,1-.13.7,2.16,2.16,0,0,1-.39.56Z"/>
                  <path d="M16.14,12.35a2.4,2.4,0,0,1-1.39.46,2.4,2.4,0,0,1-1.39-.46,2.16,2.16,0,0,1-.39-.56,3.87,3.87,0,0,1-.13-.7,4.3,4.3,0,0,1,.13-.7,2.16,2.16,0,0,1,.39-.56,2.4,2.4,0,0,1,1.39-.46,2.4,2.4,0,0,1,1.39.46,2.16,2.16,0,0,1,.39.56,3.87,3.87,0,0,1,.13.7,4.3,4.3,0,0,1-.13.7,2.16,2.16,0,0,1-.39.56Z"/>
                  <path d="M11.5,14.61a.7.7,0,0,1-.41-.12,5.77,5.77,0,0,1-1.5-.7,4.2,4.2,0,0,1-.7-.84.79.79,0,0,1,.16-.83.77.77,0,0,1,.71-.16.7.7,0,0,1,.41.12,4.55,4.55,0,0,0,1.07.56A4.55,4.55,0,0,0,12.5,12.9a.7.7,0,0,1,.41-.12.77.77,0,0,1,.71.16.79.79,0,0,1,.16.83,4.2,4.2,0,0,1-.7.84,5.77,5.77,0,0,1-1.5.7A.7.7,0,0,1,11.5,14.61Z"/>
                </svg>
              </div>
              <div className="contact-details">
                <h3>{i18n.t('auto_join_our_discord')}</h3>
                <p>{i18n.t('auto_connect_with_us_and_the_community')}</p>
                <a href="https://discord.gg/mHcdMn6yMh" target="_blank" rel="noopener noreferrer" className="contact-link discord-link">{i18n.t('auto_join_discord_server')}</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;
