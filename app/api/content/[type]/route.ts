import { NextRequest, NextResponse } from 'next/server';
import { 
  readContent, 
  writeContent, 
  readSingleContent, 
  writeSingleContent,
  SiteContent 
} from '@/lib/content-storage';

// Check if user is admin
function checkAuth(request: NextRequest): boolean {
  const adminSession = request.cookies.get('admin_session')?.value;
  return adminSession === 'authenticated';
}

// GET content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const contentType = type as keyof SiteContent;
    
    // Allow public access to read content
    if (contentType === 'contactInfo' || contentType === 'socialLinks') {
      const content = await readSingleContent(contentType);
      return NextResponse.json(content || {});
    }
    
    const content = await readContent(contentType);
    return NextResponse.json(content || []);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read content' },
      { status: 500 }
    );
  }
}

// POST/PUT content (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type } = await params;
    const contentType = type as keyof SiteContent;
    const data = await request.json();
    
    if (contentType === 'contactInfo' || contentType === 'socialLinks') {
      await writeSingleContent(contentType, data);
    } else {
      await writeContent(contentType, data);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to write content' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  return POST(request, context);
}
