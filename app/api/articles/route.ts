import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/admin-users';
import { readArticles, createArticle, getPublishedArticles } from '@/lib/articles-storage';

// GET /api/articles - Public (returns published) or Admin (returns all)
export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser();
    const isAdmin = user !== null;

    let articles;
    if (isAdmin) {
      // Admin sees all articles
      articles = await readArticles();
    } else {
      // Public sees only published articles
      articles = await getPublishedArticles();
    }

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error reading articles:', error);
    return NextResponse.json({ error: 'Failed to read articles' }, { status: 500 });
  }
}

// POST /api/articles - Admin only
export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const articleData = await request.json();
    const article = await createArticle(articleData);

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

export const revalidate = 0;
