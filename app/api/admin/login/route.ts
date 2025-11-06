import { NextRequest, NextResponse } from 'next/server';

// Default admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Check credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // User info for session
      const userInfo = {
        id: '1',
        username: 'admin',
        email: 'admin@naretravel.com',
        role: 'super_admin',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // Create response with user info
      const response = NextResponse.json({ 
        success: true,
        user: userInfo
      });

      // Set session cookie
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      });
      
      return response;
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
