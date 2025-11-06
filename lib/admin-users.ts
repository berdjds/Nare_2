// Admin User Management
export type AdminRole = 'super_admin' | 'contributor';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  createdBy?: string;
}

export interface AdminUserCreate {
  username: string;
  email: string;
  password: string;
  role: AdminRole;
}

export interface AdminUserUpdate {
  email?: string;
  role?: AdminRole;
  isActive?: boolean;
}

// Role permissions
export const ROLE_PERMISSIONS = {
  super_admin: {
    canAccessContent: true,
    canAccessConfiguration: true,
    canManageUsers: true,
    canEditAll: true,
  },
  contributor: {
    canAccessContent: true,
    canAccessConfiguration: false,
    canManageUsers: false,
    canEditAll: true,
  },
} as const;

// Helper functions
export function hasPermission(role: AdminRole, permission: keyof typeof ROLE_PERMISSIONS.super_admin): boolean {
  return ROLE_PERMISSIONS[role][permission];
}

export function canAccessConfiguration(role: AdminRole): boolean {
  return hasPermission(role, 'canAccessConfiguration');
}

export function canManageUsers(role: AdminRole): boolean {
  return hasPermission(role, 'canManageUsers');
}

// Default admin users storage key
export const ADMIN_USERS_KEY = 'admin_users';

// Get all admin users
export async function getAdminUsers(): Promise<AdminUser[]> {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(ADMIN_USERS_KEY);
  if (!stored) {
    // Initialize with default super admin
    const defaultAdmin: AdminUser = {
      id: '1',
      username: 'admin',
      email: 'admin@naretravel.com',
      role: 'super_admin',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify([defaultAdmin]));
    
    // Also store the default password
    const passwords = { admin: 'admin123' };
    localStorage.setItem('admin_passwords', JSON.stringify(passwords));
    
    return [defaultAdmin];
  }
  
  return JSON.parse(stored);
}

// Save admin users
export async function saveAdminUsers(users: AdminUser[]): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
}

// Create new admin user
export async function createAdminUser(userData: AdminUserCreate, createdBy: string): Promise<AdminUser> {
  const users = await getAdminUsers();
  
  // Check if username or email already exists
  if (users.some(u => u.username === userData.username)) {
    throw new Error('Username already exists');
  }
  if (users.some(u => u.email === userData.email)) {
    throw new Error('Email already exists');
  }
  
  const newUser: AdminUser = {
    id: Date.now().toString(),
    username: userData.username,
    email: userData.email,
    role: userData.role,
    isActive: true,
    createdAt: new Date().toISOString(),
    createdBy,
  };
  
  users.push(newUser);
  await saveAdminUsers(users);
  
  // Store password separately (in real app, use proper hashing)
  const passwords = JSON.parse(localStorage.getItem('admin_passwords') || '{}');
  passwords[userData.username] = userData.password; // In production: hash this!
  localStorage.setItem('admin_passwords', JSON.stringify(passwords));
  
  return newUser;
}

// Update admin user
export async function updateAdminUser(userId: string, updates: AdminUserUpdate): Promise<AdminUser> {
  const users = await getAdminUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  users[userIndex] = { ...users[userIndex], ...updates };
  await saveAdminUsers(users);
  
  return users[userIndex];
}

// Reset password
export async function resetUserPassword(userId: string, newPassword: string): Promise<void> {
  const users = await getAdminUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Update password (in production: hash this!)
  const passwords = JSON.parse(localStorage.getItem('admin_passwords') || '{}');
  passwords[user.username] = newPassword;
  localStorage.setItem('admin_passwords', JSON.stringify(passwords));
}

// Get current user from session
export function getCurrentUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  
  const sessionUser = sessionStorage.getItem('admin_user');
  if (!sessionUser) return null;
  
  return JSON.parse(sessionUser);
}

// Get current user role
export function getCurrentUserRole(): AdminRole | null {
  const user = getCurrentUser();
  return user?.role || null;
}
