import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { homeThemeColors } from "../../config/theme-colors-home";

const Footer = () => {
  const { t } = useTranslation('footer');
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: t('aboutUs'), href: '/about' },
      { label: t('howItWorks'), href: '/how-it-works' },
      { label: t('blog'), href: '/blog' },
      { label: t('faq'), href: '/FAQs' },
      { label: t('contactUs'), href: '/contact' },
      { label: t('customerSupport'), href: '/customer-support' },
      { label: 'Download App', href: '/stores' },
      { label: t('credits'), href: '/credits' },
    ],
    legal: [
      { label: t('privacyPolicy'), href: '/privacy-policy' },
      { label: t('termsOfService'), href: '/terms-of-service' },
      { label: t('cookiePolicy'), href: '/cookie-policy' },
      { label: t('communityGuidelines'), href: '/community-guidelines' },
      { label: t('copyrightIpTerms'), href: '/copyright-ip-terms' },
      { label: t('eula'), href: '/eula' },
    ]
  };

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
  ];

  const stats = [
    { icon: CheckCircle, label: t('verifiedCompanies') },
    { icon: TrendingUp, label: t('successRate') },
    { icon: Users, label: t('support24_7') },
  ];

  return (
    <footer className={`${homeThemeColors.backgrounds.card} border-t ${homeThemeColors.borders.default}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Column */}
          <div>
            <h3 className={`text-lg font-bold mb-6 text-indigo-600 dark:text-indigo-400`}>
              {t('company')}
            </h3>
            <nav className="space-y-3">
              {footerLinks.company.map((link) => (
                <RouterLink
                  key={link.href}
                  to={link.href}
                  className={`block text-sm font-medium ${homeThemeColors.text.link} transition-colors duration-200`}
                >
                  {link.label}
                </RouterLink>
              ))}
            </nav>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className={`text-lg font-bold mb-6 text-indigo-600 dark:text-indigo-400`}>
              {t('legal')}
            </h3>
            <nav className="space-y-3">
              {footerLinks.legal.map((link) => (
                <RouterLink
                  key={link.href}
                  to={link.href}
                  className={`block text-sm font-medium ${homeThemeColors.text.link} transition-colors duration-200`}
                >
                  {link.label}
                </RouterLink>
              ))}
            </nav>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className={`text-lg font-bold mb-6 text-indigo-600 dark:text-indigo-400`}>
              {t('connect')}
            </h3>
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transform hover:scale-110 transition-all duration-200"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('joinCommunity')}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t ${homeThemeColors.borders.light} my-8`}></div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Icon size={18} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span>{stat.label}</span>
              </div>
            );
          })}
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>{t('copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;