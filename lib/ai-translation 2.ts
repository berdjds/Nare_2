// AI Translation Service using DeepSeek API

interface TranslationRequest {
  text: string;
  targetLanguage: 'hy' | 'ru' | 'ar';
  context?: string;
}

interface TranslationResponse {
  translatedText: string;
  error?: string;
}

/**
 * Translate text using DeepSeek AI
 */
export async function translateWithAI(
  request: TranslationRequest,
  apiKey: string
): Promise<TranslationResponse> {
  try {
    const languageNames = {
      hy: 'Armenian (Հայերեն)',
      ru: 'Russian (Русский)',
      ar: 'Arabic (العربية)',
    };

    const systemPrompt = `You are a professional translator specializing in travel and tourism content. 
Translate the provided English text to ${languageNames[request.targetLanguage]}.
${request.context ? `Context: ${request.context}` : ''}

Rules:
1. Maintain the tone and style appropriate for travel marketing
2. Keep proper nouns and brand names as they are
3. Preserve formatting (line breaks, etc.)
4. Use culturally appropriate expressions
5. Return ONLY the translated text, no explanations`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: request.text,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent translations
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0]?.message?.content?.trim();

    if (!translatedText) {
      throw new Error('No translation received from API');
    }

    return {
      translatedText,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Translation failed';
    console.error('AI Translation error:', error);
    return {
      translatedText: '',
      error: errorMessage,
    };
  }
}

/**
 * Translate multiple fields at once
 */
export async function translateMultipleFields(
  fields: Record<string, string>,
  targetLanguage: 'hy' | 'ru' | 'ar',
  apiKey: string,
  context?: string
): Promise<Record<string, string>> {
  const translations: Record<string, string> = {};

  for (const [key, value] of Object.entries(fields)) {
    if (!value) continue;

    const result = await translateWithAI(
      {
        text: value,
        targetLanguage,
        context: context || `Field: ${key}`,
      },
      apiKey
    );

    translations[key] = result.translatedText || value;

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return translations;
}

/**
 * Get estimated translation cost (tokens)
 */
export function estimateTranslationCost(text: string): {
  estimatedTokens: number;
  estimatedCost: string;
} {
  // Rough estimate: 1 token ≈ 4 characters
  const estimatedTokens = Math.ceil(text.length / 4) * 2; // x2 for input + output
  
  // DeepSeek pricing (approximate)
  const costPerMillionTokens = 0.14; // $0.14 per million tokens
  const estimatedCost = ((estimatedTokens / 1000000) * costPerMillionTokens).toFixed(6);

  return {
    estimatedTokens,
    estimatedCost: `$${estimatedCost}`,
  };
}
