"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Shield, ShieldOff, Key, Search, User, Mail, Calendar } from 'lucide-react';
import { AdminUser, AdminUserCreate, AdminRole, getAdminUsers, createAdminUser, updateAdminUser, resetUserPassword, getCurrentUser } from '@/lib/admin-users';
import { useToast } from '@/hooks/use-toast';

export default function UsersManager() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    loadUsers();
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(
        users.filter(user =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      const loadedUsers = await getAdminUsers();
      setUsers(loadedUsers);
      setFilteredUsers(loadedUsers);
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: AdminUserCreate) => {
    try {
      const newUser = await createAdminUser(userData, currentUser?.username || 'system');
      setUsers([...users, newUser]);
      toast({
        title: "✅ Success",
        description: "User created successfully!",
        duration: 5000,
      });
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      // Prevent deactivating yourself
      if (user.id === currentUser?.id) {
        toast({
          title: "⚠️ Warning",
          description: "You cannot deactivate your own account",
          variant: "destructive",
        });
        return;
      }

      const updated = await updateAdminUser(userId, { isActive: !user.isActive });
      setUsers(users.map(u => u.id === userId ? updated : u));
      
      toast({
        title: "✅ Success",
        description: `User ${updated.isActive ? 'activated' : 'deactivated'} successfully!`,
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRole = async (userId: string, role: AdminRole) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      // Prevent changing your own role
      if (user.id === currentUser?.id) {
        toast({
          title: "⚠️ Warning",
          description: "You cannot change your own role",
          variant: "destructive",
        });
        return;
      }

      const updated = await updateAdminUser(userId, { role });
      setUsers(users.map(u => u.id === userId ? updated : u));
      
      toast({
        title: "✅ Success",
        description: "User role updated successfully!",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="text-center py-8">Loading users...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            User Management
            <Badge variant="secondary" className="text-sm">
              {users.length} {users.length === 1 ? 'User' : 'Users'}
            </Badge>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Manage admin users, roles, and permissions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Add New User
          </Button>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Admin User</DialogTitle>
            </DialogHeader>
            <UserForm onSave={handleCreateUser} onCancel={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by username, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 text-base"
        />
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className={`transition-all duration-200 hover:shadow-md ${!user.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* User Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{user.username}</h3>
                        {user.id === currentUser?.id && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                        <Badge variant={user.role === 'super_admin' ? 'default' : 'secondary'}>
                          {user.role === 'super_admin' ? '👑 Super Admin' : '✏️ Contributor'}
                        </Badge>
                        {!user.isActive && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Created {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Select
                      value={user.role}
                      onValueChange={(role) => handleUpdateRole(user.id, role as AdminRole)}
                      disabled={user.id === currentUser?.id}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="contributor">Contributor</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      size="sm"
                      variant={user.isActive ? "outline" : "secondary"}
                      onClick={() => handleToggleActive(user.id)}
                      disabled={user.id === currentUser?.id}
                    >
                      {user.isActive ? (
                        <><ShieldOff className="h-4 w-4 mr-1" /> Deactivate</>
                      ) : (
                        <><Shield className="h-4 w-4 mr-1" /> Activate</>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingUser(user);
                        setIsPasswordDialogOpen(true);
                      }}
                    >
                      <Key className="h-4 w-4 mr-1" />
                      Reset Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Password Reset Dialog */}
      {editingUser && (
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Reset Password for {editingUser.username}</DialogTitle>
            </DialogHeader>
            <PasswordResetForm
              userId={editingUser.id}
              onSave={async (password) => {
                try {
                  await resetUserPassword(editingUser.id, password);
                  toast({
                    title: "✅ Success",
                    description: "Password reset successfully!",
                    duration: 5000,
                  });
                  setIsPasswordDialogOpen(false);
                  setEditingUser(null);
                } catch (error) {
                  toast({
                    title: "❌ Error",
                    description: "Failed to reset password",
                    variant: "destructive",
                  });
                }
              }}
              onCancel={() => {
                setIsPasswordDialogOpen(false);
                setEditingUser(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// User Form Component
interface UserFormProps {
  onSave: (user: AdminUserCreate) => void;
  onCancel: () => void;
}

function UserForm({ onSave, onCancel }: UserFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AdminUserCreate>({
    username: '',
    email: '',
    password: '',
    role: 'contributor',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: "⚠️ Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "⚠️ Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Username *</Label>
        <Input
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder="john_doe"
        />
      </div>

      <div className="space-y-2">
        <Label>Email *</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label>Password *</Label>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Minimum 6 characters"
        />
      </div>

      <div className="space-y-2">
        <Label>Role *</Label>
        <Select value={formData.role} onValueChange={(role) => setFormData({ ...formData, role: role as AdminRole })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="super_admin">👑 Super Admin - Full Access</SelectItem>
            <SelectItem value="contributor">✏️ Contributor - Content Only</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          {formData.role === 'super_admin' 
            ? 'Full access to content management and configuration'
            : 'Access only to content management (no configuration)'}
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create User
        </Button>
      </div>
    </form>
  );
}

// Password Reset Form
interface PasswordResetFormProps {
  userId: string;
  onSave: (password: string) => void;
  onCancel: () => void;
}

function PasswordResetForm({ onSave, onCancel }: PasswordResetFormProps) {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast({
        title: "⚠️ Validation Error",
        description: "Please fill in both fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "⚠️ Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "⚠️ Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    onSave(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>New Password *</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 6 characters"
        />
      </div>

      <div className="space-y-2">
        <Label>Confirm Password *</Label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter password"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Reset Password
        </Button>
      </div>
    </form>
  );
}
