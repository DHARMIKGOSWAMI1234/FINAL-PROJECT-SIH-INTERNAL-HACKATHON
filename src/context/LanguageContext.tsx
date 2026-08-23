import React, { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageCode } from '../types';
import { StorageService } from '../services/storage';

interface LanguageContextType {
  language: LanguageCode;
  changeLanguage: (lang: LanguageCode) => void;
  availableLanguages: { code: LanguageCode; name: string; nativeName: string; flag: string }[];
}

const LANGUAGES: { code: LanguageCode; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<LanguageCode>(
    (i18n.language as LanguageCode) || 'en'
  );

  const changeLanguage = (lang: LanguageCode) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    StorageService.savePreferences({ language: lang });
    localStorage.setItem('fertilizer_ai_lang', lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        availableLanguages: LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
