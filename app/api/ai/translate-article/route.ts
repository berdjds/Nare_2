import { NextRequest, NextResponse } from 'next/server';
import { getApiKey } from '@/lib/settings-storage';
import { translateArticleContent } from '@/lib/ai-news-harvester';

// POST /api/ai/translate-article - Admin only
export async function POST(request: NextRequest) {
  try {
    // Check admin session cookie
    const adminSession = request.cookies.get('admin_session')?.value;
    if (adminSession !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = await getApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured. Please configure it in Settings.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content, targetLang } = body;

    if (!['hy', 'ru', 'ar'].includes(targetLang)) {
      return NextResponse.json({ error: 'Invalid target language' }, { status: 400 });
    }

    const translated = await translateArticleContent(apiKey, content, targetLang);

    return NextResponse.json(translated);
  } catch (error: any) {
    console.error('Error translating article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to translate article' },
      { status: 500 }
    );
  }
}

export const revalidate = 0;
