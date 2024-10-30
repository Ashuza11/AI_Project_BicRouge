import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslations from './locales/en/translation.json';
import frTranslations from './locales/fr/translation.json';

const savedLanguage = localStorage.getItem('language') || 'fr'; 

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      fr: {
        translation: frTranslations
      },
      // Add more languages here
    },
    lng: savedLanguage, // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
