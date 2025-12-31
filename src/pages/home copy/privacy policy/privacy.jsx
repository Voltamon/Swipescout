import i18n from 'i18next';
import React from 'react';
import './privacy.css';

const PrivacyPolicy = ({ isOpen, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="privacy-overlay" onClick={handleOverlayClick}>
      <div className="privacy-popup">
        <div className="privacy-header">
          <h2>{i18n.t('auto_privacy_policy')}</h2>
          <button className="privacy-close-btn" onClick={onClose} aria-label={i18n.t('auto_close_privacy_policy')} >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="privacy-content">
          <div className="privacy-meta">
            <p><strong>Effective Date:</strong>{i18n.t('auto_19_august_2025')}</p>
            <p><strong>Company:</strong>{i18n.t('auto_swipescout_ltd_united_kingdom')}</p>
          </div>

          <section className="privacy-section">
            <h3>{i18n.t('auto_1_who_we_are')}</h3>
            <p>
              SwipeScout Ltd (â€œSwipeScoutâ€‌, â€œweâ€‌, â€œourâ€‌, â€œusâ€‌) operates a job-matching platform that uses short video resumes, swipe-based discovery, and AI-powered tools to connect job seekers with employers. We are the data controller of your personal information under UK GDPR and the Data Protection Act 2018.
            </p>
          </section>

          <section className="privacy-section">
            <h3>{i18n.t('auto_2_information_we_collect')}</h3>
            <h4>{i18n.t('auto_from_job_seekers')}</h4>
            <ul>
              <li>{i18n.t('auto_name_email_phone_work_history_education_')}</li>
              <li>Video resumes (15â€“45 seconds)</li>
              <li>{i18n.t('auto_swipe_and_match_activity')}</li>
              <li>{i18n.t('auto_messages_and_interactions')}</li>
              <li>{i18n.t('auto_device_and_usage_data_ip_address_browser')}</li>
            </ul>
            <h4>{i18n.t('auto_from_employers')}</h4>
            <ul>
              <li>{i18n.t('auto_company_details_name_address_email')}</li>
              <li>{i18n.t('auto_recruiter_account_details')}</li>
              <li>{i18n.t('auto_job_postings')}</li>
              <li>{i18n.t('auto_activity_data_views_swipes_interactions_')}</li>
            </ul>
            <h4>{i18n.t('auto_automatically_collected')}</h4>
            <ul>
              <li>{i18n.t('auto_cookies_and_tracking_data_see_cookie_pol')}</li>
              <li>{i18n.t('auto_analytics_for_platform_performance_and_a')}</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3>{i18n.t('auto_3_how_we_use_your_information')}</h3>
            <ul>
              <li>{i18n.t('auto_provide_and_improve_our_job_matching_ser')}</li>
              <li>{i18n.t('auto_enable_video_uploads_and_swipe_based_dis')}</li>
              <li>{i18n.t('auto_support_ai_powered_candidate_recommendat')}</li>
              <li>{i18n.t('auto_facilitate_communication_between_job_see')}</li>
              <li>{i18n.t('auto_maintain_security_and_prevent_fraud')}</li>
              <li>{i18n.t('auto_comply_with_legal_obligations')}</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3>{i18n.t('auto_4_lawful_basis_for_processing')}</h3>
            <ul>
              <li>{i18n.t('auto_consent_e_g_uploading_a_video_resume')}</li>
              <li>{i18n.t('auto_contract_providing_services_you_sign_up_')}</li>
              <li>{i18n.t('auto_legitimate_interests_improving_features_')}</li>
              <li>{i18n.t('auto_legal_obligations_where_required_by_uk_l')}</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3>{i18n.t('auto_5_sharing_your_information')}</h3>
            <p>We may share your information with:</p>
            <ul>
              <li>{i18n.t('auto_employers_and_recruiters_when_you_apply_')}</li>
              <li>{i18n.t('auto_service_providers_e_g_cloud_storage_anal')}</li>
              <li>{i18n.t('auto_regulators_or_law_enforcement_where_lega')}</li>
            </ul>
            <p>{i18n.t('auto_we_do_not_sell_your_personal_data')}</p>
          </section>

          <section className="privacy-section">
            <h3>{i18n.t('auto_6_international_transfers')}</h3>
            <p>
              Your data may be stored outside the UK/EEA using cloud services. We apply safeguards such as Standard Contractual Clauses to protect your information.
            </p>
          </section>

          <section className="privacy-section">
            <h3>{i18n.t('auto_7_your_rights')}</h3>
            <ul>
              <li>{i18n.t('auto_access_your_data')}</li>
              <li>{i18n.t('auto_correct_inaccuracies')}</li>
              <li>Request deletion (â€œright to be forgottenâ€‌)</li>
              <li>{i18n.t('auto_object_or_restrict_processing')}</li>
              <li>{i18n.t('auto_request_a_copy_of_your_data_data_portabi')}</li>
              <li>{i18n.t('auto_withdraw_consent_at_any_time')}</li>
            </ul>
            <p>{i18n.t('auto_to_exercise_these_rights_contact_us_at')}<a href="mailto:support@swipescout.xyz">support@swipescout.xyz</a>.
            </p>
          </section>

          <section className="privacy-section">
            <h3>{i18n.t('auto_8_data_retention')}</h3>
            <ul>
              <li>Active accounts: data kept while you use SwipeScout</li>
              <li>Inactive accounts: deleted after 24 months</li>
              <li>Messages: deleted within 12 months of account closure</li>
              <li>Legal records: retained where required by law</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3>{i18n.t('auto_9_security')}</h3>
            <p>
              We use encryption, secure servers, and monitoring to protect your information. While no system is 100% secure, we take reasonable steps to safeguard your data.
            </p>
          </section>

          <section className="privacy-section">
            <h3>10. Childrenâ€™s Privacy</h3>
            <p>
              SwipeScout is not for individuals under 16. If we become aware that weâ€™ve collected data from someone under 16 without parental consent, we will delete it.
            </p>
          </section>

          <section className="privacy-section">
            <h3>{i18n.t('auto_11_changes_to_this_policy')}</h3>
            <p>
              We may update this Privacy Policy as needed. If changes are significant, weâ€™ll notify users through the app or email.
            </p>
          </section>

          <section className="privacy-section">
            <h3>{i18n.t('auto_12_contact_us')}</h3>
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

export default PrivacyPolicy; 