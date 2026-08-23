import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './translations/en';
import { hi } from './translations/hi';
import { gu } from './translations/gu';
import { validateTranslations } from '../utils/validateTranslations';

// Validate translation structure in development
validateTranslations();

const savedLanguage = localStorage.getItem('fertilizer_ai_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      gu: { translation: gu },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React handles XSS
    },
  });

export default i18n;
