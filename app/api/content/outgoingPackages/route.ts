import { NextRequest, NextResponse } from 'next/server';
import { readContent, writeContent, OutgoingPackage } from '@/lib/content-storage';

// Check if user is admin
function checkAuth(request: NextRequest): boolean {
  const adminSession = request.cookies.get('admin_session')?.value;
  return adminSession === 'authenticated';
}

// GET /api/content/outgoingPackages
export async function GET(request: NextRequest) {
  try {
    const packages = await readContent<OutgoingPackage>('outgoingPackages');
    return NextResponse.json(packages);
  } catch (error) {
    console.error('Error reading outgoing packages:', error);
    return NextResponse.json({ error: 'Failed to read outgoing packages' }, { status: 500 });
  }
}

// POST /api/content/outgoingPackages (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const packages: OutgoingPackage[] = await request.json();
    
    await writeContent('outgoingPackages', packages);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving outgoing packages:', error);
    return NextResponse.json({ error: 'Failed to save outgoing packages' }, { status: 500 });
  }
}
