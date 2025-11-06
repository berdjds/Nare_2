/**
 * Auto-translate helper for new content
 */

export async function autoTranslateIfEnabled(
  englishText: string,
  targetLang: 'hy' | 'ru',
  context?: string
): Promise<string> {
  try {
    // Check if auto-translate is enabled
    const settingsResponse = await fetch('/api/admin/settings');
    if (!settingsResponse.ok) return '';
    
    const settings = await settingsResponse.json();
    if (!settings.autoTranslate || !settings.enableAITranslation) {
      return '';
    }

    // Translate
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: englishText,
        targetLanguage: targetLang,
        context: context || 'Content translation'
      })
    });

    if (!response.ok) return '';

    const data = await response.json();
    return data.translatedText || '';
  } catch (error) {
    console.error('Auto-translate error:', error);
    return '';
  }
}

export async function autoTranslateFields(
  englishTitle: string,
  englishDescription: string,
  context: string
): Promise<{
  titleHy: string;
  titleRu: string;
  descriptionHy: string;
  descriptionRu: string;
}> {
  try {
    // Check if auto-translate is enabled
    const settingsResponse = await fetch('/api/admin/settings');
    if (!settingsResponse.ok) {
      return { titleHy: '', titleRu: '', descriptionHy: '', descriptionRu: '' };
    }
    
    const settings = await settingsResponse.json();
    if (!settings.autoTranslate || !settings.enableAITranslation) {
      return { titleHy: '', titleRu: '', descriptionHy: '', descriptionRu: '' };
    }

    // Translate all fields in parallel
    const [titleHy, titleRu, descriptionHy, descriptionRu] = await Promise.all([
      autoTranslateIfEnabled(englishTitle, 'hy', `${context} title`),
      autoTranslateIfEnabled(englishTitle, 'ru', `${context} title`),
      autoTranslateIfEnabled(englishDescription, 'hy', `${context} description`),
      autoTranslateIfEnabled(englishDescription, 'ru', `${context} description`)
    ]);

    return { titleHy, titleRu, descriptionHy, descriptionRu };
  } catch (error) {
    console.error('Auto-translate fields error:', error);
    return { titleHy: '', titleRu: '', descriptionHy: '', descriptionRu: '' };
  }
}
