/**
 * AI News Harvester for Travel Insights
 * Fetches positive tourism news about Armenia and Georgia
 */

export interface NewsSuggestion {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  publishedDate: string;
  category: 'events' | 'culture' | 'food-drinks' | 'destinations' | 'news';
  country: 'Armenia' | 'Georgia';
  relevanceScore: number;
}

/**
 * Fetch news suggestions using DeepSeek AI
 * This generates realistic tourism news topics based on current trends
 */
export async function fetchNewsSuggestions(apiKey: string): Promise<NewsSuggestion[]> {
  try {
    const prompt = `Generate 10 positive tourism news topics about Armenia and Georgia from the past 10 days. 
    
Focus on:
- Upcoming cultural events and festivals
- New tourist attractions or renovations
- Armenian and Georgian cuisine highlights
- Beautiful villages and towns to visit
- Archaeological discoveries
- Cultural achievements
- Tourism industry growth
- Traditional crafts and artisans
- Wine and food festivals
- UNESCO heritage sites

For each topic, provide:
1. An engaging title
2. A brief 2-3 sentence summary
3. Suggested category (events/culture/food-drinks/destinations/news)
4. Which country (Armenia or Georgia)

Return ONLY a valid JSON array with this structure:
[
  {
    "id": "unique-id",
    "title": "Title here",
    "summary": "Summary here",
    "category": "culture",
    "country": "Armenia",
    "relevanceScore": 0.95
  }
]

Make the topics realistic, current, and appealing to tourists.`;

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
            content: 'You are a tourism content specialist for Armenia and Georgia. Generate realistic, positive, and engaging tourism news topics. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from API');
    }

    // Parse JSON response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from response');
    }

    const suggestions: any[] = JSON.parse(jsonMatch[0]);

    // Add missing fields
    return suggestions.map((item, index) => ({
      id: item.id || `news-${Date.now()}-${index}`,
      title: item.title,
      summary: item.summary,
      sourceUrl: item.sourceUrl || '',
      sourceName: item.sourceName || 'AI Generated',
      publishedDate: new Date().toISOString(),
      category: item.category || 'news',
      country: item.country || 'Armenia',
      relevanceScore: item.relevanceScore || 0.8,
    }));
  } catch (error) {
    console.error('Error fetching news suggestions:', error);
    throw error;
  }
}

/**
 * Generate article content from news suggestion
 */
export async function generateArticleFromNews(
  apiKey: string,
  newsSuggestion: NewsSuggestion,
  additionalContext?: string
): Promise<string> {
  try {
    const prompt = `Transform this tourism news into a professional, engaging blog article:

Title: ${newsSuggestion.title}
Summary: ${newsSuggestion.summary}
${additionalContext ? `Additional Context: ${additionalContext}` : ''}

Requirements:
1. Write in a warm, professional, upbeat tone
2. Length: 400-600 words
3. Include practical information for tourists
4. Highlight cultural significance
5. Add a compelling introduction and conclusion
6. Use descriptive, vivid language
7. Make it SEO-friendly

Write the article in English. Return ONLY the article content, no titles or extra formatting.`;

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
            content: 'You are a professional travel writer specializing in Armenia and Georgia. Write engaging, informative articles that inspire tourists to visit.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating article:', error);
    throw error;
  }
}

/**
 * Generate article from custom topic
 */
export async function generateArticleFromTopic(
  apiKey: string,
  topic: string,
  category: string,
  additionalNotes?: string
): Promise<{ title: string; content: string; excerpt: string }> {
  try {
    const prompt = `Create a professional travel blog article about: "${topic}"

Category: ${category}
${additionalNotes ? `Additional Notes: ${additionalNotes}` : ''}

Requirements:
1. Generate an engaging title
2. Write 400-600 words
3. Warm, professional, upbeat tone
4. Include practical tourist information
5. Highlight cultural aspects
6. SEO-friendly
7. Add a compelling 2-3 sentence excerpt

Return ONLY valid JSON in this format:
{
  "title": "Article title here",
  "excerpt": "Brief 2-3 sentence summary",
  "content": "Full article content here"
}`;

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
            content: 'You are a professional travel writer specializing in Armenia and Georgia. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating article from topic:', error);
    throw error;
  }
}

/**
 * Translate article content to target language
 */
export async function translateArticleContent(
  apiKey: string,
  content: { title: string; excerpt: string; content: string },
  targetLang: 'hy' | 'ru' | 'ar'
): Promise<{ title: string; excerpt: string; content: string }> {
  const langNames = {
    hy: 'Armenian',
    ru: 'Russian',
    ar: 'Arabic'
  };

  try {
    const prompt = `Translate this travel article to ${langNames[targetLang]}:

Title: ${content.title}
Excerpt: ${content.excerpt}
Content: ${content.content}

Requirements:
1. Professional tourism language
2. Culturally appropriate
3. Maintain the upbeat, engaging tone
4. Keep formatting and structure
${targetLang === 'ar' ? '5. Use proper RTL formatting' : ''}

Return ONLY valid JSON:
{
  "title": "Translated title",
  "excerpt": "Translated excerpt",
  "content": "Translated content"
}`;

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
            content: `You are a professional translator specializing in tourism content. Translate to ${langNames[targetLang]}. Always respond with valid JSON only.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseContent = data.choices[0]?.message?.content;

    // Parse JSON response
    const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error(`Error translating to ${targetLang}:`, error);
    throw error;
  }
}
