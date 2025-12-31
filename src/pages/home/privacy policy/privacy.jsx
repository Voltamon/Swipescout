import i18n from 'i18next';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { ScrollArea } from '@/components/UI/scroll-area.jsx';
import { Shield, Calendar, Building2, Lock, Users, Globe, FileText, Trash2, Eye, UserCheck, RefreshCw } from 'lucide-react';
import { homeThemeColors } from '@/config/theme-colors-home';

const PrivacyPolicy = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <DialogHeader className={`px-4 sm:px-6 pt-6 pb-4 ${homeThemeColors.borders.default} border-b sticky top-0 ${homeThemeColors.backgrounds.dialog} z-10`}>
          <DialogTitle className={`text-xl sm:text-2xl md:text-3xl font-bold ${homeThemeColors.text.gradient} flex items-center gap-2 sm:gap-3`}>
            <Shield className={`h-6 w-6 sm:h-8 sm:w-8 ${homeThemeColors.icons.primary}`} />
            <span>{i18n.t('auto_privacy_policy')}</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[calc(90vh-100px)]">
          <div className="px-4 sm:px-6 pb-6 space-y-4 sm:space-y-6">
            {/* Meta Information */}
            <div className={`flex flex-wrap gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r ${homeThemeColors.gradients.card} rounded-lg border ${homeThemeColors.borders.primary}`}>
              <Badge variant="outline" className={`flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm ${homeThemeColors.components.badge.outline}`}>
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span><strong>Effective Date:</strong>{i18n.t('auto_19_august_2025')}</span>
              </Badge>
              <Badge variant="outline" className={`flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm ${homeThemeColors.components.badge.outline}`}>
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span><strong>Company:</strong>{i18n.t('auto_swipescout_ltd_united_kingdom')}</span>
              </Badge>
            </div>

            {/* Section 1 - Who We Are */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Building2 className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.primary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_1_who_we_are')}</h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} text-sm sm:text-base`}>
                SwipeScout Ltd ("SwipeScout", "we", "our", "us") operates a job-matching platform that uses short video resumes, swipe-based discovery, and AI-powered tools to connect job seekers with employers. We are the data controller of your personal information under UK GDPR and the Data Protection Act 2018.
              </p>
            </section>

            {/* Section 2 - Information We Collect */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-4">
                <FileText className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.secondary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_2_information_we_collect')}</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className={`${homeThemeColors.components.section.subheading} mb-2 text-sm sm:text-base`}>{i18n.t('auto_from_job_seekers')}</h4>
                  <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                      <span>{i18n.t('auto_name_email_phone_work_history_education_')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                      <span>{i18n.t('auto_video_resumes_15_45_seconds')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                      <span>{i18n.t('auto_swipe_and_match_activity')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                      <span>{i18n.t('auto_messages_and_interactions')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                      <span>{i18n.t('auto_device_and_usage_data_ip_address_browser')}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className={`${homeThemeColors.components.section.subheading} mb-2 text-sm sm:text-base`}>{i18n.t('auto_from_employers')}</h4>
                  <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                      <span>{i18n.t('auto_company_details_name_address_email')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                      <span>{i18n.t('auto_recruiter_account_details')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                      <span>{i18n.t('auto_job_postings')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                      <span>{i18n.t('auto_activity_data_views_swipes_interactions_')}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className={`${homeThemeColors.components.section.subheading} mb-2 text-sm sm:text-base`}>{i18n.t('auto_automatically_collected')}</h4>
                  <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.accent} mt-1`}>•</span>
                      <span>{i18n.t('auto_cookies_and_tracking_data_see_cookie_pol')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.accent} mt-1`}>•</span>
                      <span>{i18n.t('auto_analytics_for_platform_performance_and_a')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 - How We Use */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Users className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.accent} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_3_how_we_use_your_information')}</h3>
              </div>
              <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                {[
                  'Provide and improve our job-matching services',
                  'Enable video uploads and swipe-based discovery',
                  'Support AI-powered candidate recommendations',
                  'Facilitate communication between job seekers and employers',
                  'Maintain security and prevent fraud',
                  'Comply with legal obligations'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className={`${homeThemeColors.icons.accent} mt-1`}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 4 - Lawful Basis */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Lock className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.primary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_4_lawful_basis_for_processing')}</h3>
              </div>
              <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                {[
                  { label: 'Consent', desc: 'e.g., uploading a video resume' },
                  { label: 'Contract', desc: 'providing services you sign up for' },
                  { label: 'Legitimate interests', desc: 'improving features, preventing abuse' },
                  { label: 'Legal obligations', desc: 'where required by UK law' }
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                    <span><strong className={homeThemeColors.text.primary}>{item.label}</strong> ({item.desc})</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 5 - Sharing */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Globe className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.secondary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_5_sharing_your_information')}</h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} mb-3 text-sm sm:text-base`}>
                We may share your information with:
              </p>
              <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base mb-3`}>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                  <span>{i18n.t('auto_employers_and_recruiters_when_you_apply_')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                  <span>{i18n.t('auto_service_providers_e_g_cloud_storage_anal')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                  <span>{i18n.t('auto_regulators_or_law_enforcement_where_lega')}</span>
                </li>
              </ul>
              <p className={`${homeThemeColors.components.section.text} text-sm sm:text-base font-semibold`}>{i18n.t('auto_we_do_not_sell_your_personal_data')}</p>
            </section>

            {/* Section 6 - International Transfers */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Globe className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.accent} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_6_international_transfers')}</h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} text-sm sm:text-base`}>
                Your data may be stored outside the UK/EEA using cloud services. We apply safeguards such as Standard Contractual Clauses to protect your information.
              </p>
            </section>

            {/* Section 7 - Your Rights */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <UserCheck className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.primary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_7_your_rights')}</h3>
              </div>
              <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base mb-3`}>
                {[
                  'Access your data',
                  'Correct inaccuracies',
                  'Request deletion ("right to be forgotten")',
                  'Object or restrict processing',
                  'Request a copy of your data (data portability)',
                  'Withdraw consent at any time'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className={`${homeThemeColors.components.section.text} text-sm sm:text-base`}>
                To exercise these rights, contact us at{' '}
                <a href="mailto:support@swipescout.xyz" className={homeThemeColors.text.link}>
                  support@swipescout.xyz
                </a>.
              </p>
            </section>

            {/* Section 8 - Data Retention */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Trash2 className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.secondary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_8_data_retention')}</h3>
              </div>
              <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                  <span><strong className={homeThemeColors.text.primary}>Active accounts:</strong>{i18n.t('auto_data_kept_while_you_use_swipescout')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                  <span><strong className={homeThemeColors.text.primary}>Inactive accounts:</strong>{i18n.t('auto_deleted_after_24_months')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                  <span><strong className={homeThemeColors.text.primary}>Messages:</strong>{i18n.t('auto_deleted_within_12_months_of_account_clos')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                  <span><strong className={homeThemeColors.text.primary}>Legal records:</strong>{i18n.t('auto_retained_where_required_by_law')}</span>
                </li>
              </ul>
            </section>

            {/* Section 9 - Security */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Lock className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.accent} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_9_security')}</h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} text-sm sm:text-base`}>
                We use encryption, secure servers, and monitoring to protect your information. While no system is 100% secure, we take reasonable steps to safeguard your data.
              </p>
            </section>

            {/* Section 10 - Children's Privacy */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Users className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.primary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_10_children_s_privacy')}</h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} text-sm sm:text-base`}>
                SwipeScout is not for individuals under 16. If we become aware that we've collected data from someone under 16 without parental consent, we will delete it.
              </p>
            </section>

            {/* Section 11 - Changes */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <RefreshCw className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.secondary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_11_changes_to_this_policy')}</h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} text-sm sm:text-base`}>
                We may update this Privacy Policy as needed. If changes are significant, we'll notify users through the app or email.
              </p>
            </section>

            {/* Section 12 - Contact (highlighted) */}
            <section className={`bg-gradient-to-r ${homeThemeColors.gradients.card} p-4 sm:p-6 rounded-lg border ${homeThemeColors.borders.primary} ${homeThemeColors.shadows.md}`}>
              <div className="flex items-start gap-3 mb-3">
                <Building2 className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.primary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_12_contact_us')}</h3>
              </div>
              <div className={`${homeThemeColors.backgrounds.card} p-3 sm:p-4 rounded-lg space-y-1 text-sm sm:text-base`}>
                <p className={`font-semibold ${homeThemeColors.text.primary}`}>{i18n.t('auto_swipescout_ltd')}</p>
                <p className={homeThemeColors.text.secondary}>{i18n.t('auto_london_united_kingdom')}</p>
                <p className={homeThemeColors.text.secondary}>
                  <strong className={homeThemeColors.text.primary}>Email:</strong>{' '}
                  <a href="mailto:support@swipescout.xyz" className={homeThemeColors.text.link}>
                    support@swipescout.xyz
                  </a>
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicy;
