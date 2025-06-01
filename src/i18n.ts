import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en/translations.json";
import ruTranslation from "./locales/ru/translations.json";
import roTranslation from "./locales/ro/translations.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: { translation: enTranslation },
      ru: { translation: ruTranslation },
      ro: { translation: roTranslation },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
