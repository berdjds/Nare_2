"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Save, Key, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    deepseekApiKey: '',
    enableAITranslation: false,
    autoTranslate: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* AI Translation Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold">AI Translation Settings</h3>
            <p className="text-sm text-gray-500">Configure DeepSeek API for automatic translations</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* API Key */}
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              DeepSeek API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={settings.deepseekApiKey}
              onChange={(e) => setSettings({ ...settings, deepseekApiKey: e.target.value })}
              placeholder="sk-..."
            />
            <p className="text-xs text-gray-500">
              Get your API key from{' '}
              <a 
                href="https://platform.deepseek.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                DeepSeek Platform
              </a>
            </p>
          </div>

          {/* Enable AI Translation */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="enableAI" className="text-base">Enable AI Translation</Label>
              <p className="text-sm text-gray-500">
                Show AI translate buttons in content editors
              </p>
            </div>
            <Switch
              id="enableAI"
              checked={settings.enableAITranslation}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, enableAITranslation: checked })
              }
            />
          </div>

          {/* Auto Translate */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="autoTranslate" className="text-base">Auto-Translate New Content</Label>
              <p className="text-sm text-gray-500">
                Automatically translate when you save English content
              </p>
            </div>
            <Switch
              id="autoTranslate"
              checked={settings.autoTranslate}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, autoTranslate: checked })
              }
              disabled={!settings.enableAITranslation}
            />
          </div>

          {/* Info Box */}
          <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">How AI Translation Works:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Enter content in English (default)</li>
                <li>Click "AI Translate" button for Armenian or Russian</li>
                <li>Review and edit translations as needed</li>
                <li>Translations are stored separately for each language</li>
              </ul>
            </div>
          </div>

          {/* Cost Estimate */}
          <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-900">
              <p className="font-medium mb-1">Cost Estimate:</p>
              <p className="text-green-800">
                ~$0.14 per million tokens • Typical tour description (~500 words) ≈ $0.0002
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <Button 
          onClick={saveSettings} 
          disabled={saving}
          size="lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>

        {message && (
          <div className={`flex items-center gap-2 text-sm ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
