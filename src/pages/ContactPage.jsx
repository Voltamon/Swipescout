import React from "react";
import { Mail, MessageSquare } from "lucide-react";
import { useTranslation } from 'react-i18next';
import Header from "../components/Headers/Header";
import Footer from "../components/Headers/Footer";
import { homeThemeColors } from "../config/theme-colors-home";

const ContactPage = () => {
  const { t } = useTranslation('contact');
  const discordLink = "https://discord.gg/mHcdMn6yMh";

  const contactOptions = [
    {
      icon: Mail,
      title: t('email.title'),
      description: t('email.description'),
      link: "mailto:info@swipescout.xyz",
      linkText: "info@swipescout.xyz",
      buttonClass: `bg-gradient-to-r ${homeThemeColors.gradients.button} hover:${homeThemeColors.gradients.buttonHover} text-white`,
    },
    {
      icon: MessageSquare,
      title: t('discord.title'),
      description: t('discord.description'),
      link: discordLink,
      linkText: t('discord.button'),
      buttonClass: `bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white`,
    },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${homeThemeColors.backgrounds.page}`}>
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className={`text-4xl sm:text-5xl font-extrabold mb-4 ${homeThemeColors.text.gradient}`}>
              {t('title')}
            </h1>
            <p className={`text-lg ${homeThemeColors.text.secondary} max-w-2xl mx-auto`}>
              {t('description')}
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div
                  key={index}
                  className={`rounded-xl shadow-lg p-8 flex flex-col items-center text-center transition-transform duration-300 transform hover:-translate-y-2 ${homeThemeColors.backgrounds.card} border ${homeThemeColors.borders.primary}`}
                >
                  <div className={`p-4 rounded-full mb-6 bg-gradient-to-r ${homeThemeColors.gradients.badge}`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h2 className={`text-2xl font-bold mb-3 ${homeThemeColors.text.primary}`}>
                    {option.title}
                  </h2>
                  <p className={`mb-6 ${homeThemeColors.text.muted}`}>
                    {option.description}
                  </p>
                  <a
                    href={option.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 px-6 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 ${option.buttonClass}`}
                  >
                    {option.linkText}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
