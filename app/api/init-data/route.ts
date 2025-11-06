import { NextResponse } from 'next/server';
import { initializeDefaultContent } from '@/lib/content-storage';

export async function POST() {
  try {
    await initializeDefaultContent();
    return NextResponse.json({ success: true, message: 'Default content initialized' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to initialize content' },
      { status: 500 }
    );
  }
}
