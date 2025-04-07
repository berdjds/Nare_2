"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';

const LanguageContext = createContext<{
  isLoaded: boolean;
}>({
  isLoaded: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const initLanguage = () => {
      try {
        // Set language based on browser preference or stored value
        const browserLang = window.navigator.language.toLowerCase();
        const storedLang = localStorage.getItem('language-storage');
        
        if (storedLang) {
          const { state } = JSON.parse(storedLang);
          setLanguage(state.currentLanguage);
        } else if (browserLang.includes('hy')) {
          setLanguage('hy');
        } else if (browserLang.includes('ru')) {
          setLanguage('ru');
        } else {
          setLanguage('en');
        }
      } catch (error) {
        console.error('Error initializing language:', error);
        setLanguage('en');
      } finally {
        setIsLoaded(true);
      }
    };

    initLanguage();
  }, [setLanguage]);

  return (
    <LanguageContext.Provider value={{ isLoaded }}>
      {isLoaded ? children : null}
    </LanguageContext.Provider>
  );
}