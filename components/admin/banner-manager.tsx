"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Save, Eye, EyeOff, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface BannerConfig {
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
  backgroundColor: string;
  textColor: string;
  icon: string;
}

export default function BannerManager() {
  const [config, setConfig] = useState<BannerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/banner');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Failed to load banner config:', error);
      toast.error('Failed to load banner configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        toast.success('Banner configuration saved successfully!');
      } else {
        toast.error('Failed to save banner configuration');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error('Failed to save banner configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!config) {
    return <div className="p-8">Failed to load configuration</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Notification Banner Manager
              </CardTitle>
              <CardDescription>
                Manage the notification bar that appears below the navbar
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.isActive}
                  onCheckedChange={(checked) => setConfig({ ...config, isActive: checked })}
                />
                <Label className="cursor-pointer">
                  {config.isActive ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Eye className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500">
                      <EyeOff className="w-4 h-4" />
                      Inactive
                    </span>
                  )}
                </Label>
              </div>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Preview */}
      {config.isActive && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`bg-gradient-to-r ${config.backgroundColor} ${config.textColor} py-3 px-4 rounded-lg`}>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 animate-pulse" />
                <div>
                  <div className="font-bold text-sm">{config.title.en}</div>
                  <div className="text-xs">{config.message.en}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* English */}
      <Card>
        <CardHeader>
          <CardTitle>🇬🇧 English</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title-en">Title</Label>
            <Input
              id="title-en"
              value={config.title.en}
              onChange={(e) => setConfig({
                ...config,
                title: { ...config.title, en: e.target.value }
              })}
              placeholder="Limited Time Offer!"
            />
          </div>
          <div>
            <Label htmlFor="message-en">Message</Label>
            <Textarea
              id="message-en"
              value={config.message.en}
              onChange={(e) => setConfig({
                ...config,
                message: { ...config.message, en: e.target.value }
              })}
              placeholder="Book by December 31st and save 15%..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Armenian */}
      <Card>
        <CardHeader>
          <CardTitle>🇦🇲 Armenian (Հայերեն)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title-hy">Վերնագիր</Label>
            <Input
              id="title-hy"
              value={config.title.hy}
              onChange={(e) => setConfig({
                ...config,
                title: { ...config.title, hy: e.target.value }
              })}
              placeholder="Սահմանափակ Ժամանակ Առաջարկ!"
            />
          </div>
          <div>
            <Label htmlFor="message-hy">Հաղորդագրություն</Label>
            <Textarea
              id="message-hy"
              value={config.message.hy}
              onChange={(e) => setConfig({
                ...config,
                message: { ...config.message, hy: e.target.value }
              })}
              placeholder="Ամրագրեք մինչև դեկտեմբերի 31-ը..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Russian */}
      <Card>
        <CardHeader>
          <CardTitle>🇷🇺 Russian (Русский)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title-ru">Заголовок</Label>
            <Input
              id="title-ru"
              value={config.title.ru}
              onChange={(e) => setConfig({
                ...config,
                title: { ...config.title, ru: e.target.value }
              })}
              placeholder="Ограниченное Предложение!"
            />
          </div>
          <div>
            <Label htmlFor="message-ru">Сообщение</Label>
            <Textarea
              id="message-ru"
              value={config.message.ru}
              onChange={(e) => setConfig({
                ...config,
                message: { ...config.message, ru: e.target.value }
              })}
              placeholder="Забронируйте до 31 декабря..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Arabic */}
      <Card>
        <CardHeader>
          <CardTitle>🇦🇪 Arabic (العربية)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title-ar">العنوان</Label>
            <Input
              id="title-ar"
              value={config.title.ar}
              onChange={(e) => setConfig({
                ...config,
                title: { ...config.title, ar: e.target.value }
              })}
              placeholder="عرض لفترة محدودة!"
              dir="rtl"
            />
          </div>
          <div>
            <Label htmlFor="message-ar">الرسالة</Label>
            <Textarea
              id="message-ar"
              value={config.message.ar}
              onChange={(e) => setConfig({
                ...config,
                message: { ...config.message, ar: e.target.value }
              })}
              placeholder="احجز قبل 31 ديسمبر..."
              rows={3}
              dir="rtl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
