/**
 * React Hook for AI Translation
 * Easy-to-use translation hook with progress tracking and toast notifications
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  SupportedLanguage,
  translateText,
  translateFields,
  translateFieldsParallel,
  getLanguageName,
} from '@/lib/translation-service';

export interface UseTranslationOptions {
  showToasts?: boolean;
  onSuccess?: (language: SupportedLanguage) => void;
  onError?: (language: SupportedLanguage, error: string) => void;
}

export function useTranslation(options: UseTranslationOptions = {}) {
  const { showToasts = true } = options;
  const [translating, setTranslating] = useState(false);
  const [progress, setProgress] = useState<Record<SupportedLanguage, 'idle' | 'translating' | 'completed' | 'error'>>({
    hy: 'idle',
    ru: 'idle',
    ar: 'idle',
  });

  /**
   * Translate a single text to one language
   */
  const translateSingle = useCallback(async (
    text: string,
    targetLang: SupportedLanguage
  ): Promise<string | null> => {
    if (!text) {
      if (showToasts) toast.error('No text to translate');
      return null;
    }

    setTranslating(true);
    setProgress(prev => ({ ...prev, [targetLang]: 'translating' }));

    try {
      const result = await translateText(text, targetLang);
      
      setProgress(prev => ({ ...prev, [targetLang]: 'completed' }));
      
      if (showToasts) {
        toast.success(`Translated to ${getLanguageName(targetLang)}!`);
      }
      
      options.onSuccess?.(targetLang);
      return result;
    } catch (error: any) {
      const errorMsg = error.message || 'Translation failed';
      
      setProgress(prev => ({ ...prev, [targetLang]: 'error' }));
      
      if (showToasts) {
        toast.error(`Failed to translate to ${getLanguageName(targetLang)}: ${errorMsg}`);
      }
      
      options.onError?.(targetLang, errorMsg);
      return null;
    } finally {
      setTranslating(false);
    }
  }, [showToasts, options]);

  /**
   * Translate multiple fields to one language
   */
  const translateMultipleFields = useCallback(async (
    fields: Record<string, string>,
    targetLang: SupportedLanguage
  ): Promise<Record<string, string> | null> => {
    const hasContent = Object.values(fields).some(v => v);
    
    if (!hasContent) {
      if (showToasts) toast.error('No content to translate');
      return null;
    }

    setTranslating(true);
    setProgress(prev => ({ ...prev, [targetLang]: 'translating' }));

    try {
      const result = await translateFields(fields, targetLang);
      
      setProgress(prev => ({ ...prev, [targetLang]: 'completed' }));
      
      if (showToasts) {
        toast.success(`Translated to ${getLanguageName(targetLang)}!`);
      }
      
      options.onSuccess?.(targetLang);
      return result;
    } catch (error: any) {
      const errorMsg = error.message || 'Translation failed';
      
      setProgress(prev => ({ ...prev, [targetLang]: 'error' }));
      
      if (showToasts) {
        toast.error(`Failed to translate to ${getLanguageName(targetLang)}: ${errorMsg}`);
      }
      
      options.onError?.(targetLang, errorMsg);
      return null;
    } finally {
      setTranslating(false);
    }
  }, [showToasts, options]);

  /**
   * Translate multiple fields to multiple languages in parallel (RECOMMENDED)
   */
  const translateParallel = useCallback(async (
    fields: Record<string, string>,
    targetLangs: SupportedLanguage[]
  ): Promise<Record<SupportedLanguage, Record<string, string>>> => {
    const hasContent = Object.values(fields).some(v => v);
    
    if (!hasContent) {
      if (showToasts) toast.error('No content to translate');
      return {} as Record<SupportedLanguage, Record<string, string>>;
    }

    if (targetLangs.length === 0) {
      return {} as Record<SupportedLanguage, Record<string, string>>;
    }

    setTranslating(true);
    
    // Set all to translating
    const newProgress = { ...progress };
    targetLangs.forEach(lang => {
      newProgress[lang] = 'translating';
    });
    setProgress(newProgress);

    if (showToasts) {
      toast.info(`Translating to ${targetLangs.length} language(s) in parallel...`);
    }

    try {
      const results = await translateFieldsParallel(fields, targetLangs, {
        onProgress: (prog) => {
          setProgress(prev => ({ ...prev, [prog.language]: prog.status }));
        },
        onSuccess: (lang) => {
          if (showToasts) {
            toast.success(`Translated to ${getLanguageName(lang)}!`);
          }
          options.onSuccess?.(lang);
        },
        onError: (lang, error) => {
          if (showToasts) {
            toast.error(`Failed to translate to ${getLanguageName(lang)}`);
          }
          options.onError?.(lang, error);
        },
      });

      return results;
    } finally {
      setTranslating(false);
    }
  }, [showToasts, options, progress]);

  /**
   * Reset progress state
   */
  const resetProgress = useCallback(() => {
    setProgress({ hy: 'idle', ru: 'idle', ar: 'idle' });
  }, []);

  return {
    translating,
    progress,
    translateSingle,
    translateMultipleFields,
    translateParallel,
    resetProgress,
  };
}
