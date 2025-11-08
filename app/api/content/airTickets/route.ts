import { NextRequest, NextResponse } from 'next/server';
import { readContent, writeContent, AirTicket } from '@/lib/content-storage';

// Check if user is admin
function checkAuth(request: NextRequest): boolean {
  const adminSession = request.cookies.get('admin_session')?.value;
  return adminSession === 'authenticated';
}

// GET /api/content/airTickets
export async function GET(request: NextRequest) {
  try {
    const tickets = await readContent<AirTicket>('airTickets');
    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error reading air tickets:', error);
    return NextResponse.json({ error: 'Failed to read air tickets' }, { status: 500 });
  }
}

// POST /api/content/airTickets (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const tickets: AirTicket[] = await request.json();
    
    await writeContent('airTickets', tickets);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving air tickets:', error);
    return NextResponse.json({ error: 'Failed to save air tickets' }, { status: 500 });
  }
}
