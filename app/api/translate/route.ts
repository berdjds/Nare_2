import { NextRequest, NextResponse } from 'next/server';
import { validateAdminSession } from '@/lib/auth';
import { getApiKey } from '@/lib/settings-storage';
import { translateWithAI, translateMultipleFields } from '@/lib/ai-translation';

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

    const body = await request.json();
    const { text, fields, targetLanguage, context } = body;

    // Get API key from settings
    const apiKey = await getApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured. Please add it in Settings.' },
        { status: 400 }
      );
    }

    // Validate target language
    if (!['hy', 'ru', 'ar'].includes(targetLanguage)) {
      return NextResponse.json(
        { error: 'Invalid target language' },
        { status: 400 }
      );
    }

    // Translate single text or multiple fields
    if (text) {
      const result = await translateWithAI(
        { text, targetLanguage, context },
        apiKey
      );

      if (result.error) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        translatedText: result.translatedText,
      });
    } else if (fields) {
      const translations = await translateMultipleFields(
        fields,
        targetLanguage,
        apiKey,
        context
      );

      return NextResponse.json({
        translations,
      });
    } else {
      return NextResponse.json(
        { error: 'Missing text or fields to translate' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}
