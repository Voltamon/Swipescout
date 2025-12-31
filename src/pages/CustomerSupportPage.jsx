import i18n from 'i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, LifeBuoy, MessageSquare } from 'lucide-react';
import Header from "../components/Headers/Header";
import Footer from "../components/Headers/Footer";
import { homeThemeColors } from '../config/theme-colors-home';

// Custom Discord icon as an inline SVG
const DiscordIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-16 h-16"
      aria-hidden="true"
    >
      <path d="M21.17,1.83a2.38,2.38,0,0,0-1.28-.79C17.75,0,14.63,0,11.5,0A22.82,22.82,0,0,0,1.72,1.15a2.37,2.37,0,0,0-1.28.79A2.37,2.37,0,0,0,0,2.94,22.39,22.39,0,0,0,1.3,16.27,2.37,2.37,0,0,0,2,17.43a2.38,2.38,0,0,0,1.28.79A22.82,22.82,0,0,0,11.5,19.34a22.82,22.82,0,0,0,8.22-1.12,2.38,2.38,0,0,0,1.28-.79,2.37,2.37,0,0,0,.72-1.16,22.39,22.39,0,0,0,1.3-13.33A2.37,2.37,0,0,0,21.17,1.83Zm-1.84,14.4a.79.79,0,0,1-.46.33,18.73,18.73,0,0,1-7.37,1,18.73,18.73,0,0,1-7.37-1,.79.79,0,0,1-.46-.33,18.84,18.84,0,0,1-.7-3.95A19.46,19.46,0,0,1,2.83,6.23a.79.79,0,0,1,.46-.33A18.73,18.73,0,0,1,11.5,5a18.73,18.73,0,0,1,7.37,1,.79.79,0,0,1,.46.33A19.46,19.46,0,0,1,20.08,12.3Z" />
      <path d="M12.91,12.35a2.4,2.4,0,0,1-1.39.46,2.4,2.4,0,0,1-1.39-.46,2.16,2.16,0,0,1-.39-.56,3.87,3.87,0,0,1-.13-.7,4.3,4.3,0,0,1,.13-.7,2.16,2.16,0,0,1,.39-.56A2.4,2.4,0,0,1,11.5,9.45a2.4,2.4,0,0,1,1.39.46,2.16,2.16,0,0,1,.39.56,3.87,3.87,0,0,1,.13.7,4.3,4.3,0,0,1-.13.7,2.16,2.16,0,0,1-.39.56Z" />
      <path d="M16.14,12.35a2.4,2.4,0,0,1-1.39.46,2.4,2.4,0,0,1-1.39-.46,2.16,2.16,0,0,1-.39-.56,3.87,3.87,0,0,1-.13-.7,4.3,4.3,0,0,1,.13-.7,2.16,2.16,0,0,1,.39-.56,2.4,2.4,0,0,1,1.39-.46,2.4,2.4,0,0,1,1.39.46,2.16,2.16,0,0,1,.39.56,3.87,3.87,0,0,1,.13.7,4.3,4.3,0,0,1-.13.7,2.16,2.16,0,0,1-.39.56Z" />
      <path d="M11.5,14.61a.7.7,0,0,1-.41-.12,5.77,5.77,0,0,1-1.5-.7,4.2,4.2,0,0,1-.7-.84.79.79,0,0,1,.16-.83.77.77,0,0,1,.71-.16.7.7,0,0,1,.41.12,4.55,4.55,0,0,0,1.07.56A4.55,4.55,0,0,0,12.5,12.9a.7.7,0,0,1,.41-.12.77.77,0,0,1,.71.16.79.79,0,0,1,.16.83,4.2,4.2,0,0,1-.7.84,5.77,5.77,0,0,1-1.5.7A.7.7,0,0,1,11.5,14.61Z" />
    </svg>
  );

export default function CustomerSupportPage() {
  const navigate = useNavigate();
  const discordLink = "https://discord.gg/mHcdMn6yMh";

  const supportOptions = [
    {
      icon: <LifeBuoy className="w-16 h-16 text-blue-500 mb-4" />,
      title: "Knowledge Base & FAQ",
      description: "Find instant answers to common questions in our extensive knowledge base.",
      action: () => navigate('/FAQs'),
      actionText: "Go to FAQ",
      buttonClass: `${homeThemeColors.primaryButton} bg-blue-500 hover:bg-blue-600`,
    },
    {
      icon: <div className="text-indigo-500 mb-4"><DiscordIcon /></div>,
      title: "Join Our Discord Community",
      description: "Connect with us and the community for real-time support.",
      action: discordLink,
      actionText: "Join Discord",
      buttonClass: `${homeThemeColors.primaryButton} bg-indigo-500 hover:bg-indigo-600`,
    },
    {
      icon: <Mail className="w-16 h-16 text-blue-500 mb-4" />,
      title: "Email Support",
      description: "For non-urgent issues, you can email us and we will respond within 24 hours.",
      action: "mailto:info@swipescout.xyz",
      actionText: "info@swipescout.xyz",
      isLink: true,
      linkClass: `font-bold text-blue-500 hover:underline`,
    },
  ];

  return (
    <div className={`${homeThemeColors.background} ${homeThemeColors.text}`}>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className={`text-4xl sm:text-5xl font-extrabold mb-4 ${homeThemeColors.titleText}`}>{i18n.t('auto_customer_support')}</h1>
          <p className={`max-w-3xl mx-auto text-lg sm:text-xl ${homeThemeColors.secondaryText}`}>
            Need help? Our team is here to provide you with the best support. Find the answers you need or connect with us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {supportOptions.map((option, index) => (
            <div key={index} className={`rounded-2xl p-8 flex flex-col items-center text-center transition-transform duration-300 ease-in-out hover:-translate-y-2 ${homeThemeColors.cardBackground} shadow-lg hover:shadow-2xl`}>
              {option.icon}
              <h2 className={`text-2xl font-bold mb-3 ${homeThemeColors.cardTitleText}`}>
                {option.title}
              </h2>
              <p className={`mb-6 ${homeThemeColors.cardSecondaryText}`}>
                {option.description}
              </p>
              <div className="mt-auto">
                {option.isLink ? (
                  <a href={option.action} className={option.linkClass}>
                    {option.actionText}
                  </a>
                ) : (
                  <button
                    onClick={typeof option.action === 'function' ? option.action : () => window.open(option.action, '_blank', 'noopener noreferrer')}
                    className={option.buttonClass}
                  >
                    {option.actionText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
