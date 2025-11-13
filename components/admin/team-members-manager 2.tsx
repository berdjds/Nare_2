"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, MoveUp, MoveDown } from 'lucide-react';
import { TeamMember } from '@/lib/content-storage';
import { ImageUpload } from './image-upload';
import { TranslationTabs } from './translation-tabs';
import { useToast } from '@/hooks/use-toast';

export default function TeamMembersManager() {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchQuery]);

  const loadMembers = async () => {
    try {
      const response = await fetch('/api/content/teamMembers');
      const data = await response.json();
      const sortedMembers = Array.isArray(data) 
        ? data.sort((a, b) => (a.order || 0) - (b.order || 0))
        : [];
      setMembers(sortedMembers);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(query) ||
        member.position.toLowerCase().includes(query) ||
        member.bio.toLowerCase().includes(query)
      );
    }

    setFilteredMembers(filtered);
  };

  const createNewMember = (): TeamMember => ({
    id: Date.now().toString(),
    name: '',
    position: '',
    positionHy: '',
    positionRu: '',
    bio: '',
    bioHy: '',
    bioRu: '',
    image: '',
    order: members.length,
    isActive: true,
  });

  const handleCreate = async (newMember: TeamMember) => {
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    await saveMembers(updatedMembers);
    toast({
      title: "✅ Success",
      description: "Team member added successfully!",
      duration: 5000,
    });
    setIsCreateDialogOpen(false);
  };

  const handleUpdate = async (updatedMember: TeamMember) => {
    const updatedMembers = members.map(member => 
      member.id === updatedMember.id ? updatedMember : member
    );
    setMembers(updatedMembers);
    await saveMembers(updatedMembers);
    toast({
      title: "✅ Success",
      description: "Team member updated successfully!",
      duration: 5000,
    });
    setIsEditDialogOpen(false);
    setEditingMember(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    
    const updatedMembers = members.filter(member => member.id !== id);
    // Reorder remaining members
    updatedMembers.forEach((member, index) => member.order = index);
    setMembers(updatedMembers);
    await saveMembers(updatedMembers);
  };

  const toggleActive = async (id: string) => {
    const updatedMembers = members.map(member => 
      member.id === id ? { ...member, isActive: !member.isActive } : member
    );
    setMembers(updatedMembers);
    await saveMembers(updatedMembers);
  };

  const moveMember = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= members.length) return;
    
    const newMembers = [...members];
    [newMembers[index], newMembers[targetIndex]] = [newMembers[targetIndex], newMembers[index]];
    
    // Update order values
    newMembers.forEach((member, i) => member.order = i);
    
    setMembers(newMembers);
    await saveMembers(newMembers);
  };

  const saveMembers = async (membersToSave: TeamMember[]) => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/teamMembers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(membersToSave),
      });
      
      if (!response.ok) {
        alert('Failed to save team members');
      }
    } catch (error) {
      alert('Error saving team members');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Team Members
            <Badge variant="secondary" className="text-sm">
              {members.length} {members.length === 1 ? 'Member' : 'Members'}
            </Badge>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Manage your team members and their profiles
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">
              <Plus className="h-5 w-5 mr-2" />
              Add New Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            <MemberForm 
              member={createNewMember()} 
              onSave={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search members by name, position, or bio..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 text-base"
        />
      </div>

      {/* Members List */}
      {filteredMembers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'No team members match your search' : 'No team members yet'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Team Member
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredMembers.map((member, index) => (
            <Card key={member.id} className={`transition-all duration-200 hover:shadow-lg border-l-4 ${
              member.isActive === false 
                ? 'opacity-60 border-l-gray-300' 
                : 'border-l-blue-500 hover:border-l-blue-600'
            }`}>
              <CardContent className="p-0">
                <div className="flex gap-0">
                  {/* Member Photo */}
                  <div className="relative w-40 h-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {member.image ? (
                      <Image 
                        src={member.image} 
                        alt={member.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="160px"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm">No Photo</span>
                      </div>
                    )}
                    {member.isActive === false && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-sm px-3 py-1">
                          <EyeOff className="h-4 w-4 mr-1" />
                          Inactive
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">Position {index + 1}</Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {member.name || 'Unnamed Member'}
                        </h3>
                        <p className="text-base text-blue-600 font-semibold mt-2">
                          {member.position || 'No position'}
                        </p>
                        <p className="text-sm text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                          {member.bio || 'No bio provided'}
                        </p>
                      </div>
                    </div>

                    {/* Translation Status */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 mt-4">
                      <span className="text-xs font-medium text-gray-600">Translations:</span>
                      <div className="flex gap-3">
                        <span className={`text-sm flex items-center gap-1 ${member.position ? 'text-green-600' : 'text-gray-400'}`}>
                          🇬🇧 {member.position ? '✓' : '○'}
                        </span>
                        <span className={`text-sm flex items-center gap-1 ${member.positionHy ? 'text-green-600' : 'text-gray-400'}`}>
                          🇦🇲 {member.positionHy ? '✓' : '○'}
                        </span>
                        <span className={`text-sm flex items-center gap-1 ${member.positionRu ? 'text-green-600' : 'text-gray-400'}`}>
                          🇷🇺 {member.positionRu ? '✓' : '○'}
                        </span>
                        <span className={`text-sm flex items-center gap-1 ${member.positionAr ? 'text-green-600' : 'text-gray-400'}`}>
                          🇦🇪 {member.positionAr ? '✓' : '○'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 p-4 bg-gray-50 border-l border-gray-200">
                    <div className="flex gap-2 mb-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveMember(index, 'up')}
                        disabled={index === 0}
                        className="flex-1"
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveMember(index, 'down')}
                        disabled={index === filteredMembers.length - 1}
                        className="flex-1"
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full justify-start"
                      onClick={() => {
                        setEditingMember(member);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(member.id)}
                    >
                      {member.isActive !== false ? (
                        <><EyeOff className="h-4 w-4 mr-1" /> Hide</>
                      ) : (
                        <><Eye className="h-4 w-4 mr-1" /> Show</>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingMember && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
            </DialogHeader>
            <MemberForm 
              member={editingMember} 
              onSave={handleUpdate}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingMember(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Member Form Component
interface MemberFormProps {
  member: TeamMember;
  onSave: (member: TeamMember) => void;
  onCancel: () => void;
}

function MemberForm({ member: initialMember, onSave, onCancel }: MemberFormProps) {
  const { toast } = useToast();
  const [member, setMember] = useState(initialMember);
  const [autoTranslating, setAutoTranslating] = useState(false);

  const updateField = (field: keyof TeamMember, value: any) => {
    setMember({ ...member, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member.name || !member.position) {
      alert('Please fill in at least the name and English position');
      return;
    }

    // Auto-translate if enabled
    try {
      const settingsResponse = await fetch('/api/admin/settings');
      if (settingsResponse.ok) {
        const settings = await settingsResponse.json();
        
        if (settings.autoTranslate && settings.enableAITranslation) {
          setAutoTranslating(true);
          const updatedMember = { ...member };
          
          try {
            if (member.position && !member.positionHy) {
              const hyResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: member.position, targetLanguage: 'hy', context: 'Team member job title' })
              });
              if (hyResponse.ok) {
                const data = await hyResponse.json();
                updatedMember.positionHy = data.translatedText;
              }
            }
            
            if (member.position && !member.positionRu) {
              const ruResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: member.position, targetLanguage: 'ru', context: 'Team member job title' })
              });
              if (ruResponse.ok) {
                const data = await ruResponse.json();
                updatedMember.positionRu = data.translatedText;
              }
            }
            
            if (member.bio && !member.bioHy) {
              const hyResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: member.bio, targetLanguage: 'hy', context: 'Team member biography' })
              });
              if (hyResponse.ok) {
                const data = await hyResponse.json();
                updatedMember.bioHy = data.translatedText;
              }
            }
            
            if (member.bio && !member.bioRu) {
              const ruResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: member.bio, targetLanguage: 'ru', context: 'Team member biography' })
              });
              if (ruResponse.ok) {
                const data = await ruResponse.json();
                updatedMember.bioRu = data.translatedText;
              }
            }
            
            // Arabic translations
            if (member.position && !member.positionAr) {
              const arResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: member.position, targetLanguage: 'ar', context: 'Team member job title' })
              });
              if (arResponse.ok) {
                const data = await arResponse.json();
                updatedMember.positionAr = data.translatedText;
              }
            }
            
            if (member.bio && !member.bioAr) {
              const arResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: member.bio, targetLanguage: 'ar', context: 'Team member biography' })
              });
              if (arResponse.ok) {
                const data = await arResponse.json();
                updatedMember.bioAr = data.translatedText;
              }
            }
          } catch (error) {
            console.error('Auto-translate error:', error);
          } finally {
            setAutoTranslating(false);
          }
          
          onSave(updatedMember);
          return;
        }
      }
    } catch (error) {
      console.error('Settings check error:', error);
    }

    onSave(member);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <Input
          value={member.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

      {/* Position with Translation */}
      <TranslationTabs
        fieldName="Position"
        englishValue={member.position}
        armenianValue={member.positionHy}
        russianValue={member.positionRu}
        arabicValue={member.positionAr || ''}
        onEnglishChange={(value) => updateField('position', value)}
        onArmenianChange={(value) => updateField('positionHy', value)}
        onRussianChange={(value) => updateField('positionRu', value)}
        onArabicChange={(value) => updateField('positionAr', value)}
        context="Team member position/role"
      />

      {/* Bio with Translation */}
      <TranslationTabs
        fieldName="Bio"
        englishValue={member.bio}
        armenianValue={member.bioHy}
        russianValue={member.bioRu}
        arabicValue={member.bioAr || ''}
        onEnglishChange={(value) => updateField('bio', value)}
        onArmenianChange={(value) => updateField('bioHy', value)}
        onRussianChange={(value) => updateField('bioRu', value)}
        onArabicChange={(value) => updateField('bioAr', value)}
        multiline
        rows={3}
        context="Team member biography"
      />

      {/* Photo */}
      <ImageUpload
        label="Member Photo"
        value={member.image}
        onChange={(url) => updateField('image', url)}
        recommendedSize={{ width: 400, height: 400 }}
      />

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={autoTranslating}>
          Cancel
        </Button>
        <Button type="submit" disabled={autoTranslating}>
          {autoTranslating ? 'Auto-translating...' : 'Save Team Member'}
        </Button>
      </div>
    </form>
  );
}
