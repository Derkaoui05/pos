import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en/translation.json';
import fr from '../locales/fr/translation.json';
import ar from '../locales/ar/translation.json';
import de from '../locales/de/translation.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
  de: { translation: de }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
