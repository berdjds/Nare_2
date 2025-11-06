"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Save, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { HeroSlide } from '@/lib/content-storage';
import { ImageUpload } from './image-upload';
import { TranslationTabs } from './translation-tabs';

export default function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const response = await fetch('/api/content/heroSlides');
      const data = await response.json();
      setSlides(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSlide = () => {
    const newSlide: HeroSlide = {
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
    };
    setSlides([...slides, newSlide]);
  };

  const updateSlide = (id: string, field: keyof HeroSlide, value: string | number) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, [field]: value } : slide
    ));
  };

  const deleteSlide = (id: string) => {
    setSlides(slides.filter(slide => slide.id !== id));
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    newSlides.forEach((slide, i) => slide.order = i);
    setSlides(newSlides);
  };

  const saveSlides = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/heroSlides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slides),
      });
      
      if (response.ok) {
        alert('Hero slides saved successfully!');
      } else {
        alert('Failed to save slides');
      }
    } catch (error) {
      alert('Error saving slides');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {slides.length} slide{slides.length !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <Button onClick={addSlide} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Slide
          </Button>
          <Button onClick={saveSlides} disabled={saving} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      {slides.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">No hero slides yet</p>
          <Button onClick={addSlide} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Slide
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <Card key={slide.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold">Slide {index + 1}</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSlide(index, 'up')}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSlide(index, 'down')}
                    disabled={index === slides.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteSlide(slide.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Title with Translation */}
                <TranslationTabs
                  fieldName="Title"
                  englishValue={slide.title}
                  armenianValue={slide.titleHy}
                  russianValue={slide.titleRu}
                  onEnglishChange={(value) => updateSlide(slide.id, 'title', value)}
                  onArmenianChange={(value) => updateSlide(slide.id, 'titleHy', value)}
                  onRussianChange={(value) => updateSlide(slide.id, 'titleRu', value)}
                  context="Hero slide title for travel destination"
                />

                {/* Description with Translation */}
                <TranslationTabs
                  fieldName="Description"
                  englishValue={slide.description}
                  armenianValue={slide.descriptionHy}
                  russianValue={slide.descriptionRu}
                  onEnglishChange={(value) => updateSlide(slide.id, 'description', value)}
                  onArmenianChange={(value) => updateSlide(slide.id, 'descriptionHy', value)}
                  onRussianChange={(value) => updateSlide(slide.id, 'descriptionRu', value)}
                  multiline
                  rows={3}
                  context="Hero slide description for travel destination"
                />

                {/* Images */}
                <div className="grid grid-cols-1 gap-4">
                  <ImageUpload
                    label="Background Image"
                    value={slide.backgroundImage}
                    onChange={(url) => updateSlide(slide.id, 'backgroundImage', url)}
                    recommendedSize={{ width: 1920, height: 1080 }}
                  />

                  <ImageUpload
                    label="Card Image"
                    value={slide.cardImage}
                    onChange={(url) => updateSlide(slide.id, 'cardImage', url)}
                    recommendedSize={{ width: 600, height: 400 }}
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
