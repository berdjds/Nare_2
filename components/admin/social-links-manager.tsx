"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { SocialLinks } from '@/lib/content-storage';
import { useToast } from '@/hooks/use-toast';

export default function SocialLinksManager() {
  const { toast } = useToast();
  const [links, setLinks] = useState<SocialLinks>({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const response = await fetch('/api/content/socialLinks');
      const data = await response.json();
      if (data && Object.keys(data).length > 0) {
        setLinks(data);
      }
    } catch (error) {
      console.error('Failed to load social links:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLink = (field: keyof SocialLinks, value: string) => {
    setLinks({ ...links, [field]: value });
  };

  const saveLinks = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/socialLinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(links),
      });
      
      if (response.ok) {
        toast({
          title: "✅ Success",
          description: "Social links saved successfully!",
          duration: 5000,
        });
      } else {
        toast({
          title: "❌ Error",
          description: "Failed to save social links",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Error saving social links",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Social Media Links</h2>
        <p className="text-gray-500 text-sm mt-2">
          Manage your social media profiles and online presence
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            Facebook
          </Label>
          <Input
            value={links.facebook}
            onChange={(e) => updateLink('facebook', e.target.value)}
            placeholder="https://facebook.com/yourpage"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Instagram
          </Label>
          <Input
            value={links.instagram}
            onChange={(e) => updateLink('instagram', e.target.value)}
            placeholder="https://instagram.com/yourpage"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            Twitter / X
          </Label>
          <Input
            value={links.twitter}
            onChange={(e) => updateLink('twitter', e.target.value)}
            placeholder="https://twitter.com/yourpage"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Label>
          <Input
            value={links.linkedin}
            onChange={(e) => updateLink('linkedin', e.target.value)}
            placeholder="https://linkedin.com/company/yourpage"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Youtube className="h-4 w-4" />
            YouTube
          </Label>
          <Input
            value={links.youtube}
            onChange={(e) => updateLink('youtube', e.target.value)}
            placeholder="https://youtube.com/@yourpage"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={saveLinks} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Social Links'}
        </Button>
      </div>
        </CardContent>
      </Card>
    </div>
  );
}
