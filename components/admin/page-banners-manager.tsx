"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';
import { PageBanner } from '@/lib/content-storage';
import { ImageUpload } from './image-upload';
import { TranslationTabs } from './translation-tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

/**
 * AUTOMATIC PAGE DETECTION
 * Pages are automatically detected from existing banners + predefined pages
 * No need to manually update this list when adding new pages!
 */
const PREDEFINED_PAGES = [
  { id: 'about', label: 'About Us' },
  { id: 'contact', label: 'Contact' },
  { id: 'services', label: 'Services' },
  { id: 'outgoing-packages', label: 'Outgoing Packages' },
  { id: 'air-tickets', label: 'Air Tickets' },
  { id: 'visa-assistance', label: 'Visa Assistance' },
  { id: 'insights', label: 'Travel Insights' },
  { id: 'insights-detail', label: 'Insights Detail' },
  { id: 'armenia-tours', label: 'Armenia Tours' },
  { id: 'armenia-tours-daily', label: 'Daily Tours' },
  { id: 'armenia-tours-cultural', label: 'Cultural Tours' },
  { id: 'armenia-tours-adventure', label: 'Adventure Tours' },
  { id: 'b2b', label: 'B2B Services' },
  { id: 'b2b-dmc', label: 'DMC Services' },
  { id: 'b2b-mice', label: 'MICE Services' },
];

/**
 * Generate page label from pageId
 * Converts 'armenia-tours-daily' -> 'Armenia Tours Daily'
 */
function generatePageLabel(pageId: string): string {
  return pageId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get all unique pages (predefined + existing banners)
 * Automatically includes any pageId found in banners
 */
function getAllPageOptions(existingBanners: PageBanner[]) {
  const predefinedMap = new Map(PREDEFINED_PAGES.map(p => [p.id, p.label]));
  
  // Add any pageIds from existing banners that aren't predefined
  existingBanners.forEach(banner => {
    if (!predefinedMap.has(banner.pageId)) {
      predefinedMap.set(banner.pageId, generatePageLabel(banner.pageId));
    }
  });
  
  // Convert back to array and sort
  return Array.from(predefinedMap.entries())
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export default function PageBannersManager() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<PageBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<PageBanner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await fetch('/api/content/pageBanners');
      const data = await response.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load page banners:', error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const saveBanners = async (updatedBanners: PageBanner[]) => {
    try {
      const response = await fetch('/api/content/pageBanners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBanners),
      });

      if (!response.ok) throw new Error('Failed to save');

      setBanners(updatedBanners);
      toast({
        title: "✅ Success",
        description: "Page banners saved successfully!",
        duration: 5000,
      });
    } catch (error) {
      console.error('Failed to save page banners:', error);
      toast({
        title: "❌ Error",
        description: "Failed to save page banners",
        variant: "destructive",
      });
    }
  };

  const createNewBanner = (): PageBanner => ({
    id: Date.now().toString(),
    pageId: '',
    title: '',
    titleHy: '',
    titleRu: '',
    subtitle: '',
    subtitleHy: '',
    subtitleRu: '',
    backgroundImage: '',
    isActive: true,
  });

  const handleAddBanner = () => {
    setEditingBanner(createNewBanner());
    setIsDialogOpen(true);
  };

  const handleEditBanner = (banner: PageBanner) => {
    setEditingBanner(banner);
    setIsDialogOpen(true);
  };

  const handleToggleActive = (id: string) => {
    const updated = banners.map(b =>
      b.id === id ? { ...b, isActive: !b.isActive } : b
    );
    saveBanners(updated);
  };

  const handleSave = async (banner: PageBanner) => {
    const existingIndex = banners.findIndex(b => b.id === banner.id);
    let updated: PageBanner[];
    
    if (existingIndex >= 0) {
      updated = [...banners];
      updated[existingIndex] = banner;
    } else {
      updated = [...banners, banner];
    }
    
    await saveBanners(updated);
    setIsDialogOpen(false);
    setEditingBanner(null);
  };

  if (loading) {
    return <div className="p-8">Loading page banners...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Page Banners
            <Badge variant="secondary" className="text-sm">
              {banners.length} {banners.length === 1 ? 'Banner' : 'Banners'}
            </Badge>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Manage hero sections and banners for all pages
          </p>
        </div>
        <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow" onClick={handleAddBanner}>
          <Plus className="w-5 h-5 mr-2" />
          Add New Banner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{banners.length}</div>
            <div className="text-sm text-gray-500">Total Banners</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {banners.filter(b => b.isActive).length}
            </div>
            <div className="text-sm text-gray-500">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-400">
              {banners.filter(b => !b.isActive).length}
            </div>
            <div className="text-sm text-gray-500">Inactive</div>
          </CardContent>
        </Card>
      </div>

      {/* Banner List */}
      <div className="grid gap-4">
        {banners.map((banner) => (
          <Card key={banner.id} className={!banner.isActive ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Image Preview */}
                <div className="w-48 h-32 bg-gray-100 rounded flex-shrink-0 overflow-hidden relative">
                  {banner.backgroundImage ? (
                    <Image src={banner.backgroundImage} alt={banner.title} fill className="object-cover" sizes="192px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {getAllPageOptions(banners).find(p => p.id === banner.pageId)?.label || banner.pageId}
                        </span>
                      </div>                      <h4 className="font-semibold text-lg">{banner.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{banner.subtitle}</p>
                      
                      {/* Translation Status */}
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs text-gray-500">Translations:</span>
                        <span className="text-xs">🇬🇧 {banner.title ? '✓' : '○'}</span>
                        <span className="text-xs">🇦🇲 {banner.titleHy ? '✓' : '○'}</span>
                        <span className="text-xs">🇷🇺 {banner.titleRu ? '✓' : '○'}</span>
                        <span className="text-xs">🇦🇪 {banner.titleAr ? '✓' : '○'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(banner.id)}
                      >
                        {banner.isActive ? (
                          <><Eye className="w-4 h-4 mr-1" /> Active</>
                        ) : (
                          <><EyeOff className="w-4 h-4 mr-1" /> Inactive</>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditBanner(banner)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No page banners yet. Click "Add New Banner" to create one.
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBanner?.id ? 'Edit Banner' : 'Add New Page Banner'}
            </DialogTitle>
          </DialogHeader>
          {editingBanner && (
            <BannerForm
              banner={editingBanner}
              allBanners={banners}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingBanner(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Banner Form Component
interface BannerFormProps {
  banner: PageBanner;
  allBanners: PageBanner[];
  onSave: (banner: PageBanner) => void;
  onCancel: () => void;
}

function BannerForm({ banner: initialBanner, allBanners, onSave, onCancel }: BannerFormProps) {
  const [banner, setBanner] = useState(initialBanner);
  const [autoTranslating, setAutoTranslating] = useState(false);
  const { toast } = useToast();

  const updateField = (field: keyof PageBanner, value: any) => {
    setBanner({ ...banner, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner.pageId || !banner.title || !banner.subtitle) {
      toast({
        title: "⚠️ Validation Error",
        description: "Please fill in page, title, and subtitle",
        variant: "destructive",
      });
      return;
    }

    // Auto-translate if enabled
    try {
      const settingsResponse = await fetch('/api/admin/settings');
      if (settingsResponse.ok) {
        const settings = await settingsResponse.json();
        
        if (settings.autoTranslate && settings.enableAITranslation) {
          setAutoTranslating(true);
          const updatedBanner = { ...banner };
          
          try {
            // Translate title
            if (banner.title && !banner.titleHy) {
              const hyResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: banner.title, targetLanguage: 'hy', context: 'Page banner title' })
              });
              if (hyResponse.ok) {
                const data = await hyResponse.json();
                updatedBanner.titleHy = data.translatedText;
              }
            }
            
            if (banner.title && !banner.titleRu) {
              const ruResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: banner.title, targetLanguage: 'ru', context: 'Page banner title' })
              });
              if (ruResponse.ok) {
                const data = await ruResponse.json();
                updatedBanner.titleRu = data.translatedText;
              }
            }
            
            if (banner.title && !banner.titleAr) {
              const arResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: banner.title, targetLanguage: 'ar', context: 'Page banner title' })
              });
              if (arResponse.ok) {
                const data = await arResponse.json();
                updatedBanner.titleAr = data.translatedText;
              }
            }
            
            // Translate subtitle
            if (banner.subtitle && !banner.subtitleHy) {
              const hyResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: banner.subtitle, targetLanguage: 'hy', context: 'Page banner subtitle' })
              });
              if (hyResponse.ok) {
                const data = await hyResponse.json();
                updatedBanner.subtitleHy = data.translatedText;
              }
            }
            
            if (banner.subtitle && !banner.subtitleRu) {
              const ruResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: banner.subtitle, targetLanguage: 'ru', context: 'Page banner subtitle' })
              });
              if (ruResponse.ok) {
                const data = await ruResponse.json();
                updatedBanner.subtitleRu = data.translatedText;
              }
            }
            
            if (banner.subtitle && !banner.subtitleAr) {
              const arResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: banner.subtitle, targetLanguage: 'ar', context: 'Page banner subtitle' })
              });
              if (arResponse.ok) {
                const data = await arResponse.json();
                updatedBanner.subtitleAr = data.translatedText;
              }
            }
          } catch (error) {
            console.error('Auto-translate error:', error);
          } finally {
            setAutoTranslating(false);
          }
          
          onSave(updatedBanner);
          return;
        }
      }
    } catch (error) {
      console.error('Settings check error:', error);
    }

    onSave(banner);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Page Selection */}
      <div className="space-y-2">
        <Label>Page</Label>
        <Select 
          value={banner.pageId} 
          onValueChange={(value) => updateField('pageId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a page" />
          </SelectTrigger>
          <SelectContent>
            {getAllPageOptions(allBanners).map(option => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Title with Translation */}
      <TranslationTabs
        fieldName="Title"
        englishValue={banner.title}
        armenianValue={banner.titleHy}
        russianValue={banner.titleRu}
        arabicValue={banner.titleAr}
        onEnglishChange={(value) => updateField('title', value)}
        onArmenianChange={(value) => updateField('titleHy', value)}
        onRussianChange={(value) => updateField('titleRu', value)}
        onArabicChange={(value) => updateField('titleAr', value)}
        context="Page hero title"
      />

      {/* Subtitle with Translation */}
      <TranslationTabs
        fieldName="Subtitle"
        englishValue={banner.subtitle}
        armenianValue={banner.subtitleHy}
        russianValue={banner.subtitleRu}
        arabicValue={banner.subtitleAr}
        onEnglishChange={(value) => updateField('subtitle', value)}
        onArmenianChange={(value) => updateField('subtitleHy', value)}
        onRussianChange={(value) => updateField('subtitleRu', value)}
        onArabicChange={(value) => updateField('subtitleAr', value)}
        multiline
        rows={3}
        context="Page hero subtitle/description"
      />

      {/* Background Image Upload */}
      <ImageUpload
        label="Background Image"
        value={banner.backgroundImage}
        onChange={(url) => updateField('backgroundImage', url)}
        recommendedSize={{ width: 1920, height: 600 }}
      />

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={autoTranslating}>
          Cancel
        </Button>
        <Button type="submit" disabled={autoTranslating}>
          {autoTranslating ? 'Auto-translating...' : 'Save Banner'}
        </Button>
      </div>
    </form>
  );
}
