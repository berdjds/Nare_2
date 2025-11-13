// Simple authentication utilities for admin panel
// In production, use NextAuth.js or similar

export interface AdminUser {
  username: string;
  role: 'admin' | 'editor';
}

// Default admin credentials (change these!)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123', // Change this in production!
};

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

export function createAdminSession(user: AdminUser): string {
  // Simple session token (use JWT in production)
  const session = {
    user,
    timestamp: Date.now(),
  };
  return Buffer.from(JSON.stringify(session)).toString('base64');
}

export function validateAdminSession(token: string): AdminUser | null {
  try {
    const session = JSON.parse(Buffer.from(token, 'base64').toString());
    // Check if session is less than 24 hours old
    if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
      return null;
    }
    return session.user;
  } catch {
    return null;
  }
}
