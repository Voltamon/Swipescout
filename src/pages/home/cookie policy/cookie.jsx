import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Cookie, Calendar, Building2, Settings, Shield, Users } from 'lucide-react';
import { homeThemeColors } from '@/config/theme-colors-home';

const CookiePolicy = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <DialogHeader className={`px-4 sm:px-6 pt-6 pb-4 ${homeThemeColors.borders.default} border-b sticky top-0 ${homeThemeColors.backgrounds.dialog} z-10`}>
          <DialogTitle className={`text-xl sm:text-2xl md:text-3xl font-bold ${homeThemeColors.text.gradient} flex items-center gap-2 sm:gap-3`}>
            <Cookie className={`h-6 w-6 sm:h-8 sm:w-8 ${homeThemeColors.icons.primary}`} />
            <span>Cookie Policy</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[calc(90vh-100px)]">
          <div className="px-4 sm:px-6 pb-6 space-y-4 sm:space-y-6">
            {/* Meta Information */}
            <div className={`flex flex-wrap gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r ${homeThemeColors.gradients.card} rounded-lg border ${homeThemeColors.borders.primary}`}>
              <Badge variant="outline" className={`flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm ${homeThemeColors.components.badge.outline}`}>
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span><strong>Effective:</strong> 19 August 2025</span>
              </Badge>
              <Badge variant="outline" className={`flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm ${homeThemeColors.components.badge.outline}`}>
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span><strong>Company:</strong> SwipeScout Ltd, UK</span>
              </Badge>
            </div>

            {/* Section 1 */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Cookie className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.primary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>
                  1. What Are Cookies?
                </h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} text-sm sm:text-base`}>
                Cookies are small files stored on your device that help us improve your experience. 
                Similar technologies (such as SDKs in apps, pixels, and local storage) are also 
                covered in this policy.
              </p>
            </section>

            {/* Section 2 */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Settings className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.secondary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>
                  2. How We Use Cookies
                </h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} mb-3 text-sm sm:text-base`}>
                SwipeScout uses cookies and similar tools to:
              </p>
              <ul className={`space-y-2 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                  <span><strong className={homeThemeColors.text.primary}>Essential cookies</strong> – keep you logged in, enable swipe and video functions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                  <span><strong className={homeThemeColors.text.primary}>Performance cookies</strong> – understand how users interact with the app (analytics, crash reports).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                  <span><strong className={homeThemeColors.text.primary}>Functionality cookies</strong> – remember preferences and settings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                  <span><strong className={homeThemeColors.text.primary}>Advertising cookies (future use)</strong> – show relevant jobs or promotions (only if you consent).</span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Users className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.accent} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>
                  3. Third-Party Cookies
                </h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} text-sm sm:text-base`}>
                We may use trusted providers (e.g., analytics, cloud hosting, security tools) that 
                place cookies on your device. These providers must follow data protection laws.
              </p>
            </section>

            {/* Section 4 */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Settings className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.primary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>
                  4. Managing Cookies
                </h3>
              </div>
              <ul className={`space-y-2 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                  <span><strong className={homeThemeColors.text.primary}>On web:</strong> you can manage cookies through your browser settings (accept, block, or delete).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                  <span><strong className={homeThemeColors.text.primary}>On mobile app:</strong> you can manage permissions in device settings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                  <span>Some cookies are essential and cannot be disabled if you want to use SwipeScout.</span>
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Shield className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.secondary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>
                  5. Consent
                </h3>
              </div>
              <ul className={`space-y-2 ${homeThemeColors.text.secondary} text-sm sm:text-base`}>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                  <span>When you first visit SwipeScout, you will see a banner asking for cookie consent.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                  <span>By clicking "Accept", you agree to our use of cookies as described here.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${homeThemeColors.icons.primary} mt-1`}>•</span>
                  <span>You can withdraw consent at any time by updating your settings.</span>
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className={`${homeThemeColors.backgrounds.card} p-4 sm:p-6 rounded-lg ${homeThemeColors.borders.default} border ${homeThemeColors.shadows.sm}`}>
              <div className="flex items-start gap-3 mb-3">
                <Calendar className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.accent} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>
                  6. Updates
                </h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} text-sm sm:text-base`}>
                We may update this Cookie Policy if we add new features or services. If changes are 
                significant, we will notify you.
              </p>
            </section>

            {/* Section 7 - Contact */}
            <section className={`bg-gradient-to-r ${homeThemeColors.gradients.card} p-4 sm:p-6 rounded-lg border ${homeThemeColors.borders.primary} ${homeThemeColors.shadows.md}`}>
              <div className="flex items-start gap-3 mb-3">
                <Building2 className={`h-5 w-5 sm:h-6 sm:w-6 ${homeThemeColors.icons.primary} flex-shrink-0 mt-1`} />
                <h3 className={`${homeThemeColors.components.section.heading} text-base sm:text-lg`}>
                  7. Contact Us
                </h3>
              </div>
              <p className={`${homeThemeColors.components.section.text} mb-3 text-sm sm:text-base`}>
                For questions about this Cookie Policy, contact us at:
              </p>
              <div className={`${homeThemeColors.backgrounds.card} p-3 sm:p-4 rounded-lg space-y-1 text-sm sm:text-base`}>
                <p className={`font-semibold ${homeThemeColors.text.primary}`}>SwipeScout Ltd</p>
                <p className={homeThemeColors.text.secondary}>London, United Kingdom</p>
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

export default CookiePolicy;
