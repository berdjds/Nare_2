import { NextRequest, NextResponse } from 'next/server';
import { validateAdminSession } from '@/lib/auth';
import { readContent, writeContent, PageBanner } from '@/lib/content-storage';

// Check if user is admin
function checkAuth(request: NextRequest): boolean {
  const adminSession = request.cookies.get('admin_session')?.value;
  return adminSession === 'authenticated';
}

// GET /api/content/pageBanners
export async function GET(request: NextRequest) {
  try {
    const banners = await readContent<PageBanner>('pageBanners');
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error reading page banners:', error);
    return NextResponse.json({ error: 'Failed to read page banners' }, { status: 500 });
  }
}

// POST /api/content/pageBanners (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const banners: PageBanner[] = await request.json();
    
    await writeContent('pageBanners', banners);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving page banners:', error);
    return NextResponse.json({ error: 'Failed to save page banners' }, { status: 500 });
  }
}
