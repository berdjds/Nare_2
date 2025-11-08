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
  category: string
): Promise<{ title: string; excerpt: string; content: string; category: string; tags: string[] }> {
  const prompt = `You are a professional travel content writer specializing in Armenia and Georgia tourism.

Write a comprehensive, engaging article about: "${topic}"

Requirements:
- Length: 400-600 words
- Style: Professional, informative, and engaging
- Tone: Enthusiastic but authentic
- Include specific details, practical information, and cultural insights
- Make it SEO-friendly with relevant keywords
- Category: Choose the most appropriate from: news, events, culture, food-drinks, destinations
- Tags: Generate 4-6 relevant keywords (lowercase, single words or short phrases)

IMPORTANT FORMATTING:
- Structure the content with 4-5 clear paragraphs
- Separate each paragraph with TWO newline characters (\\n\\n)
- Each paragraph should be 3-4 sentences
- Use proper sentence structure with periods
- NO single continuous block of text

Return ONLY a JSON object with this exact structure:
{
  "title": "Article title here",
  "excerpt": "Brief summary here",
  "content": "Paragraph 1 text here.\\n\\nParagraph 2 text here.\\n\\nParagraph 3 text here.",
  "category": "most appropriate category",
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}

No markdown, no code blocks, just the raw JSON.`;

  try {
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
            content: 'You are a professional travel writer specializing in Armenia and Georgia. You MUST format content with proper paragraph breaks using \\n\\n between paragraphs. Always respond with valid JSON only.'
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
    const result = data.choices[0]?.message?.content;
    if (!result) {
      throw new Error('No content in response');
    }

    // Parse JSON response
    const parsed = JSON.parse(result);
    
    // Post-process content to ensure proper formatting
    let content = parsed.content || '';
    
    // If content doesn't have proper line breaks, add them
    if (!content.includes('\n\n')) {
      // Split by sentence endings and group into paragraphs
      const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
      const paragraphs: string[] = [];
      
      for (let i = 0; i < sentences.length; i += 3) {
        const paragraph = sentences.slice(i, i + 3).join(' ').trim();
        if (paragraph) paragraphs.push(paragraph);
      }
      
      content = paragraphs.join('\n\n');
    }
    
    return {
      title: parsed.title,
      excerpt: parsed.excerpt,
      content: content,
      category: parsed.category || category,
      tags: parsed.tags || []
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate article: ${errorMessage}`);
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
