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
  const { t } = useTranslation();

  const handleDownloadPDF = () => {
    // In a real app, this would download the actual PDF
    window.open('/legal/privacy-policy.pdf', '_blank');
  };

  const sections = [
    { id: 'introduction', title: t('legal.privacyPolicy.introduction.title'), content: <p>{t('legal.privacyPolicy.introduction.content')}</p> },
    {
      id: 'informationWeCollect',
      title: t('legal.privacyPolicy.informationWeCollect.title'),
      content: (
        <>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('legal.privacyPolicy.informationWeCollect.personalInfo.title')}</h3>
          <ul className="list-disc list-inside space-y-2">
            <ListItem>{t('legal.privacyPolicy.informationWeCollect.personalInfo.accountInfo')}</ListItem>
            <ListItem>{t('legal.privacyPolicy.informationWeCollect.personalInfo.professionalInfo')}</ListItem>
            <ListItem>{t('legal.privacyPolicy.informationWeCollect.personalInfo.videoContent')}</ListItem>
            <ListItem>{t('legal.privacyPolicy.informationWeCollect.personalInfo.communicationData')}</ListItem>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('legal.privacyPolicy.informationWeCollect.automaticInfoTitle')}</h3>
          <ul className="list-disc list-inside space-y-2">
            <ListItem>{t('legal.privacyPolicy.informationWeCollect.usageData')}</ListItem>
            <ListItem>{t('legal.privacyPolicy.informationWeCollect.deviceInfo')}</ListItem>
            <ListItem>{t('legal.privacyPolicy.informationWeCollect.analyticsData')}</ListItem>
          </ul>
        </>
      )
    },
    {
      id: 'howWeUseInfo',
      title: t('legal.privacyPolicy.howWeUseInfo.title'),
      content: (
        <ul className="list-disc list-inside space-y-2">
          <ListItem>{t('legal.privacyPolicy.howWeUseInfo.provideService')}</ListItem>
          <ListItem>{t('legal.privacyPolicy.howWeUseInfo.matchJobs')}</ListItem>
          <ListItem>{t('legal.privacyPolicy.howWeUseInfo.enableCommunication')}</ListItem>
          <ListItem>{t('legal.privacyPolicy.howWeUseInfo.improvePlatform')}</ListItem>
          <ListItem>{t('legal.privacyPolicy.howWeUseInfo.sendUpdates')}</ListItem>
          <ListItem>{t('legal.privacyPolicy.howWeUseInfo.ensureSecurity')}</ListItem>
        </ul>
      )
    },
    {
      id: 'sharingDisclosure',
      title: t('legal.privacyPolicy.sharingDisclosure.title'),
      content: (
        <>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('legal.privacyPolicy.sharingDisclosure.withUsers')}</h3>
          <p>{t('legal.privacyPolicy.sharingDisclosure.withUsersContent')}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('legal.privacyPolicy.sharingDisclosure.withProviders')}</h3>
          <p>{t('legal.privacyPolicy.sharingDisclosure.withProvidersContent')}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t('legal.privacyPolicy.sharingDisclosure.legalRequirements')}</h3>
          <p>{t('legal.privacyPolicy.sharingDisclosure.legalRequirementsContent')}</p>
        </>
      )
    },
    { id: 'dataSecurity', title: t('legal.privacyPolicy.dataSecurity.title'), content: <p>{t('legal.privacyPolicy.dataSecurity.content')}</p> },
    {
      id: 'yourRights',
      title: t('legal.privacyPolicy.yourRights.title'),
      content: (
        <ul className="list-disc list-inside space-y-2">
          <ListItem>{t('legal.privacyPolicy.yourRights.access')}</ListItem>
          <ListItem>{t('legal.privacyPolicy.yourRights.correction')}</ListItem>
          <ListItem>{t('legal.privacyPolicy.yourRights.deletion')}</ListItem>
          <ListItem>{t('legal.privacyPolicy.yourRights.portability')}</ListItem>
          <ListItem>{t('legal.privacyPolicy.yourRights.optOut')}</ListItem>
        </ul>
      )
    },
    { id: 'cookies', title: t('legal.privacyPolicy.cookies.title'), content: <p>{t('legal.privacyPolicy.cookies.content')}</p> },
    { id: 'internationalTransfers', title: t('legal.privacyPolicy.internationalTransfers.title'), content: <p>{t('legal.privacyPolicy.internationalTransfers.content')}</p> },
    { id: 'childrenPrivacy', title: t('legal.privacyPolicy.childrenPrivacy.title'), content: <p>{t('legal.privacyPolicy.childrenPrivacy.content')}</p> },
    { id: 'changes', title: t('legal.privacyPolicy.changes.title'), content: <p>{t('legal.privacyPolicy.changes.content')}</p> },
    {
      id: 'contactUs',
      title: t('legal.privacyPolicy.contactUs.title'),
      content: (
        <>
          <p>{t('legal.privacyPolicy.contactUs.content')}</p>
          <p>{t('legal.privacyPolicy.contactUs.email')}</p>
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
            {t('legal.backToHome')}
          </Link>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
            <h1 className={`text-4xl sm:text-5xl font-extrabold ${homeThemeColors.text.gradient}`}>
              {t('legal.privacyPolicy.title')}
            </h1>
            <button
              onClick={handleDownloadPDF}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="w-5 h-5 mr-2" />
              {t('legal.downloadPDF')}
            </button>
          </div>
          <p className={`${homeThemeColors.text.secondary}`}>
            {t('legal.lastUpdated')}: January 20, 2024
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



