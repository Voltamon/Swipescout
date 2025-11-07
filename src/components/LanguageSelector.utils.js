export const languages = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    dir: 'ltr'
  }
];

import React from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguageSetup = () => {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    // Set initial language from localStorage or browser
    const savedLanguage = localStorage.getItem('preferred-language');
    const browserLanguage = navigator.language.split('-')[0];

    const supportedLanguages = languages.map(lang => lang.code);
    const initialLanguage = savedLanguage ||
      (supportedLanguages.includes(browserLanguage) ? browserLanguage : 'en');

    if (i18n.language !== initialLanguage) {
      i18n.changeLanguage(initialLanguage);
    }

    // Set document direction
    const selectedLang = languages.find(lang => lang.code === initialLanguage);
    if (selectedLang) {
      document.documentElement.dir = selectedLang.dir;
      document.documentElement.lang = initialLanguage;
    }
  }, [i18n]);

  return { currentLanguage: i18n.language };
};
