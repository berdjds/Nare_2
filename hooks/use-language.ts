"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { languages, translations } from '@/lib/translations';

type TranslationKey = keyof typeof translations.en;
type SupportedLanguages = keyof typeof translations;

type LanguageStore = {
  currentLanguage: SupportedLanguages;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  getCurrentLanguage: () => SupportedLanguages;
};

const getDefaultLanguage = (): SupportedLanguages => {
  if (typeof window === 'undefined') return 'en';
  
  try {
    const browserLang = window.navigator.language.toLowerCase();
    if (browserLang.includes('hy')) return 'hy';
    if (browserLang.includes('ru')) return 'ru';
    return 'en';
  } catch {
    return 'en';
  }
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: getDefaultLanguage(),
      setLanguage: (lang: string) => {
        if (languages.some(l => l.code === lang)) {
          set({ currentLanguage: lang as SupportedLanguages });
        }
      },
      getCurrentLanguage: () => get().currentLanguage,
      t: (key: string) => {
        try {
          const keys = key.split('.');
          let current: any = translations[get().currentLanguage] || translations.en;
          
          for (const k of keys) {
            if (current === undefined || current[k] === undefined) {
              // Fallback to English
              current = translations.en;
              for (const fallbackKey of keys) {
                if (current === undefined || current[fallbackKey] === undefined) {
                  console.warn(`Translation missing for key: ${key}`);
                  return key;
                }
                current = current[fallbackKey];
              }
              break;
            }
            current = current[k];
          }
          
          return current || key;
        } catch (error) {
          console.warn(`Error getting translation for key: ${key}`, error);
          return key;
        }
      },
    }),
    {
      name: 'language-storage',
      skipHydration: true,
    }
  )
);