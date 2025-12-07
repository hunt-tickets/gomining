/**
 * Language Context
 * Manages language preferences with persistence
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MMKV } from 'react-native-mmkv';
import {
  SUPPORTED_LANGUAGES,
  isRTL,
  type SupportedLanguage,
} from '@/i18n';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

interface LanguageContextType {
  language: SupportedLanguage;
  isRTL: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

// ═══════════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════════

const storage = new MMKV({ id: 'language-storage' });
const LANGUAGE_KEY = 'app-language';

// ═══════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ═══════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) || 'en'
  );

  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = storage.getString(LANGUAGE_KEY);
    if (savedLanguage && SUPPORTED_LANGUAGES.some(l => l.code === savedLanguage)) {
      const lang = savedLanguage as SupportedLanguage;
      i18n.changeLanguage(lang);
      setLanguageState(lang);

      // Update RTL if needed
      const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === lang);
      if (langInfo?.rtl !== I18nManager.isRTL) {
        I18nManager.allowRTL(langInfo?.rtl ?? false);
        I18nManager.forceRTL(langInfo?.rtl ?? false);
      }
    }
  }, [i18n]);

  // Change language handler
  const setLanguage = useCallback((lang: SupportedLanguage) => {
    // Save to storage
    storage.set(LANGUAGE_KEY, lang);

    // Update i18n
    i18n.changeLanguage(lang);

    // Update state
    setLanguageState(lang);

    // Handle RTL changes
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    if (langInfo?.rtl !== I18nManager.isRTL) {
      I18nManager.allowRTL(langInfo?.rtl ?? false);
      I18nManager.forceRTL(langInfo?.rtl ?? false);
      // Note: RTL changes require app restart to take full effect
    }
  }, [i18n]);

  const value: LanguageContextType = {
    language,
    isRTL: isRTL(),
    setLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
