import { NextRequest, NextResponse } from 'next/server';
import { validateAdminSession } from '@/lib/auth';
import { readSettings, writeSettings, validateApiKey } from '@/lib/settings-storage';

// GET settings
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !validateAdminSession(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const settings = await readSettings();
    
    // Mask API key for security (show only last 4 characters)
    if (settings.deepseekApiKey) {
      const key = settings.deepseekApiKey;
      settings.deepseekApiKey = '***' + key.slice(-4);
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read settings' },
      { status: 500 }
    );
  }
}

// POST update settings
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !validateAdminSession(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate API key if provided
    if (body.deepseekApiKey && body.deepseekApiKey !== '***') {
      if (!validateApiKey(body.deepseekApiKey)) {
        return NextResponse.json(
          { error: 'Invalid API key format' },
          { status: 400 }
        );
      }
    } else if (body.deepseekApiKey === '***') {
      // If masked, keep existing key
      const currentSettings = await readSettings();
      body.deepseekApiKey = currentSettings.deepseekApiKey;
    }

    await writeSettings(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
