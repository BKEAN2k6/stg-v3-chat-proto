import {
  useState,
  useEffect,
  type ReactNode,
  useContext,
  createContext,
  useMemo,
  useCallback,
} from 'react';
import {I18nProvider} from '@lingui/react';
import {i18n} from '@lingui/core';
import {
  defaultLanguage,
  dynamicActivate,
  languages,
  type LanguageCode,
} from '../i18n';

type LanguageContextType = {
  currentLanguage: LanguageCode;
  changeLanguage: (language: LanguageCode) => void;
};

type LanguageProviderProps = {
  readonly children: ReactNode;
};

const getInitialLanguage = (): LanguageCode => {
  const storedLanguage = localStorage.getItem('language');
  if (storedLanguage && Object.keys(languages).includes(storedLanguage)) {
    return storedLanguage as LanguageCode;
  }

  const browserLanguage = navigator.language.split('-')[0] as LanguageCode;
  if (Object.keys(languages).includes(browserLanguage)) {
    return browserLanguage;
  }

  return defaultLanguage;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({children}: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    void dynamicActivate(currentLanguage).then(() => {
      localStorage.setItem('language', currentLanguage);
    });
  }, [currentLanguage]);

  const changeLanguage = useCallback((language: LanguageCode) => {
    setCurrentLanguage(language);
  }, []);

  const value = useMemo(
    () => ({currentLanguage, changeLanguage}),
    [currentLanguage, changeLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};
