"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isRTL as checkRTL } from '@/lib/localization-helper';
import { languages, translations as fallbackTranslations } from '@/lib/translations';

type TranslationKey = keyof typeof fallbackTranslations.en;
type SupportedLanguages = 'en' | 'hy' | 'ru' | 'ar';

type LanguageStore = {
  currentLanguage: SupportedLanguages;
  isRTL: boolean;
  translations: any;
  loadTranslations: () => Promise<void>;
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
    if (browserLang.includes('ar')) return 'ar';
    return 'en';
  } catch {
    return 'en';
  }
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: getDefaultLanguage(),
      isRTL: checkRTL(getDefaultLanguage() as any),
      translations: fallbackTranslations, // Start with fallback
      
      loadTranslations: async () => {
        try {
          const response = await fetch('/api/translations');
          if (response.ok) {
            const loadedTranslations = await response.json();
            set({ translations: loadedTranslations });
          }
        } catch (error) {
          console.warn('Failed to load translations from API, using fallback');
        }
      },
      
      setLanguage: (lang: string) => {
        if (languages.some(l => l.code === lang)) {
          const rtl = checkRTL(lang as any);
          set({ currentLanguage: lang as SupportedLanguages, isRTL: rtl });
          
          // Update document direction
          if (typeof document !== 'undefined') {
            document.documentElement.dir = rtl ? 'rtl' : 'ltr';
            document.documentElement.lang = lang;
          }
        }
      },
      getCurrentLanguage: () => get().currentLanguage,
      t: (key: string) => {
        try {
          const keys = key.split('.');
          let lang: SupportedLanguages = get().currentLanguage;
          const currentTranslations = get().translations;
          let current: any = currentTranslations[lang] || currentTranslations.en;
          
          for (const k of keys) {
            if (current === undefined || current[k] === undefined) {
              // Fallback to English
              current = currentTranslations.en;
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

// Hook to initialize translations
if (typeof window !== 'undefined') {
  useLanguage.getState().loadTranslations();
}