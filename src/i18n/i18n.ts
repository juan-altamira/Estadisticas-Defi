import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import es from './locales/es/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
    },
    lng: 'en', // Idioma por defecto
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React ya se encarga de la protección contra XSS
    },
  });

export default i18n;
