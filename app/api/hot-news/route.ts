import { NextRequest, NextResponse } from 'next/server';
import { readHotNewsBanners, createHotNewsBanner, getActiveHotNewsBanners } from '@/lib/hot-news-storage';

// GET /api/hot-news - Public (returns active) or Admin (returns all)
export async function GET(request: NextRequest) {
  try {
    // Check admin session cookie
    const adminSession = request.cookies.get('admin_session')?.value;
    const isAdmin = adminSession === 'authenticated';

    let banners;
    if (isAdmin) {
      // Admin sees all banners
      banners = await readHotNewsBanners();
    } else {
      // Public sees only active banners
      banners = await getActiveHotNewsBanners();
    }

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error reading hot news:', error);
    return NextResponse.json({ error: 'Failed to read hot news' }, { status: 500 });
  }
}

// POST /api/hot-news - Admin only
export async function POST(request: NextRequest) {
  try {
    // Check admin session cookie
    const adminSession = request.cookies.get('admin_session')?.value;
    if (adminSession !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bannerData = await request.json();
    const banner = await createHotNewsBanner(bannerData);

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('Error creating hot news:', error);
    return NextResponse.json({ error: 'Failed to create hot news' }, { status: 500 });
  }
}

export const revalidate = 0;
