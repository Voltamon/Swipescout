import i18n from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Headers/Header';
import Footer from '../components/Headers/Footer';
import { homeThemeColors } from '../config/theme-colors-home';

const CreditsPage = () => {
  const { t } = useTranslation('credits');

  return (
    <>
      <Header />
      <div className={`min-h-screen ${homeThemeColors.background} ${homeThemeColors.text}`}>
        <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className={`text-4xl font-bold ${homeThemeColors.titleText} mb-8 text-center`}>
              {t('title', 'Credits')}
            </h1>
            <div className={`p-8 rounded-lg shadow-lg ${homeThemeColors.cardBackground}`}>
              <h2 className={`text-2xl font-semibold ${homeThemeColors.titleText} mb-4`}>
                {t('acknowledgements', 'Acknowledgements')}
              </h2>
              <p className="mb-4">
                {t('intro', 'This project was made possible by the hard work of many individuals and the use of fantastic open-source software. We would like to extend our gratitude to the following:')}
              </p>
              
              <h3 className={`text-xl font-semibold ${homeThemeColors.titleText} mt-6 mb-3`}>
                {t('development_team', 'Development Team')}
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>{t('lead_developer', 'Lead Developer - [Your Name/Team Name]')}</li>
                <li>{t('frontend_developers', 'Frontend Developers')}</li>
                <li>{t('backend_developers', 'Backend Developers')}</li>
                <li>{t('ui_ux_designers', 'UI/UX Designers')}</li>
              </ul>

              <h3 className={`text-xl font-semibold ${homeThemeColors.titleText} mt-6 mb-3`}>
                {t('open_source', 'Open Source Libraries & Frameworks')}
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>{i18n.t('auto_react')}</li>
                <li>{i18n.t('auto_vite')}</li>
                <li>{i18n.t('auto_tailwind_css')}</li>
                <li>shadcn/ui</li>
                <li>{i18n.t('auto_lucide_react')}</li>
                <li>{i18n.t('auto_react_router')}</li>
                <li>{i18n.t('auto_i18next')}</li>
                <li>{i18n.t('auto_and_many_more')}</li>
              </ul>

              <h3 className={`text-xl font-semibold ${homeThemeColors.titleText} mt-6 mb-3`}>
                {t('special_thanks', 'Special Thanks')}
              </h3>
              <p>
                {t('thanks_message', 'A special thank you to the open-source community for creating and maintaining the tools that power modern web development. Your contributions are invaluable.')}
              </p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default CreditsPage;
