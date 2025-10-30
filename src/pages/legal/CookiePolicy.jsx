import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Header from '../../components/Headers/Header';
import Footer from '../../components/Headers/Footer';
import { Download, ArrowLeft } from 'lucide-react';
import { homeThemeColors } from '../../config/theme-colors-home';

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className={`text-2xl font-bold mb-4 ${homeThemeColors.text.primary}`}>
      {title}
    </h2>
    <div className={`space-y-4 ${homeThemeColors.text.secondary}`}>
      {children}
    </div>
  </section>
);

const ListItem = ({ children }) => (
  <li className="flex items-start">
    <span className="mr-2 mt-1">â€¢</span>
    <span>{children}</span>
  </li>
);

const CookiePolicy = () => {
  const { t } = useTranslation();

  const handleDownloadPDF = () => {
    window.open('/legal/cookie-policy.pdf', '_blank');
  };

  const sections = [
    { id: 'whatAreCookies', title: t("legal.cookiePolicy.whatAreCookies.title"), content: <p>{t("legal.cookiePolicy.whatAreCookies.content")}</p> },
    {
      id: 'howWeUseCookies',
      title: t("legal.cookiePolicy.howWeUseCookies.title"),
      content: (
        <>
          <p>{t("legal.cookiePolicy.howWeUseCookies.content")}</p>
          <ul className="list-disc list-inside space-y-2">
            <ListItem>{t("legal.cookiePolicy.howWeUseCookies.points.essential")}</ListItem>
            <ListItem>{t("legal.cookiePolicy.howWeUseCookies.points.performanceAnalytics")}</ListItem>
            <ListItem>{t("legal.cookiePolicy.howWeUseCookies.points.functionality")}</ListItem>
            <ListItem>{t("legal.cookiePolicy.howWeUseCookies.points.advertisingTargeting")}</ListItem>
          </ul>
        </>
      )
    },
    { id: 'thirdPartyCookies', title: t("legal.cookiePolicy.thirdPartyCookies.title"), content: <p>{t("legal.cookiePolicy.thirdPartyCookies.content")}</p> },
    {
      id: 'yourChoices',
      title: t("legal.cookiePolicy.yourChoices.title"),
      content: (
        <>
          <p>{t("legal.cookiePolicy.yourChoices.content")}</p>
          <ul className="list-disc list-inside space-y-2">
            <ListItem>{t("legal.cookiePolicy.yourChoices.points.browserSettings")}</ListItem>
            <ListItem>{t("legal.cookiePolicy.yourChoices.points.cookieConsentTool")}</ListItem>
          </ul>
        </>
      )
    },
    { id: 'changesToPolicy', title: t("legal.cookiePolicy.changesToPolicy.title"), content: <p>{t("legal.cookiePolicy.changesToPolicy.content")}</p> },
    {
      id: 'contactUs',
      title: t("legal.cookiePolicy.contactUs.title"),
      content: (
        <>
          <p>{t("legal.cookiePolicy.contactUs.content")}</p>
          <p>{t("legal.cookiePolicy.contactUs.email")}</p>
        </>
      )
    },
  ];

  return (
    <div className={`${homeThemeColors.backgrounds.page} ${homeThemeColors.text.primary} min-h-screen`}>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-8">
          <Link
            to="/"
            className={`inline-flex items-center mb-4 ${homeThemeColors.text.secondary} hover:text-blue-500 transition-colors`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
            <h1 className={`text-4xl sm:text-5xl font-extrabold ${homeThemeColors.text.gradient}`}>
              {t("legal.cookiePolicy.title")}
            </h1>
            <button
              onClick={handleDownloadPDF}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="w-5 h-5 mr-2" />
              {t("legal.downloadPDF")}
            </button>
          </div>
          <p className={`${homeThemeColors.text.secondary}`}>
            {t("legal.lastUpdated")}: January 20, 2024
          </p>
        </div>

        <div className={`p-6 sm:p-10 rounded-2xl ${homeThemeColors.backgrounds.card} shadow-lg`}>
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              <Section title={section.title}>
                {section.content}
              </Section>
              {index < sections.length - 1 && <hr className={`my-8 ${homeThemeColors.borders.default}`} />}
            </React.Fragment>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;

