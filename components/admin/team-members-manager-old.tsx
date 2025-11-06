"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Save, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { TeamMember } from '@/lib/content-storage';
import { ImageUpload } from './image-upload';

export default function TeamMembersManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await fetch('/api/content/teamMembers');
      const data = await response.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMember = () => {
    const newMember: TeamMember = {
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
    };
    setMembers([...members, newMember]);
  };

  const updateMember = (id: string, field: keyof TeamMember, value: string | number) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const deleteMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const moveMember = (index: number, direction: 'up' | 'down') => {
    const newMembers = [...members];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= members.length) return;
    
    [newMembers[index], newMembers[targetIndex]] = [newMembers[targetIndex], newMembers[index]];
    newMembers.forEach((member, i) => member.order = i);
    setMembers(newMembers);
  };

  const saveMembers = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/teamMembers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(members),
      });
      
      if (response.ok) {
        alert('Team members saved successfully!');
      } else {
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {members.length} team member{members.length !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <Button onClick={addMember} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
          <Button onClick={saveMembers} disabled={saving} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">No team members yet</p>
          <Button onClick={addMember} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Team Member
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {members.map((member, index) => (
            <Card key={member.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold">Team Member {index + 1}</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveMember(index, 'up')}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveMember(index, 'down')}
                    disabled={index === members.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={member.name}
                    onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                    placeholder="Full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    value={member.position}
                    onChange={(e) => updateMember(member.id, 'position', e.target.value)}
                    placeholder="Job title"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <ImageUpload
                    label="Profile Photo"
                    value={member.image}
                    onChange={(url) => updateMember(member.id, 'image', url)}
                    recommendedSize={{ width: 400, height: 400 }}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={member.bio}
                    onChange={(e) => updateMember(member.id, 'bio', e.target.value)}
                    placeholder="Short bio"
                    rows={3}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
