/**
 * i18n Configuration
 * Initializes i18next with all supported languages
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { en, es, fr, de, pt, zh, tr, ar } from './locales';

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', rtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]['code'];

// Get device language, falling back to English
const getDeviceLanguage = (): SupportedLanguage => {
  const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';

  // Check if device language is supported
  const supported = SUPPORTED_LANGUAGES.find(
    lang => lang.code === deviceLocale || deviceLocale.startsWith(lang.code)
  );

  return supported?.code || 'en';
};

// Resources object with all translations
const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  pt: { translation: pt },
  zh: { translation: zh },
  tr: { translation: tr },
  ar: { translation: ar },
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // React already escapes
    },

    // Plural handling
    pluralSeparator: '_',

    // Key options
    keySeparator: '.',
    nsSeparator: ':',

    // React options
    react: {
      useSuspense: false,
    },

    // Compatibility
    compatibilityJSON: 'v4',
  });

export default i18n;

// Export helper to check if current language is RTL
export const isRTL = (): boolean => {
  const currentLang = i18n.language as SupportedLanguage;
  return SUPPORTED_LANGUAGES.find(l => l.code === currentLang)?.rtl ?? false;
};

// Export function to get language info
export const getLanguageInfo = (code: SupportedLanguage) => {
  return SUPPORTED_LANGUAGES.find(l => l.code === code);
};
