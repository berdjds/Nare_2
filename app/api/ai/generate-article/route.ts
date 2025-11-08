import { NextRequest, NextResponse } from 'next/server';
import { getApiKey } from '@/lib/settings-storage';
import { generateArticleFromNews, generateArticleFromTopic } from '@/lib/ai-news-harvester';

// POST /api/ai/generate-article - Admin only
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
    const { type, data } = body;

    let result;

    if (type === 'news') {
      // Generate from news suggestion
      const content = await generateArticleFromNews(
        apiKey,
        data.newsSuggestion,
        data.additionalContext
      );
      result = {
        title: data.newsSuggestion.title,
        excerpt: data.newsSuggestion.summary,
        content
      };
    } else if (type === 'topic') {
      // Generate from custom topic
      result = await generateArticleFromTopic(
        apiKey,
        data.topic,
        data.category,
        data.additionalNotes
      );
    } else {
      return NextResponse.json({ error: 'Invalid generation type' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating article:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate article';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const revalidate = 0;
