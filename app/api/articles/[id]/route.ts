import { NextRequest, NextResponse } from 'next/server';
import { getArticleById, updateArticle, deleteArticle } from '@/lib/articles-storage';

// GET /api/articles/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await getArticleById(id);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Check if article is published or user is admin
    const adminSession = request.cookies.get('admin_session')?.value;
    const isAdmin = adminSession === 'authenticated';

    if (article.status !== 'published' && !isAdmin) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error reading article:', error);
    return NextResponse.json({ error: 'Failed to read article' }, { status: 500 });
  }
}

// PUT /api/articles/[id] - Admin only
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15+
    const { id } = await params;
    
    // Check admin session cookie
    const adminSession = request.cookies.get('admin_session')?.value;
    if (adminSession !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    console.log('Updating article:', id, 'with updates:', JSON.stringify(updates).substring(0, 200));
    
    const article = await updateArticle(id, updates);

    if (!article) {
      console.error('Article not found for update:', id);
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    console.log('Article updated successfully:', id);
    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Error updating article:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: error.message || 'Failed to update article',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// DELETE /api/articles/[id] - Admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check admin session cookie
    const adminSession = request.cookies.get('admin_session')?.value;
    if (adminSession !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const success = await deleteArticle(id);

    if (!success) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}

export const revalidate = 0;
