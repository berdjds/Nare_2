import { NextRequest, NextResponse } from 'next/server';
import { getApiKey } from '@/lib/settings-storage';
import { fetchNewsSuggestions } from '@/lib/ai-news-harvester';

// POST /api/ai/news-suggestions - Admin only
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

    const suggestions = await fetchNewsSuggestions(apiKey);

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('Error fetching news suggestions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch news suggestions' },
      { status: 500 }
    );
  }
}

export const revalidate = 0;
