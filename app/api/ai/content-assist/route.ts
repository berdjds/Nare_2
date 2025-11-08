import { NextRequest, NextResponse } from 'next/server';
import { getApiKey } from '@/lib/settings-storage';

interface ContentAssistRequest {
  action: 'rephrase' | 'generate_description' | 'generate_subtitle' | 'generate_message';
  text: string;
  context?: string;
  fieldType?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const adminSession = request.cookies.get('admin_session')?.value;
    if (adminSession !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: ContentAssistRequest = await request.json();
    const { action, text, context, fieldType } = body;

    // Get API key from settings
    const apiKey = await getApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured. Please add it in Settings.' },
        { status: 400 }
      );
    }

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const result = await generateContent(
      { action, text, context, fieldType },
      apiKey
    );

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      generatedText: result.generatedText,
    });
  } catch (error) {
    console.error('Content assist API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Content generation failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

async function generateContent(
  request: ContentAssistRequest,
  apiKey: string
): Promise<{ generatedText: string; error?: string }> {
  try {
    const { action, text, context, fieldType } = request;

    let systemPrompt = '';
    let userPrompt = text;

    switch (action) {
      case 'rephrase':
        systemPrompt = `You are a professional copywriter specializing in travel and tourism content.
Rephrase the provided text to make it more engaging, professional, and appealing while maintaining its core message.
${context ? `Context: ${context}` : ''}
${fieldType ? `Field type: ${fieldType}` : ''}

Rules:
1. Keep the same meaning and key information
2. Make it more compelling and professional
3. Use active voice and vivid language
4. Maintain appropriate tone for travel marketing
5. Return ONLY the rephrased text, no explanations or quotes`;
        break;

      case 'generate_description':
        systemPrompt = `You are a professional travel content writer.
Based on the title provided, generate an engaging and informative description that would make travelers interested.
${context ? `Context: ${context}` : ''}

Rules:
1. Write 2-3 sentences (40-80 words)
2. Be specific and enticing
3. Highlight key features or benefits
4. Use compelling language
5. Return ONLY the description text, no explanations`;
        userPrompt = `Title: ${text}\n\nGenerate an engaging description for this travel offering.`;
        break;

      case 'generate_subtitle':
        systemPrompt = `You are a professional travel content writer.
Based on the title provided, generate a compelling subtitle or tagline.
${context ? `Context: ${context}` : ''}

Rules:
1. Write 1 short sentence or phrase (10-20 words)
2. Be catchy and memorable
3. Complement the main title
4. Use compelling language
5. Return ONLY the subtitle text, no explanations`;
        userPrompt = `Title: ${text}\n\nGenerate a compelling subtitle for this.`;
        break;

      case 'generate_message':
        systemPrompt = `You are a professional travel marketing copywriter.
Based on the title provided, generate a short promotional message.
${context ? `Context: ${context}` : ''}

Rules:
1. Write 1-2 sentences (20-40 words)
2. Create urgency or interest
3. Be promotional but not pushy
4. Use persuasive language
5. Return ONLY the message text, no explanations`;
        userPrompt = `Title: ${text}\n\nGenerate a promotional message for this.`;
        break;

      default:
        return { generatedText: '', error: 'Invalid action' };
    }

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
            content: userPrompt,
          },
        ],
        temperature: 0.7, // Higher temperature for more creative content
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    let generatedText = data.choices[0]?.message?.content?.trim();

    if (!generatedText) {
      throw new Error('No content received from API');
    }

    // Remove quotes if the AI wrapped the response in them
    generatedText = generatedText.replace(/^["']|["']$/g, '');

    return {
      generatedText,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Content generation failed';
    console.error('AI Content generation error:', error);
    return {
      generatedText: '',
      error: errorMessage,
    };
  }
}
