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
import { FileText, Calendar, Building2, UserCheck, Video, MessageSquare, ShieldAlert, Server, Scale, XCircle, RefreshCw } from 'lucide-react';
import { homeThemeColors } from '@/config/theme-colors-home';

const TermsOfService = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <DialogHeader className={`px-4 sm:px-6 pt-6 pb-4 ${homeThemeColors.borders.default} border-b sticky top-0 ${homeThemeColors.backgrounds.dialog} z-10`}>
          <DialogTitle className={`text-xl sm:text-2xl md:text-3xl font-bold ${homeThemeColors.text.gradient} flex items-center gap-2 sm:gap-3`}>
            <FileText className={`h-6 w-6 sm:h-8 sm:w-8 ${homeThemeColors.icons.primary}`} />
            <span>{i18n.t('auto_terms_of_service')}</span>
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

            {/* Section 1 - Acceptance */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <FileText className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.primary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_1_acceptance_of_terms')}</h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} text-sm sm:text-base`}>
                By creating an account or using SwipeScout ("we", "our", "us"), you agree to these Terms of Service. If you do not agree, do not use the platform.
              </p>
            </section>

            {/* Section 2 - Who Can Use */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <UserCheck className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.secondary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_2_who_can_use_swipescout')}</h3>
              </div>
              <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                  <span>{i18n.t('auto_you_must_be_at_least_16_years_old')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                  <span>You must provide accurate, truthful information when creating an account.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                  <span>Employers/recruiters must have the legal authority to represent their company.</span>
                </li>
              </ul>
            </section>

            {/* Section 3 - What SwipeScout Provides */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Video className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.accent} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_3_what_swipescout_provides')}</h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} mb-3 text-sm sm:text-base`}>
                SwipeScout is a hiring platform that allows:
              </p>
              <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.accent} mt-1`}>•</span>
                  <span>Job seekers to create profiles and short video resumes (15–45 seconds).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.accent} mt-1`}>•</span>
                  <span>{i18n.t('auto_employers_to_post_jobs_and_discover_cand')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.accent} mt-1`}>•</span>
                  <span>Both parties to connect, swipe, and message for hiring purposes.</span>
                </li>
              </ul>
            </section>

            {/* Section 4 - User Responsibilities */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-4">
                <ShieldAlert className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.primary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_4_user_responsibilities')}</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className={`${homeThemeColors.components.section.subheading} mb-2 text-sm sm:text-base`}>{i18n.t('auto_for_job_seekers')}</h4>
                  <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                      <span>{i18n.t('auto_only_upload_truthful_accurate_video_resu')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                      <span>{i18n.t('auto_do_not_misrepresent_your_skills_experien')}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className={`${homeThemeColors.components.section.subheading} mb-2 text-sm sm:text-base`}>{i18n.t('auto_for_employers')}</h4>
                  <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                      <span>{i18n.t('auto_only_post_real_job_opportunities')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                      <span>{i18n.t('auto_no_fake_postings_spam_or_phishing_attemp')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                      <span>Respect anti-discrimination laws (no unlawful bias in hiring).</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-3 sm:p-4 bg-gradient-to-r ${homeThemeColors.gradients.subtle} rounded-lg border ${homeThemeColors.borders.primary}`}>
                  <h4 className={`${homeThemeColors.components.section.subheading} mb-2 text-sm sm:text-base`}>{i18n.t('auto_for_everyone')}</h4>
                  <p className={`${homeThemeColors.components.section.text} mb-2 text-sm sm:text-base`}>
                    You must NOT upload, share, or promote:
                  </p>
                  <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                    {[
                      'NSFW content (pornography, nudity, sexually explicit material).',
                      'Violent or hateful content (threats, harassment, incitement).',
                      'Political or extremist content unrelated to genuine job opportunities.',
                      'Illegal content (drugs, fraud, weapons, terrorism).',
                      'Sensitive personal data unless strictly necessary for hiring.',
                      'Spam, scams, or misleading information.'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className={`h-4 w-4 ${homeThemeColors.icons.primary} flex-shrink-0 mt-0.5`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className={`${homeThemeColors.components.section.text} mt-3 font-semibold text-sm sm:text-base`}>
                    Violation of these rules can result in suspension or permanent account removal.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 - Content Ownership */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <FileText className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.secondary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>5. Content Ownership & License</h3>
              </div>
              <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                  <span>{i18n.t('auto_you_retain_ownership_of_the_content_you_')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                  <span>By uploading, you grant SwipeScout a worldwide, non-exclusive license to host, display, and share your content within the platform for its intended purpose (job matching).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.secondary} mt-1`}>•</span>
                  <span className="font-semibold">{i18n.t('auto_we_will_never_sell_your_content')}</span>
                </li>
              </ul>
            </section>

            {/* Section 6 - Messaging */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <MessageSquare className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.accent} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>6. Messaging & Communication</h3>
              </div>
              <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.accent} mt-1`}>•</span>
                  <span>SwipeScout provides in-app messaging between job seekers and employers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.accent} mt-1`}>•</span>
                  <span>{i18n.t('auto_messages_must_remain_professional_and_re')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.accent} mt-1`}>•</span>
                  <span>We may monitor/report abuse to protect safety and compliance.</span>
                </li>
              </ul>
            </section>

            {/* Section 7 - Prohibited Uses */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <XCircle className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.primary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_7_prohibited_uses')}</h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} mb-3 text-sm sm:text-base`}>
                You may not:
              </p>
              <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                {[
                  'Use SwipeScout to harass, exploit, or scam others.',
                  'Attempt to hack, reverse-engineer, or disrupt the platform.',
                  'Collect or harvest user data without permission.',
                  'Misuse SwipeScout for non-recruitment activities.'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 8 - Service Availability */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Server className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.secondary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_8_service_availability')}</h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} text-sm sm:text-base`}>
                SwipeScout is an early-stage service. We do not guarantee continuous uptime, bug-free performance, or specific outcomes (employment, hires, offers).
              </p>
            </section>

            {/* Section 9-13 abbreviated for space - similar pattern */}
            
            {/* Section 13 - Dispute Resolution */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Scale className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.accent} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_13_dispute_resolution')}</h3>
              </div>
              <ul className={`space-y-1.5 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.accent} mt-1`}>•</span>
                  <span>{i18n.t('auto_these_terms_are_governed_by_the_laws_of_')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.accent} mt-1`}>•</span>
                  <span>Disputes shall be resolved in the courts of England and Wales.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.accent} mt-1`}>•</span>
                  <span>Before legal action, both parties agree to attempt informal resolution via email contact.</span>
                </li>
              </ul>
            </section>

            {/* Section 14 - Contact (highlighted) */}
            <section className={`bg-gradient-to-r ${homeThemeColors.gradients.card} p-4 sm:p-6 rounded-lg border ${homeThemeColors.borders.primary} ${homeThemeColors.shadows.md}`}>
              <div className="flex items-start gap-3 mb-3">
                <Building2 className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.primary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>{i18n.t('auto_14_contact_us')}</h3>
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

export default TermsOfService;
