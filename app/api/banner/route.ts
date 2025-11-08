import { NextRequest, NextResponse } from 'next/server';
import { readBannerConfig, writeBannerConfig } from '@/lib/banner-storage';

// Check if user is admin
function checkAuth(request: NextRequest): boolean {
  const adminSession = request.cookies.get('admin_session')?.value;
  return adminSession === 'authenticated';
}

// GET /api/banner - Public endpoint
export async function GET() {
  try {
    const config = await readBannerConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error reading banner config:', error);
    return NextResponse.json({ error: 'Failed to read banner configuration' }, { status: 500 });
  }
}

// POST /api/banner - Admin only
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const config = await request.json();
    await writeBannerConfig(config);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving banner config:', error);
    return NextResponse.json({ error: 'Failed to save banner configuration' }, { status: 500 });
  }
}

export const revalidate = 0;
