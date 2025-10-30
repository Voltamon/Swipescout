import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en";
import ar from "./locales/ar";
import zh from "./locales/zh";

const resources = {
  en,
  ar,
  zh
};

const namespaces = Object.keys(en);

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  supportedLngs: Object.keys(resources),
  fallbackLng: "en",
  ns: namespaces,
  defaultNS: namespaces.includes("common") ? "common" : namespaces[0],
  debug: process.env.NODE_ENV === "development",

  interpolation: {
    escapeValue: false // not needed for react as it escapes by default
  },

  detection: {
    order: ["localStorage", "navigator", "htmlTag"],
    caches: ["localStorage"]
  },

  react: {
    useSuspense: false
  }
});

export default i18n;
