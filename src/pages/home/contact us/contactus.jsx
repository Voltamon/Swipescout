import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MessageCircle, Clock } from 'lucide-react';
import { homeThemeColors } from '@/config/theme-colors-home';

const ContactUs = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 sm:max-w-lg md:max-w-2xl">
        <DialogHeader className={`px-4 sm:px-6 pt-6 pb-4 ${homeThemeColors.borders.default} border-b sticky top-0 ${homeThemeColors.backgrounds.dialog} z-10`}>
          <DialogTitle className={`text-xl sm:text-2xl md:text-3xl font-bold ${homeThemeColors.text.gradient} flex items-center gap-2 sm:gap-3`}>
            <Mail className={`h-6 w-6 sm:h-8 sm:w-8 ${homeThemeColors.icons.primary}`} />
            <span>Contact Us</span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 sm:px-6 pb-6 space-y-4 sm:space-y-6">
          {/* Email Contact */}
          <Card className={`border-2 ${homeThemeColors.components.contact.email.border} transition-all duration-300 ${homeThemeColors.shadows.md} hover:${homeThemeColors.shadows.lg}`}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full ${homeThemeColors.components.contact.email.bg} flex items-center justify-center ${homeThemeColors.shadows.md}`}>
                  <Mail className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="flex-1 space-y-2 w-full sm:w-auto">
                  <h3 className={`text-base sm:text-lg font-semibold ${homeThemeColors.text.primary}`}>
                    Email Us
                  </h3>
                  <p className={`text-xs sm:text-sm ${homeThemeColors.text.muted}`}>
                    For general questions or inquiries
                  </p>
                  <a 
                    href="mailto:support@swipescout.xyz" 
                    className={`inline-block ${homeThemeColors.text.link} font-medium transition-colors duration-200 hover:underline text-sm sm:text-base break-all sm:break-normal`}
                  >
                    support@swipescout.xyz
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discord Contact */}
          <Card className={`border-2 ${homeThemeColors.components.contact.discord.border} transition-all duration-300 ${homeThemeColors.shadows.md} hover:${homeThemeColors.shadows.lg}`}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full ${homeThemeColors.components.contact.discord.bg} flex items-center justify-center ${homeThemeColors.shadows.md}`}>
                  <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="flex-1 space-y-2 w-full sm:w-auto">
                  <h3 className={`text-base sm:text-lg font-semibold ${homeThemeColors.text.primary}`}>
                    Join Our Discord
                  </h3>
                  <p className={`text-xs sm:text-sm ${homeThemeColors.text.muted}`}>
                    Connect with us and the community
                  </p>
                  <a 
                    href="https://discord.gg/mHcdMn6yMh" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2 ${homeThemeColors.components.contact.discord.button} text-white font-medium rounded-lg transition-all duration-200 ${homeThemeColors.shadows.md} hover:${homeThemeColors.shadows.lg} w-full sm:w-auto text-sm sm:text-base`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Join Discord Server
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className={`mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r ${homeThemeColors.gradients.card} rounded-lg border ${homeThemeColors.borders.primary}`}>
            <div className="flex items-center justify-center gap-2">
              <Clock className={`h-4 w-4 ${homeThemeColors.icons.primary} flex-shrink-0`} />
              <p className={`text-xs sm:text-sm ${homeThemeColors.text.secondary} text-center`}>
                We typically respond within <span className={`font-semibold ${homeThemeColors.text.link}`}>24 hours</span> during business days
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactUs;
