import { NextRequest, NextResponse } from 'next/server';
import { validateAdminSession } from '@/lib/auth';
import { readTranslations, writeTranslations } from '@/lib/translations-storage';

// Check if user is admin
function checkAuth(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;
  const user = validateAdminSession(token);
  return user !== null;
}

// GET /api/content/translations
export async function GET(request: NextRequest) {
  try {
    const translations = await readTranslations();
    return NextResponse.json(translations);
  } catch (error) {
    console.error('Error reading translations:', error);
    return NextResponse.json({ error: 'Failed to read translations' }, { status: 500 });
  }
}

// POST /api/content/translations
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const sections = await request.json();
    
    await writeTranslations(sections);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving translations:', error);
    return NextResponse.json({ error: 'Failed to save translations' }, { status: 500 });
  }
}
