/**
 * Unified Translation Service
 * Best practices for AI translation with parallel execution and progress tracking
 */

export type SupportedLanguage = 'hy' | 'ru' | 'ar';
export type LanguageCode = 'en' | SupportedLanguage;

export interface MultiLangText {
  en: string;
  hy: string;
  ru: string;
  ar: string;
}

export interface TranslationProgress {
  language: SupportedLanguage;
  status: 'pending' | 'translating' | 'completed' | 'error';
  error?: string;
}

export interface TranslationOptions {
  onProgress?: (progress: TranslationProgress) => void;
  onSuccess?: (language: SupportedLanguage, result: string) => void;
  onError?: (language: SupportedLanguage, error: string) => void;
}

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  hy: 'Armenian',
  ru: 'Russian',
  ar: 'Arabic',
};

/**
 * Translate a single text to a single language
 */
export async function translateText(
  text: string,
  targetLang: SupportedLanguage
): Promise<string> {
  const response = await fetch('/api/ai/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLang }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Translation failed' }));
    throw new Error(error.error || 'Translation failed');
  }

  const data = await response.json();
  return data.translatedText;
}

/**
 * Translate multiple fields to a single language
 * Returns object with same keys as input
 */
export async function translateFields(
  fields: Record<string, string>,
  targetLang: SupportedLanguage
): Promise<Record<string, string>> {
  // Combine all fields into one text with labels
  const combinedText = Object.entries(fields)
    .filter(([_, value]) => value) // Only non-empty fields
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  if (!combinedText) {
    throw new Error('No content to translate');
  }

  const translatedText = await translateText(combinedText, targetLang);
  
  // Parse the response back into fields
  const result: Record<string, string> = {};
  const lines = translatedText.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      result[key.trim()] = value.trim();
    }
  }

  return result;
}

/**
 * Translate multiple fields to multiple languages in parallel
 * This is the main function to use for best performance
 */
export async function translateFieldsParallel(
  fields: Record<string, string>,
  targetLangs: SupportedLanguage[],
  options?: TranslationOptions
): Promise<Record<SupportedLanguage, Record<string, string>>> {
  const results: Record<string, Record<string, string>> = {};

  // Execute all translations in parallel for maximum speed
  const promises = targetLangs.map(async (lang) => {
    // Notify progress
    options?.onProgress?.({ language: lang, status: 'translating' });

    try {
      const translated = await translateFields(fields, lang);
      results[lang] = translated;
      
      // Notify success
      options?.onProgress?.({ language: lang, status: 'completed' });
      options?.onSuccess?.(lang, JSON.stringify(translated));
      
      return { lang, translated };
    } catch (error: any) {
      const errorMessage = error.message || 'Translation failed';
      
      // Notify error but don't fail entire operation
      options?.onProgress?.({ language: lang, status: 'error', error: errorMessage });
      options?.onError?.(lang, errorMessage);
      
      console.error(`Error translating to ${lang}:`, error);
      return { lang, translated: null };
    }
  });

  await Promise.all(promises);
  
  return results as Record<SupportedLanguage, Record<string, string>>;
}

/**
 * Translate article content (title, excerpt, content) to missing languages
 * Returns updated multilingual content
 */
export async function translateArticleContent(
  content: {
    title: MultiLangText;
    excerpt: MultiLangText;
    content: MultiLangText;
  },
  options?: TranslationOptions
): Promise<{
  title: MultiLangText;
  excerpt: MultiLangText;
  content: MultiLangText;
}> {
  // Determine which languages need translation
  const needsTranslation: SupportedLanguage[] = [];
  (['hy', 'ru', 'ar'] as SupportedLanguage[]).forEach((lang) => {
    if (!content.content[lang] && content.content.en) {
      needsTranslation.push(lang);
    }
  });

  if (needsTranslation.length === 0) {
    return content; // Nothing to translate
  }

  // Prepare fields for translation
  const fields = {
    title: content.title.en,
    excerpt: content.excerpt.en,
    content: content.content.en,
  };

  // Translate all languages in parallel
  const translations = await translateFieldsParallel(fields, needsTranslation, options);

  // Merge translations back into content
  const result = { ...content };
  
  for (const [lang, translated] of Object.entries(translations)) {
    if (translated) {
      result.title[lang as SupportedLanguage] = translated.title || result.title[lang as SupportedLanguage];
      result.excerpt[lang as SupportedLanguage] = translated.excerpt || result.excerpt[lang as SupportedLanguage];
      result.content[lang as SupportedLanguage] = translated.content || result.content[lang as SupportedLanguage];
    }
  }

  return result;
}

/**
 * Helper to get missing languages for any multilingual field
 */
export function getMissingLanguages(data: Partial<MultiLangText>): SupportedLanguage[] {
  const missing: SupportedLanguage[] = [];
  
  if (data.en) {
    if (!data.hy) missing.push('hy');
    if (!data.ru) missing.push('ru');
    if (!data.ar) missing.push('ar');
  }
  
  return missing;
}

/**
 * Get display name for language code
 */
export function getLanguageName(lang: SupportedLanguage): string {
  return LANGUAGE_NAMES[lang];
}

/**
 * Estimate translation time based on content length
 */
export function estimateTranslationTime(
  textLength: number,
  languageCount: number
): number {
  // Rough estimate: ~5 seconds per language for parallel execution
  // Sequential would be ~15 seconds per language
  const baseTime = 5; // seconds
  const charFactor = textLength > 1000 ? 1.5 : 1;
  
  return Math.ceil(baseTime * charFactor);
}
