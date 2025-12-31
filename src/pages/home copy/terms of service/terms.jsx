import i18n from 'i18next';
import React from 'react';
import './terms.css';

const TermsOfService = ({ isOpen, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="terms-overlay" onClick={handleOverlayClick}>
      <div className="terms-popup">
        <div className="terms-header">
          <h2>{i18n.t('auto_terms_of_service')}</h2>
          <button className="terms-close-btn" onClick={onClose} aria-label={i18n.t('auto_close_terms_of_service')} >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="terms-content">
          <div className="terms-meta">
            <p><strong>Effective Date:</strong>{i18n.t('auto_19_august_2025')}</p>
            <p><strong>Company:</strong>{i18n.t('auto_swipescout_ltd_united_kingdom')}</p>
          </div>

          <section className="terms-section">
            <h3>{i18n.t('auto_1_acceptance_of_terms')}</h3>
            <p>
              By creating an account or using SwipeScout (â€œweâ€‌, â€œourâ€‌, â€œusâ€‌), you agree to these Terms of Service. If you do not agree, do not use the platform.
            </p>
          </section>

          <section className="terms-section">
            <h3>{i18n.t('auto_2_who_can_use_swipescout')}</h3>
            <ul>
              <li>{i18n.t('auto_you_must_be_at_least_16_years_old')}</li>
              <li>You must provide accurate, truthful information when creating an account.</li>
              <li>Employers/recruiters must have the legal authority to represent their company.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>{i18n.t('auto_3_what_swipescout_provides')}</h3>
            <p>SwipeScout is a hiring platform that allows:</p>
            <ul>
              <li>Job seekers to create profiles and short video resumes (15â€“45 seconds).</li>
              <li>{i18n.t('auto_employers_to_post_jobs_and_discover_cand')}</li>
              <li>Both parties to connect, swipe, and message for hiring purposes.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>{i18n.t('auto_4_user_responsibilities')}</h3>
            <h4>{i18n.t('auto_for_job_seekers')}</h4>
            <ul>
              <li>{i18n.t('auto_only_upload_truthful_accurate_video_resu')}</li>
              <li>{i18n.t('auto_do_not_misrepresent_your_skills_experien')}</li>
            </ul>
            <h4>{i18n.t('auto_for_employers')}</h4>
            <ul>
              <li>{i18n.t('auto_only_post_real_job_opportunities')}</li>
              <li>{i18n.t('auto_no_fake_postings_spam_or_phishing_attemp')}</li>
              <li>Respect anti-discrimination laws (no unlawful bias in hiring).</li>
            </ul>
            <h4>{i18n.t('auto_for_everyone')}</h4>
            <p>You must NOT upload, share, or promote:</p>
            <ul>
              <li>NSFW content (pornography, nudity, sexually explicit material).</li>
              <li>Violent or hateful content (threats, harassment, incitement).</li>
              <li>Political or extremist content unrelated to genuine job opportunities.</li>
              <li>{i18n.t('auto_illegal_content_drugs_fraud_weapons_terr')}</li>
              <li>Sensitive personal data unless strictly necessary for hiring.</li>
              <li>{i18n.t('auto_spam_scams_or_misleading_information')}</li>
            </ul>
            <p>Violation of these rules can result in suspension or permanent account removal.</p>
          </section>

          <section className="terms-section">
            <h3>5. Content Ownership & License</h3>
            <ul>
              <li>{i18n.t('auto_you_retain_ownership_of_the_content_you_')}</li>
              <li>By uploading, you grant SwipeScout a worldwide, non-exclusive license to host, display, and share your content within the platform for its intended purpose (job matching).</li>
              <li>{i18n.t('auto_we_will_never_sell_your_content')}</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>6. Messaging & Communication</h3>
            <ul>
              <li>SwipeScout provides in-app messaging between job seekers and employers.</li>
              <li>{i18n.t('auto_messages_must_remain_professional_and_re')}</li>
              <li>We may monitor/report abuse to protect safety and compliance.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>{i18n.t('auto_7_prohibited_uses')}</h3>
            <p>You may not:</p>
            <ul>
              <li>{i18n.t('auto_use_swipescout_to_harass_exploit_or_scam')}</li>
              <li>{i18n.t('auto_attempt_to_hack_reverse_engineer_or_disr')}</li>
              <li>{i18n.t('auto_collect_or_harvest_user_data_without_per')}</li>
              <li>{i18n.t('auto_misuse_swipescout_for_non_recruitment_ac')}</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>{i18n.t('auto_8_service_availability')}</h3>
            <p>
              SwipeScout is an early-stage service. We do not guarantee continuous uptime, bug-free performance, or specific outcomes (employment, hires, offers).
            </p>
          </section>

          <section className="terms-section">
            <h3>{i18n.t('auto_9_liability_disclaimer')}</h3>
            <p>SwipeScout is not responsible for:</p>
            <ul>
              <li>{i18n.t('auto_hiring_decisions_made_by_employers')}</li>
              <li>{i18n.t('auto_job_offers_rejections_or_outcomes_from_u')}</li>
              <li>{i18n.t('auto_misrepresentation_by_users_job_seekers_o')}</li>
              <li>{i18n.t('auto_losses_damages_or_disputes_between_users')}</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>{i18n.t('auto_10_indemnity')}</h3>
            <p>
              You agree to indemnify and hold harmless SwipeScout, its officers, and employees from any claims, damages, or disputes arising from your misuse of the platform or violation of these Terms.
            </p>
          </section>

          <section className="terms-section">
            <h3>{i18n.t('auto_11_termination')}</h3>
            <ul>
              <li>{i18n.t('auto_we_may_suspend_or_delete_accounts_that_v')}</li>
              <li>{i18n.t('auto_you_may_close_your_account_at_any_time')}</li>
              <li>Content may remain for a short period after termination for security/legal reasons.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>{i18n.t('auto_12_changes_to_terms')}</h3>
            <p>
              We may update these Terms when necessary. Users will be notified of material changes via email or in-app notice.
            </p>
          </section>

          <section className="terms-section">
            <h3>{i18n.t('auto_13_dispute_resolution')}</h3>
            <ul>
              <li>{i18n.t('auto_these_terms_are_governed_by_the_laws_of_')}</li>
              <li>Disputes shall be resolved in the courts of England and Wales.</li>
              <li>Before legal action, both parties agree to attempt informal resolution via email contact.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>{i18n.t('auto_14_contact_us')}</h3>
            <address>
              <p>{i18n.t('auto_swipescout_ltd')}<br/>{i18n.t('auto_london_united_kingdom')}</p>
              <p>Email: <a href="mailto:support@swipescout.xyz">support@swipescout.xyz</a></p>
            </address>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 