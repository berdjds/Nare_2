"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Mail, Send, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { getEmailConfig, saveEmailConfig, EmailConfig, validateEmailConfig } from '@/lib/email-config';
import { useToast } from '@/hooks/use-toast';

export default function EmailSettings() {
  const { toast } = useToast();
  const [config, setConfig] = useState<EmailConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const emailConfig = await getEmailConfig();
      setConfig(emailConfig);
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to load email configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    // Validate
    const errors = validateEmailConfig(config);
    if (errors.length > 0) {
      toast({
        title: "⚠️ Validation Error",
        description: errors[0],
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await saveEmailConfig(config);
      
      toast({
        title: "✅ Success",
        description: "Email configuration saved successfully!",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!config) return;

    // Validate first
    const errors = validateEmailConfig(config);
    if (errors.length > 0) {
      toast({
        title: "⚠️ Validation Error",
        description: "Please fix validation errors before testing",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "✅ Test Successful!",
          description: data.message,
          duration: 5000,
        });
      } else {
        toast({
          title: "❌ Test Failed",
          description: data.error || "Could not send test email",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "❌ Connection Error",
        description: error.message || "Failed to test email connection",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const updateConfig = (updates: Partial<EmailConfig>) => {
    if (!config) return;
    setConfig({ ...config, ...updates });
  };

  if (loading) {
    return <div className="text-center py-8">Loading configuration...</div>;
  }

  if (!config) {
    return <div className="text-center py-8 text-red-600">Failed to load configuration</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Mail className="h-8 w-8" />
          Email Configuration
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Configure Office 365 email for automated notifications
        </p>
      </div>

      {/* SMTP Settings */}
      <Card>
        <CardHeader>
          <CardTitle>SMTP Settings</CardTitle>
          <CardDescription>Office 365 email server configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>SMTP Host</Label>
              <Input
                value={config.smtpHost}
                onChange={(e) => updateConfig({ smtpHost: e.target.value })}
                placeholder="smtp.office365.com"
              />
            </div>
            <div className="space-y-2">
              <Label>SMTP Port</Label>
              <Input
                type="number"
                value={config.smtpPort}
                onChange={(e) => updateConfig({ smtpPort: parseInt(e.target.value) })}
                placeholder="587"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sender Email *</Label>
            <Input
              type="email"
              value={config.senderEmail}
              onChange={(e) => updateConfig({ senderEmail: e.target.value })}
              placeholder="info@naretravel.com"
            />
            <p className="text-xs text-gray-500">Your Office 365 email address</p>
          </div>

          <div className="space-y-2">
            <Label>Sender Password *</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={config.senderPassword}
                onChange={(e) => updateConfig({ senderPassword: e.target.value })}
                placeholder="Your email password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">Your Office 365 password or app password</p>
          </div>

          <div className="space-y-2">
            <Label>Sender Name *</Label>
            <Input
              value={config.senderName}
              onChange={(e) => updateConfig({ senderName: e.target.value })}
              placeholder="Nare Travel Team"
            />
            <p className="text-xs text-gray-500">Display name for outgoing emails</p>
          </div>

          <div className="space-y-2">
            <Label>Reply-To Email (Optional)</Label>
            <Input
              type="email"
              value={config.replyToEmail || ''}
              onChange={(e) => updateConfig({ replyToEmail: e.target.value })}
              placeholder="replies@naretravel.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure when and where to send notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Enable Email Notifications</Label>
              <p className="text-sm text-gray-500">Turn on/off all email functionality</p>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(enabled) => updateConfig({ enabled })}
            />
          </div>

          {/* Admin Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Notify Admin on New Inquiry</Label>
              <p className="text-sm text-gray-500">Send email when customer submits inquiry</p>
            </div>
            <Switch
              checked={config.notifyOnNewInquiry}
              onCheckedChange={(notifyOnNewInquiry) => updateConfig({ notifyOnNewInquiry })}
              disabled={!config.enabled}
            />
          </div>

          {config.notifyOnNewInquiry && (
            <div className="space-y-2 ml-6">
              <Label>Admin Email Address *</Label>
              <Input
                type="email"
                value={config.adminEmail}
                onChange={(e) => updateConfig({ adminEmail: e.target.value })}
                placeholder="admin@naretravel.com"
              />
              <p className="text-xs text-gray-500">Where to send admin notifications</p>
            </div>
          )}

          {/* Auto-Reply */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Send Auto-Reply to Customers</Label>
              <p className="text-sm text-gray-500">Automatically confirm receipt of inquiry</p>
            </div>
            <Switch
              checked={config.autoReplyEnabled}
              onCheckedChange={(autoReplyEnabled) => updateConfig({ autoReplyEnabled })}
              disabled={!config.enabled}
            />
          </div>

          {config.autoReplyEnabled && (
            <div className="space-y-2 ml-6">
              <Label>Auto-Reply Message</Label>
              <Textarea
                value={config.autoReplyMessage}
                onChange={(e) => updateConfig({ autoReplyMessage: e.target.value })}
                rows={6}
                placeholder="Thank you for contacting us..."
              />
              <p className="text-xs text-gray-500">
                This message will be sent to customers automatically
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Test & Save Configuration</h3>
              <p className="text-sm text-gray-500">
                Test your email settings before saving
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleTest}
                disabled={testing || !config.enabled}
              >
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Configuration
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-blue-900">Office 365 Setup Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                <li>Use your Office 365 email address (e.g., info@naretravel.com)</li>
                <li>Use SMTP host: smtp.office365.com and port: 587</li>
                <li>If using 2FA, create an app-specific password</li>
                <li>Test the connection before saving</li>
                <li>Check spam folder if test email doesn't arrive</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
