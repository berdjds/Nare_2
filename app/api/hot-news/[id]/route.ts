import { NextRequest, NextResponse } from 'next/server';
import { updateHotNewsBanner, deleteHotNewsBanner } from '@/lib/hot-news-storage';

// PUT /api/hot-news/[id] - Admin only
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin session
    const adminSession = request.cookies.get('admin_session')?.value;
    if (adminSession !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const bannerData = await request.json();
    
    const updatedBanner = await updateHotNewsBanner(id, bannerData);
    
    if (!updatedBanner) {
      return NextResponse.json({ error: 'Hot news not found' }, { status: 404 });
    }

    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error('Error updating hot news:', error);
    return NextResponse.json({ error: 'Failed to update hot news' }, { status: 500 });
  }
}

// DELETE /api/hot-news/[id] - Admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin session
    const adminSession = request.cookies.get('admin_session')?.value;
    if (adminSession !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const success = await deleteHotNewsBanner(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Hot news not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hot news:', error);
    return NextResponse.json({ error: 'Failed to delete hot news' }, { status: 500 });
  }
}

export const revalidate = 0;
