import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Headers/Header';
import Footer from '../../components/Headers/Footer';
import { Download, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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

const PrivacyPolicy = () => {
  const { t } = useTranslation('legal');

  const handleDownloadPDF = () => {
    // In a real app, this would download the actual PDF
    window.open('/legal/privacy-policy.pdf', '_blank');
  };

  const sections = [
    { id: 'introduction', title: t('privacyPolicy.introduction.title'), content: <p>{t('privacyPolicy.introduction.content')}</p> },
    {
      id: 'informationWeCollect',
      title: t('privacyPolicy.informationWeCollect.title'),
      content: (
        <>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('privacyPolicy.informationWeCollect.personalInfo.title')}</h3>
          <ul className="list-disc list-inside space-y-2">
            <ListItem>{t('privacyPolicy.informationWeCollect.personalInfo.accountInfo')}</ListItem>
            <ListItem>{t('privacyPolicy.informationWeCollect.personalInfo.professionalInfo')}</ListItem>
            <ListItem>{t('privacyPolicy.informationWeCollect.personalInfo.videoContent')}</ListItem>
            <ListItem>{t('privacyPolicy.informationWeCollect.personalInfo.communicationData')}</ListItem>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('privacyPolicy.informationWeCollect.automaticInfoTitle')}</h3>
          <ul className="list-disc list-inside space-y-2">
            <ListItem>{t('privacyPolicy.informationWeCollect.usageData')}</ListItem>
            <ListItem>{t('privacyPolicy.informationWeCollect.deviceInfo')}</ListItem>
            <ListItem>{t('privacyPolicy.informationWeCollect.analyticsData')}</ListItem>
          </ul>
        </>
      )
    },
    {
      id: 'howWeUseInfo',
      title: t('privacyPolicy.howWeUseInfo.title'),
      content: (
        <ul className="list-disc list-inside space-y-2">
          <ListItem>{t('privacyPolicy.howWeUseInfo.provideService')}</ListItem>
          <ListItem>{t('privacyPolicy.howWeUseInfo.matchJobs')}</ListItem>
          <ListItem>{t('privacyPolicy.howWeUseInfo.enableCommunication')}</ListItem>
          <ListItem>{t('privacyPolicy.howWeUseInfo.improvePlatform')}</ListItem>
          <ListItem>{t('privacyPolicy.howWeUseInfo.sendUpdates')}</ListItem>
          <ListItem>{t('privacyPolicy.howWeUseInfo.ensureSecurity')}</ListItem>
        </ul>
      )
    },
    {
      id: 'sharingDisclosure',
      title: t('privacyPolicy.sharingDisclosure.title'),
      content: (
        <>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('privacyPolicy.sharingDisclosure.withUsers')}</h3>
          <p>{t('privacyPolicy.sharingDisclosure.withUsersContent')}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('privacyPolicy.sharingDisclosure.withProviders')}</h3>
          <p>{t('privacyPolicy.sharingDisclosure.withProvidersContent')}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('privacyPolicy.sharingDisclosure.legalRequirements')}</h3>
          <p>{t('privacyPolicy.sharingDisclosure.legalRequirementsContent')}</p>
        </>
      )
    },
    { id: 'dataSecurity', title: t('privacyPolicy.dataSecurity.title'), content: <p>{t('privacyPolicy.dataSecurity.content')}</p> },
    {
      id: 'yourRights',
      title: t('privacyPolicy.yourRights.title'),
      content: (
        <ul className="list-disc list-inside space-y-2">
          <ListItem>{t('privacyPolicy.yourRights.access')}</ListItem>
          <ListItem>{t('privacyPolicy.yourRights.correction')}</ListItem>
          <ListItem>{t('privacyPolicy.yourRights.deletion')}</ListItem>
          <ListItem>{t('privacyPolicy.yourRights.portability')}</ListItem>
          <ListItem>{t('privacyPolicy.yourRights.optOut')}</ListItem>
        </ul>
      )
    },
    { id: 'cookies', title: t('privacyPolicy.cookies.title'), content: <p>{t('privacyPolicy.cookies.content')}</p> },
    { id: 'internationalTransfers', title: t('privacyPolicy.internationalTransfers.title'), content: <p>{t('privacyPolicy.internationalTransfers.content')}</p> },
    { id: 'childrenPrivacy', title: t('privacyPolicy.childrenPrivacy.title'), content: <p>{t('privacyPolicy.childrenPrivacy.content')}</p> },
    { id: 'changes', title: t('privacyPolicy.changes.title'), content: <p>{t('privacyPolicy.changes.content')}</p> },
    {
      id: 'contactUs',
      title: t('privacyPolicy.contactUs.title'),
      content: (
        <>
          <p>{t('privacyPolicy.contactUs.content')}</p>
          <p>{t('privacyPolicy.contactUs.email')}</p>
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
            {t('backToHome')}
          </Link>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
            <h1 className={`text-4xl sm:text-5xl font-extrabold ${homeThemeColors.text.gradient}`}>
              {t('privacyPolicy.title')}
            </h1>
            <button
              onClick={handleDownloadPDF}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="w-5 h-5 mr-2" />
              {t('downloadPDF')}
            </button>
          </div>
          <p className={`${homeThemeColors.text.secondary}`}>
            {t('lastUpdated')}: January 20, 2024
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

export default PrivacyPolicy;



