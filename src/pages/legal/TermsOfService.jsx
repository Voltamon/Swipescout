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

const TermsOfService = () => {
  const { t } = useTranslation('legal');

  const handleDownloadPDF = () => {
    window.open('/legal/terms-of-service.pdf', '_blank');
  };

  const sections = [
    { id: 'agreementToTerms', title: t("legal.termsOfService.agreementToTerms.title"), content: <p>{t("legal.termsOfService.agreementToTerms.content")}</p> },
    {
      id: 'descriptionOfService',
      title: t("legal.termsOfService.descriptionOfService.title"),
      content: (
        <>
          <p>{t("legal.termsOfService.descriptionOfService.content")}</p>
          <ul className="list-disc list-inside space-y-2">
            <ListItem>{t("legal.termsOfService.descriptionOfService.features.videoResume")}</ListItem>
            <ListItem>{t("legal.termsOfService.descriptionOfService.features.companyVideoProfiles")}</ListItem>
            <ListItem>{t("legal.termsOfService.descriptionOfService.features.matchingCommunication")}</ListItem>
            <ListItem>{t("legal.termsOfService.descriptionOfService.features.analyticsInsights")}</ListItem>
            <ListItem>{t("legal.termsOfService.descriptionOfService.features.premiumFeatures")}</ListItem>
          </ul>
        </>
      )
    },
    {
      id: 'userAccounts',
      title: t("legal.termsOfService.userAccounts.title"),
      content: (
        <>
          <p>{t("legal.termsOfService.userAccounts.content")}</p>
          <ul className="list-disc list-inside space-y-2">
            <ListItem>{t("legal.termsOfService.userAccounts.points.accurateInfo")}</ListItem>
            <ListItem>{t("legal.termsOfService.userAccounts.points.updateInfo")}</ListItem>
            <ListItem>{t("legal.termsOfService.userAccounts.points.secureCredentials")}</ListItem>
            <ListItem>{t("legal.termsOfService.userAccounts.points.responsibleForActivities")}</ListItem>
            <ListItem>{t("legal.termsOfService.userAccounts.points.notifyUnauthorizedUse")}</ListItem>
          </ul>
        </>
      )
    },
    {
      id: 'userContent',
      title: t("legal.termsOfService.userContent.title"),
      content: (
        <>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t("legal.termsOfService.userContent.contentGuidelines.title")}</h3>
          <p>{t("legal.termsOfService.userContent.contentGuidelines.content")}</p>
          <ul className="list-disc list-inside space-y-2">
            <ListItem>{t("legal.termsOfService.userContent.contentGuidelines.points.accurateTruthful")}</ListItem>
            <ListItem>{t("legal.termsOfService.userContent.contentGuidelines.points.noViolations")}</ListItem>
            <ListItem>{t("legal.termsOfService.userContent.contentGuidelines.points.noInfringement")}</ListItem>
            <ListItem>{t("legal.termsOfService.userContent.contentGuidelines.points.noInappropriate")}</ListItem>
            <ListItem>{t("legal.termsOfService.userContent.contentGuidelines.points.relevantToRecruitment")}</ListItem>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">{t("legal.termsOfService.userContent.prohibitedActivities.title")}</h3>
          <ul className="list-disc list-inside space-y-2">
            <ListItem>{t("legal.termsOfService.userContent.prohibitedActivities.points.harassment")}</ListItem>
            <ListItem>{t("legal.termsOfService.userContent.prohibitedActivities.points.impersonation")}</ListItem>
            <ListItem>{t("legal.termsOfService.userContent.prohibitedActivities.points.spamming")}</ListItem>
            <ListItem>{t("legal.termsOfService.userContent.prohibitedActivities.points.dataScraping")}</ListItem>
            <ListItem>{t("legal.termsOfService.userContent.prohibitedActivities.points.disruptiveActivity")}</ListItem>
          </ul>
        </>
      )
    },
    {
      id: 'intellectualProperty',
      title: t("legal.termsOfService.intellectualProperty.title"),
      content: (
        <>
          <p>{t("legal.termsOfService.intellectualProperty.content1")}</p>
          <p>{t("legal.termsOfService.intellectualProperty.content2")}</p>
        </>
      )
    },
    {
      id: 'subscriptionPayments',
      title: t("legal.termsOfService.subscriptionPayments.title"),
      content: (
        <>
          <p>{t("legal.termsOfService.subscriptionPayments.content1")}</p>
          <ul className="list-disc list-inside space-y-2">
            <ListItem>{t("legal.termsOfService.subscriptionPayments.points.payFees")}</ListItem>
            <ListItem>{t("legal.termsOfService.subscriptionPayments.points.accurateBilling")}</ListItem>
            <ListItem>{t("legal.termsOfService.subscriptionPayments.points.authorizeCharge")}</ListItem>
          </ul>
          <p>{t("legal.termsOfService.subscriptionPayments.content2")}</p>
        </>
      )
    },
    {
      id: 'termination',
      title: t("legal.termsOfService.termination.title"),
      content: (
        <>
          <p>{t("legal.termsOfService.termination.content1")}</p>
          <p>{t("legal.termsOfService.termination.content2")}</p>
        </>
      )
    },
    {
      id: 'disclaimer',
      title: t("legal.termsOfService.disclaimer.title"),
      content: (
        <>
          <p>{t("legal.termsOfService.disclaimer.content1")}</p>
          <ul className="list-disc list-inside space-y-2">
            <ListItem>{t("legal.termsOfService.disclaimer.points.requirements")}</ListItem>
            <ListItem>{t("legal.termsOfService.disclaimer.points.uninterrupted")}</ListItem>
            <ListItem>{t("legal.termsOfService.disclaimer.points.accurateReliable")}</ListItem>
          </ul>
          <p>{t("legal.termsOfService.disclaimer.content2")}</p>
        </>
      )
    },
    {
      id: 'governingLaw',
      title: t("legal.termsOfService.governingLaw.title"),
      content: (
        <>
          <p>{t("legal.termsOfService.governingLaw.content1")}</p>
          <p>{t("legal.termsOfService.governingLaw.content2")}</p>
        </>
      )
    },
    {
      id: 'changesToTerms',
      title: t("legal.termsOfService.changesToTerms.title"),
      content: (
        <>
          <p>{t("legal.termsOfService.changesToTerms.content1")}</p>
          <p>{t("legal.termsOfService.changesToTerms.content2")}</p>
        </>
      )
    },
    {
      id: 'contactInformation',
      title: t("legal.termsOfService.contactInformation.title"),
      content: (
        <>
          <p>{t("legal.termsOfService.contactInformation.content")}</p>
          <p>{t("legal.termsOfService.contactInformation.email")}</p>
          <p>{t("legal.termsOfService.contactInformation.address")}</p>
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
              {t("legal.termsOfService.title")}
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

export default TermsOfService;