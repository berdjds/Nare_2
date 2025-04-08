"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '@/lib/translations';

type Language = {
  code: string;
  name: string;
  nativeName: string;
};

type LanguageContextType = {
  currentLanguage: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
  languages: Language[];
  isLoaded: boolean;
};

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
];

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  languages: languages,
  isLoaded: false,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initLanguage = () => {
      try {
        const storedLang = localStorage.getItem('language');
        const browserLang = navigator.language.toLowerCase();
        
        if (storedLang) {
          const { state } = JSON.parse(storedLang);
          setCurrentLanguage(state.currentLanguage);
        } else if (browserLang.includes('hy')) {
          setCurrentLanguage('hy');
        } else if (browserLang.includes('ru')) {
          setCurrentLanguage('ru');
        } else {
          setCurrentLanguage('en');
        }
      } catch (error) {
        console.error('Error initializing language:', error);
        setCurrentLanguage('en');
      } finally {
        setIsLoaded(true);
      }
    };

    initLanguage();
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = translations[currentLanguage as keyof typeof translations];
    
    for (const k of keys) {
      if (current[k] === undefined) {
        return key;
      }
      current = current[k];
    }
    
    return current;
  };

  const value = {
    currentLanguage,
    setLanguage: setCurrentLanguage,
    t,
    languages,
    isLoaded,
  };

  return (
    <LanguageContext.Provider value={value}>
      {isLoaded ? children : null}
    </LanguageContext.Provider>
  );
}