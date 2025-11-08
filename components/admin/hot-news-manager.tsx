"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Eye, EyeOff, Globe, Zap, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface HotNewsBanner {
  id: string;
  isActive: boolean;
  title: {
    en: string;
    hy: string;
    ru: string;
    ar: string;
  };
  message: {
    en: string;
    hy: string;
    ru: string;
    ar: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function HotNewsManager() {
  const [banners, setBanners] = useState<HotNewsBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedBanner, setSelectedBanner] = useState<HotNewsBanner | null>(null);
  
  const [formData, setFormData] = useState({
    isActive: true,
    title: { en: '', hy: '', ru: '', ar: '' },
    message: { en: '', hy: '', ru: '', ar: '' },
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await fetch('/api/hot-news');
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (error) {
      console.error('Failed to load hot news:', error);
      toast.error('Failed to load hot news');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      isActive: true,
      title: { en: '', hy: '', ru: '', ar: '' },
      message: { en: '', hy: '', ru: '', ar: '' },
    });
    setSelectedBanner(null);
  };

  const translateBanner = async (targetLang: 'hy' | 'ru' | 'ar') => {
    if (!formData.title.en || !formData.message.en) {
      toast.error('Please fill English title and message first');
      return;
    }

    setTranslating(true);
    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Title: ${formData.title.en}\nMessage: ${formData.message.en}`,
          targetLang,
        }),
      });

      if (!response.ok) throw new Error('Translation failed');

      const data = await response.json();
      const lines = data.translatedText.split('\n');
      const translatedTitle = lines[0].replace('Title: ', '').replace(/^[^:]+:\s*/, '');
      const translatedMessage = lines.slice(1).join('\n').replace('Message: ', '').replace(/^[^:]+:\s*/, '').trim();

      setFormData({
        ...formData,
        title: { ...formData.title, [targetLang]: translatedTitle },
        message: { ...formData.message, [targetLang]: translatedMessage },
      });

      const langNames = { hy: 'Armenian', ru: 'Russian', ar: 'Arabic' };
      toast.success(`Translated to ${langNames[targetLang]}!`);
    } catch (error: any) {
      console.error('Error translating:', error);
      toast.error(error.message || 'Failed to translate');
    } finally {
      setTranslating(false);
    }
  };

  const saveBanner = async () => {
    if (!formData.title.en || !formData.message.en) {
      toast.error('Please fill English title and message');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/hot-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      toast.success('Hot news created successfully!');
      await loadBanners();
      setMode('list');
      resetForm();
    } catch (error: any) {
      console.error('Error saving hot news:', error);
      toast.error(error.message || 'Failed to save hot news');
    } finally {
      setSaving(false);
    }
  };

  const editBanner = (banner: HotNewsBanner) => {
    setFormData({
      isActive: banner.isActive,
      title: banner.title,
      message: banner.message,
    });
    setSelectedBanner(banner);
    setMode('edit');
  };

  const updateBanner = async () => {
    if (!selectedBanner) {
      toast.error('No banner selected');
      return;
    }

    if (!formData.title.en || !formData.message.en) {
      toast.error('Please fill English title and message');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/hot-news/${selectedBanner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      toast.success('Hot news updated successfully!');
      await loadBanners();
      setMode('list');
      resetForm();
    } catch (error: any) {
      console.error('Error updating hot news:', error);
      toast.error(error.message || 'Failed to update hot news');
    } finally {
      setSaving(false);
    }
  };

  const toggleBanner = async (banner: HotNewsBanner) => {
    try {
      const response = await fetch(`/api/hot-news/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...banner, isActive: !banner.isActive }),
      });

      if (!response.ok) throw new Error('Failed to toggle banner');

      toast.success(`Banner ${!banner.isActive ? 'enabled' : 'disabled'}!`);
      await loadBanners();
    } catch (error) {
      console.error('Error toggling banner:', error);
      toast.error('Failed to toggle banner');
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hot news banner?')) return;

    try {
      const response = await fetch(`/api/hot-news/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete banner');

      toast.success('Hot news deleted successfully!');
      await loadBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete hot news');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">Loading hot news...</div>
        </CardContent>
      </Card>
    );
  }

  if (mode === 'list') {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hot News Banners</CardTitle>
          <Button onClick={() => setMode('create')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {banners.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Zap className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No hot news banners yet. Create one!</p>
              </div>
            ) : (
              banners.map((banner) => (
                <div key={banner.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold">{banner.title.en}</h4>
                      <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{banner.message.en}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Updated: {new Date(banner.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleBanner(banner)}
                    >
                      {banner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editBanner(banner)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteBanner(banner.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{mode === 'create' ? 'Create Hot News' : 'Edit Hot News'}</CardTitle>
        <Button variant="ghost" onClick={() => { setMode('list'); resetForm(); }}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label htmlFor="active">Banner Status</Label>
            <p className="text-sm text-gray-500">Enable or disable this banner</p>
          </div>
          <Switch
            id="active"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
        </div>

        {/* Language Tabs */}
        <Tabs defaultValue="en" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="hy">Armenian</TabsTrigger>
            <TabsTrigger value="ru">Russian</TabsTrigger>
            <TabsTrigger value="ar">Arabic</TabsTrigger>
          </TabsList>

          {(['en', 'hy', 'ru', 'ar'] as const).map((lang) => (
            <TabsContent key={lang} value={lang} className="space-y-4">
              {lang !== 'en' && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => translateBanner(lang)}
                    disabled={translating || !formData.title.en}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {translating ? 'Translating...' : `AI Translate to ${lang.toUpperCase()}`}
                  </Button>
                </div>
              )}
              
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title[lang]}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, [lang]: e.target.value }
                  })}
                  placeholder="Limited Time Offer!"
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              
              <div>
                <Label>Message</Label>
                <Textarea
                  value={formData.message[lang]}
                  onChange={(e) => setFormData({
                    ...formData,
                    message: { ...formData.message, [lang]: e.target.value }
                  })}
                  placeholder="Book by December 31st and save 15%"
                  rows={3}
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => { setMode('list'); resetForm(); }} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={mode === 'create' ? saveBanner : updateBanner} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : (mode === 'create' ? 'Create' : 'Update')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
