"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { ContactInfo } from '@/lib/content-storage';
import { TranslationTabs } from './translation-tabs';
import { useToast } from '@/hooks/use-toast';

export default function ContactInfoManager() {
  const { toast } = useToast();
  const [info, setInfo] = useState<ContactInfo>({
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    telegram: '',
    officeHours: {
      weekdays: '',
      saturday: '',
      sunday: '',
      support: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    try {
      const response = await fetch('/api/content/contactInfo');
      const data = await response.json();
      if (data && Object.keys(data).length > 0) {
        setInfo(data);
      }
    } catch (error) {
      console.error('Failed to load contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInfo = (field: keyof ContactInfo, value: string) => {
    setInfo({ ...info, [field]: value });
  };

  const updateOfficeHours = (field: string, value: string) => {
    setInfo({
      ...info,
      officeHours: {
        ...info.officeHours,
        [field]: value
      }
    });
  };

  const saveInfo = async () => {
    setSaving(true);
    
    // Auto-translate if enabled
    let infoToSave = { ...info };
    try {
      const settingsResponse = await fetch('/api/admin/settings');
      if (settingsResponse.ok) {
        const settings = await settingsResponse.json();
        
        if (settings.autoTranslate && settings.enableAITranslation) {
          // Translate address
          if (info.address && !info.addressHy) {
            const hyResponse = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: info.address, targetLanguage: 'hy', context: 'Contact address' })
            });
            if (hyResponse.ok) {
              const data = await hyResponse.json();
              infoToSave.addressHy = data.translatedText;
            }
          }
          
          if (info.address && !info.addressRu) {
            const ruResponse = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: info.address, targetLanguage: 'ru', context: 'Contact address' })
            });
            if (ruResponse.ok) {
              const data = await ruResponse.json();
              infoToSave.addressRu = data.translatedText;
            }
          }
          
          if (info.address && !info.addressAr) {
            const arResponse = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: info.address, targetLanguage: 'ar', context: 'Contact address' })
            });
            if (arResponse.ok) {
              const data = await arResponse.json();
              infoToSave.addressAr = data.translatedText;
            }
          }
          
          // Translate office hours if they exist
          if (info.officeHours) {
            if (info.officeHours.weekdays && !info.officeHours.weekdaysHy) {
              const hyResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: info.officeHours.weekdays, targetLanguage: 'hy', context: 'Office hours weekdays' })
              });
              if (hyResponse.ok) {
                const data = await hyResponse.json();
                infoToSave.officeHours = { ...infoToSave.officeHours, weekdaysHy: data.translatedText };
              }
            }
            
            if (info.officeHours.weekdays && !info.officeHours.weekdaysRu) {
              const ruResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: info.officeHours.weekdays, targetLanguage: 'ru', context: 'Office hours weekdays' })
              });
              if (ruResponse.ok) {
                const data = await ruResponse.json();
                infoToSave.officeHours = { ...infoToSave.officeHours, weekdaysRu: data.translatedText };
              }
            }
            
            if (info.officeHours.weekdays && !info.officeHours.weekdaysAr) {
              const arResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: info.officeHours.weekdays, targetLanguage: 'ar', context: 'Office hours weekdays' })
              });
              if (arResponse.ok) {
                const data = await arResponse.json();
                infoToSave.officeHours = { ...infoToSave.officeHours, weekdaysAr: data.translatedText };
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Auto-translate error:', error);
    }
    
    try {
      const response = await fetch('/api/content/contactInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(infoToSave),
      });
      
      if (response.ok) {
        setInfo(infoToSave);
        toast({
          title: "✅ Success",
          description: "Contact information saved successfully!",
          duration: 5000,
        });
      } else {
        toast({
          title: "❌ Error",
          description: "Failed to save contact info",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Error saving contact info",
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
        <h2 className="text-3xl font-bold text-gray-900">Contact Information</h2>
        <p className="text-gray-500 text-sm mt-2">
          Manage your business contact details and communication channels
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input
            value={info.phone}
            onChange={(e) => updateInfo('phone', e.target.value)}
            placeholder="+374 XX XXX XXX"
          />
        </div>

        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input
            type="email"
            value={info.email}
            onChange={(e) => updateInfo('email', e.target.value)}
            placeholder="info@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label>WhatsApp Number</Label>
          <Input
            value={info.whatsapp}
            onChange={(e) => updateInfo('whatsapp', e.target.value)}
            placeholder="+374 XX XXX XXX"
          />
        </div>

        <div className="space-y-2">
          <Label>Telegram Username</Label>
          <Input
            value={info.telegram}
            onChange={(e) => updateInfo('telegram', e.target.value)}
            placeholder="@username"
          />
        </div>

        <div className="space-y-2">
          <Label>Secondary Phone (Optional)</Label>
          <Input
            value={info.phone2 || ''}
            onChange={(e) => updateInfo('phone2', e.target.value)}
            placeholder="+374 XX XXX XXX"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <TranslationTabs
            fieldName="Address"
            englishValue={info.address}
            armenianValue={info.addressHy}
            russianValue={info.addressRu}
            arabicValue={info.addressAr || ''}
            onEnglishChange={(value) => updateInfo('address', value)}
            onArmenianChange={(value) => updateInfo('addressHy', value)}
            onRussianChange={(value) => updateInfo('addressRu', value)}
            onArabicChange={(value) => updateInfo('addressAr', value)}
            context="Physical office address"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Address URL (Google Maps Link)</Label>
          <Input
            value={info.addressUrl || ''}
            onChange={(e) => updateInfo('addressUrl', e.target.value)}
            placeholder="https://maps.app.goo.gl/FFw2DGHe7Q5d4onW8"
          />
          <p className="text-xs text-gray-500">
            For clickable address - Get from "Share" in Google Maps
          </p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Google Maps Embed URL</Label>
          <Input
            value={info.mapEmbedUrl || ''}
            onChange={(e) => updateInfo('mapEmbedUrl', e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
          <p className="text-xs text-gray-500">
            For map display - Get from "Share" → "Embed a map" in Google Maps
          </p>
        </div>
      </div>

      {/* Office Section */}
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold">Office Location Information</h3>
        <p className="text-sm text-gray-500">This content will appear on the Contact page</p>
        
        <div className="space-y-6">
          <TranslationTabs
            fieldName="Office Title"
            englishValue={info.officeTitle || ''}
            armenianValue={info.officeTitleHy || ''}
            russianValue={info.officeTitleRu || ''}
            arabicValue={info.officeTitleAr || ''}
            onEnglishChange={(value) => updateInfo('officeTitle', value)}
            onArmenianChange={(value) => updateInfo('officeTitleHy', value)}
            onRussianChange={(value) => updateInfo('officeTitleRu', value)}
            onArabicChange={(value) => updateInfo('officeTitleAr', value)}
            context="Office section title (e.g., 'Our Office')"
          />

          <TranslationTabs
            fieldName="Office Description"
            englishValue={info.officeDescription || ''}
            armenianValue={info.officeDescriptionHy || ''}
            russianValue={info.officeDescriptionRu || ''}
            arabicValue={info.officeDescriptionAr || ''}
            onEnglishChange={(value) => updateInfo('officeDescription', value)}
            onArmenianChange={(value) => updateInfo('officeDescriptionHy', value)}
            onRussianChange={(value) => updateInfo('officeDescriptionRu', value)}
            onArabicChange={(value) => updateInfo('officeDescriptionAr', value)}
            context="Office location description"
          />
        </div>
      </div>

      {/* Office Hours Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Office Hours</h3>
        <div className="space-y-6">
          <TranslationTabs
            fieldName="Weekdays"
            englishValue={info.officeHours?.weekdays || ''}
            armenianValue={info.officeHours?.weekdaysHy || ''}
            russianValue={info.officeHours?.weekdaysRu || ''}
            arabicValue={info.officeHours?.weekdaysAr || ''}
            onEnglishChange={(value) => updateOfficeHours('weekdays', value)}
            onArmenianChange={(value) => updateOfficeHours('weekdaysHy', value)}
            onRussianChange={(value) => updateOfficeHours('weekdaysRu', value)}
            onArabicChange={(value) => updateOfficeHours('weekdaysAr', value)}
            context="Office hours for weekdays"
          />

          <TranslationTabs
            fieldName="Saturday"
            englishValue={info.officeHours?.saturday || ''}
            armenianValue={info.officeHours?.saturdayHy || ''}
            russianValue={info.officeHours?.saturdayRu || ''}
            arabicValue={info.officeHours?.saturdayAr || ''}
            onEnglishChange={(value) => updateOfficeHours('saturday', value)}
            onArmenianChange={(value) => updateOfficeHours('saturdayHy', value)}
            onRussianChange={(value) => updateOfficeHours('saturdayRu', value)}
            onArabicChange={(value) => updateOfficeHours('saturdayAr', value)}
            context="Office hours for Saturday"
          />

          <TranslationTabs
            fieldName="Sunday"
            englishValue={info.officeHours?.sunday || ''}
            armenianValue={info.officeHours?.sundayHy || ''}
            russianValue={info.officeHours?.sundayRu || ''}
            arabicValue={info.officeHours?.sundayAr || ''}
            onEnglishChange={(value) => updateOfficeHours('sunday', value)}
            onArmenianChange={(value) => updateOfficeHours('sundayHy', value)}
            onRussianChange={(value) => updateOfficeHours('sundayRu', value)}
            onArabicChange={(value) => updateOfficeHours('sundayAr', value)}
            context="Office hours for Sunday"
          />

          <TranslationTabs
            fieldName="Support Hours"
            englishValue={info.officeHours?.support || ''}
            armenianValue={info.officeHours?.supportHy || ''}
            russianValue={info.officeHours?.supportRu || ''}
            arabicValue={info.officeHours?.supportAr || ''}
            onEnglishChange={(value) => updateOfficeHours('support', value)}
            onArmenianChange={(value) => updateOfficeHours('supportHy', value)}
            onRussianChange={(value) => updateOfficeHours('supportRu', value)}
            onArabicChange={(value) => updateOfficeHours('supportAr', value)}
            context="Customer support hours"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={saveInfo} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Contact Info'}
        </Button>
      </div>
        </CardContent>
      </Card>
    </div>
  );
}
