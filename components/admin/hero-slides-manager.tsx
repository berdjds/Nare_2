"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, MoveUp, MoveDown } from 'lucide-react';
import { HeroSlide } from '@/lib/content-storage';
import { ImageUpload } from './image-upload';
import { TranslationTabs } from './translation-tabs';
import { useToast } from '@/hooks/use-toast';

export default function HeroSlidesManager() {
  const { toast } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [filteredSlides, setFilteredSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSlides();
  }, []);

  useEffect(() => {
    filterSlides();
  }, [slides, searchQuery]);

  const loadSlides = async () => {
    try {
      const response = await fetch('/api/content/heroSlides');
      const data = await response.json();
      const sortedSlides = Array.isArray(data) 
        ? data.sort((a, b) => (a.order || 0) - (b.order || 0))
        : [];
      setSlides(sortedSlides);
    } catch (error) {
      console.error('Failed to load slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSlides = () => {
    let filtered = slides;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(slide => 
        slide.title.toLowerCase().includes(query) ||
        slide.description.toLowerCase().includes(query)
      );
    }

    setFilteredSlides(filtered);
  };

  const createNewSlide = (): HeroSlide => ({
    id: Date.now().toString(),
    title: '',
    titleHy: '',
    titleRu: '',
    description: '',
    descriptionHy: '',
    descriptionRu: '',
    backgroundImage: '',
    cardImage: '',
    order: slides.length,
    isActive: true,
  });

  const handleCreate = async (newSlide: HeroSlide) => {
    const updatedSlides = [...slides, newSlide];
    setSlides(updatedSlides);
    await saveSlides(updatedSlides);
    toast({
      title: "✅ Success",
      description: "Hero slide created successfully!",
      duration: 5000,
    });
    setIsCreateDialogOpen(false);
  };

  const handleUpdate = async (updatedSlide: HeroSlide) => {
    const updatedSlides = slides.map(slide => 
      slide.id === updatedSlide.id ? updatedSlide : slide
    );
    setSlides(updatedSlides);
    await saveSlides(updatedSlides);
    toast({
      title: "✅ Success",
      description: "Hero slide updated successfully!",
      duration: 5000,
    });
    setIsEditDialogOpen(false);
    setEditingSlide(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;
    
    const updatedSlides = slides.filter(slide => slide.id !== id);
    // Reorder remaining slides
    updatedSlides.forEach((slide, index) => slide.order = index);
    setSlides(updatedSlides);
    await saveSlides(updatedSlides);
  };

  const toggleActive = async (id: string) => {
    const updatedSlides = slides.map(slide => 
      slide.id === id ? { ...slide, isActive: !slide.isActive } : slide
    );
    setSlides(updatedSlides);
    await saveSlides(updatedSlides);
  };

  const moveSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    
    const newSlides = [...slides];
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    
    // Update order values
    newSlides.forEach((slide, i) => slide.order = i);
    
    setSlides(newSlides);
    await saveSlides(newSlides);
  };

  const saveSlides = async (slidesToSave: HeroSlide[]) => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/heroSlides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slidesToSave),
      });
      
      if (!response.ok) {
        toast({
          title: "❌ Error",
          description: "Failed to save slides",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Error saving slides",
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Hero Section Slides
            <Badge variant="secondary" className="text-sm">
              {slides.length} {slides.length === 1 ? 'Slide' : 'Slides'}
            </Badge>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Manage the main hero carousel slides displayed on your homepage
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">
              <Plus className="h-5 w-5 mr-2" />
              Add New Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Hero Slide</DialogTitle>
            </DialogHeader>
            <SlideForm 
              slide={createNewSlide()} 
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
          placeholder="Search slides by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 text-base"
        />
      </div>

      {/* Slides List */}
      {filteredSlides.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'No slides match your search' : 'No hero slides yet'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Slide
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSlides.map((slide, index) => (
            <Card key={slide.id} className={slide.isActive === false ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Slide Preview */}
                  <div className="relative w-64 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {slide.backgroundImage ? (
                      <Image 
                        src={slide.backgroundImage} 
                        alt={slide.title}
                        fill
                        className="object-cover"
                        sizes="256px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Background
                      </div>
                    )}
                    {slide.cardImage && (
                      <div className="absolute bottom-2 right-2 w-16 h-20 rounded border-2 border-white overflow-hidden">
                        <Image 
                          src={slide.cardImage} 
                          alt="Card"
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    )}
                  </div>

                  {/* Slide Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Position {index + 1}</Badge>
                          {slide.isActive === false && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold mt-2">
                          {slide.title || 'Untitled Slide'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {slide.description || 'No description'}
                        </p>
                      </div>
                    </div>

                    {/* Translation Status */}
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs text-gray-500">Translations:</span>
                      <span className="text-xs">🇬🇧 {slide.title ? '✓' : '○'}</span>
                      <span className="text-xs">🇦🇲 {slide.titleHy ? '✓' : '○'}</span>
                      <span className="text-xs">🇷🇺 {slide.titleRu ? '✓' : '○'}</span>
                      <span className="text-xs">🇦🇪 {slide.titleAr ? '✓' : '○'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveSlide(index, 'up')}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveSlide(index, 'down')}
                        disabled={index === filteredSlides.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingSlide(slide);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(slide.id)}
                    >
                      {slide.isActive !== false ? (
                        <><EyeOff className="h-4 w-4 mr-1" /> Hide</>
                      ) : (
                        <><Eye className="h-4 w-4 mr-1" /> Show</>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(slide.id)}
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
      {editingSlide && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Hero Slide</DialogTitle>
            </DialogHeader>
            <SlideForm 
              slide={editingSlide} 
              onSave={handleUpdate}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingSlide(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Slide Form Component
interface SlideFormProps {
  slide: HeroSlide;
  onSave: (slide: HeroSlide) => void;
  onCancel: () => void;
}

function SlideForm({ slide: initialSlide, onSave, onCancel }: SlideFormProps) {
  const { toast } = useToast();
  const [slide, setSlide] = useState(initialSlide);
  const [autoTranslating, setAutoTranslating] = useState(false);

  const updateField = (field: keyof HeroSlide, value: any) => {
    setSlide({ ...slide, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slide.title || !slide.description) {
      toast({
        title: "⚠️ Validation Error",
        description: "Please fill in at least the English title and description",
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
          const updatedSlide = { ...slide };
          
          try {
            if (slide.title && !slide.titleHy) {
              const hyResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: slide.title, targetLanguage: 'hy', context: 'Hero slide title' })
              });
              if (hyResponse.ok) {
                const data = await hyResponse.json();
                updatedSlide.titleHy = data.translatedText;
              }
            }
            
            if (slide.title && !slide.titleRu) {
              const ruResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: slide.title, targetLanguage: 'ru', context: 'Hero slide title' })
              });
              if (ruResponse.ok) {
                const data = await ruResponse.json();
                updatedSlide.titleRu = data.translatedText;
              }
            }
            
            if (slide.description && !slide.descriptionHy) {
              const hyResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: slide.description, targetLanguage: 'hy', context: 'Hero slide description' })
              });
              if (hyResponse.ok) {
                const data = await hyResponse.json();
                updatedSlide.descriptionHy = data.translatedText;
              }
            }
            
            if (slide.description && !slide.descriptionRu) {
              const ruResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: slide.description, targetLanguage: 'ru', context: 'Hero slide description' })
              });
              if (ruResponse.ok) {
                const data = await ruResponse.json();
                updatedSlide.descriptionRu = data.translatedText;
              }
            }
            
            // Arabic translations
            if (slide.title && !slide.titleAr) {
              const arResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: slide.title, targetLanguage: 'ar', context: 'Hero slide title' })
              });
              if (arResponse.ok) {
                const data = await arResponse.json();
                updatedSlide.titleAr = data.translatedText;
              }
            }
            
            if (slide.description && !slide.descriptionAr) {
              const arResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: slide.description, targetLanguage: 'ar', context: 'Hero slide description' })
              });
              if (arResponse.ok) {
                const data = await arResponse.json();
                updatedSlide.descriptionAr = data.translatedText;
              }
            }
          } catch (error) {
            console.error('Auto-translate error:', error);
          } finally {
            setAutoTranslating(false);
          }
          
          onSave(updatedSlide);
          return;
        }
      }
    } catch (error) {
      console.error('Settings check error:', error);
    }

    onSave(slide);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title with Translation */}
      <TranslationTabs
        fieldName="Title"
        englishValue={slide.title}
        armenianValue={slide.titleHy}
        russianValue={slide.titleRu}
        arabicValue={slide.titleAr || ''}
        onEnglishChange={(value) => updateField('title', value)}
        onArmenianChange={(value) => updateField('titleHy', value)}
        onRussianChange={(value) => updateField('titleRu', value)}
        onArabicChange={(value) => updateField('titleAr', value)}
        context="Hero slide title for main homepage banner"
        enableAIAssist={true}
      />

      {/* Description with Translation */}
      <TranslationTabs
        fieldName="Description"
        englishValue={slide.description}
        armenianValue={slide.descriptionHy}
        russianValue={slide.descriptionRu}
        arabicValue={slide.descriptionAr || ''}
        onEnglishChange={(value) => updateField('description', value)}
        onArmenianChange={(value) => updateField('descriptionHy', value)}
        onRussianChange={(value) => updateField('descriptionRu', value)}
        onArabicChange={(value) => updateField('descriptionAr', value)}
        multiline
        rows={3}
        context="Hero slide description for main homepage banner"
        enableAIAssist={true}
        canGenerateFromTitle={true}
        titleValue={slide.title}
      />

      {/* Images */}
      <div className="space-y-4">
        <ImageUpload
          label="Background Image (Full Width)"
          value={slide.backgroundImage}
          onChange={(url) => updateField('backgroundImage', url)}
          recommendedSize={{ width: 1920, height: 1080 }}
        />

        <ImageUpload
          label="Card Image (Small Preview)"
          value={slide.cardImage}
          onChange={(url) => updateField('cardImage', url)}
          recommendedSize={{ width: 600, height: 400 }}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={autoTranslating}>
          Cancel
        </Button>
        <Button type="submit" disabled={autoTranslating}>
          {autoTranslating ? 'Auto-translating...' : 'Save Hero Slide'}
        </Button>
      </div>
    </form>
  );
}
