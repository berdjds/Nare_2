"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Plus, Save, Trash2 } from 'lucide-react';
import { TourPackage } from '@/lib/content-storage';
import { ImageUpload } from './image-upload';
import { TranslationTabs } from './translation-tabs';

export default function TourPackagesManager() {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      const response = await fetch('/api/content/tourPackages');
      const data = await response.json();
      setTours(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTour = () => {
    const newTour: TourPackage = {
      id: Date.now().toString(),
      title: '',
      titleHy: '',
      titleRu: '',
      description: '',
      descriptionHy: '',
      descriptionRu: '',
      duration: '',
      groupSize: '',
      location: '',
      price: 0,
      image: '',
      category: 'daily',
    };
    setTours([...tours, newTour]);
  };

  const updateTour = (id: string, field: keyof TourPackage, value: any) => {
    setTours(tours.map(tour => 
      tour.id === id ? { ...tour, [field]: value } : tour
    ));
  };

  const deleteTour = (id: string) => {
    setTours(tours.filter(tour => tour.id !== id));
  };

  const saveTours = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/tourPackages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tours),
      });
      
      if (response.ok) {
        alert('Tour packages saved successfully!');
      } else {
        alert('Failed to save tours');
      }
    } catch (error) {
      alert('Error saving tours');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {tours.length} tour package{tours.length !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <Button onClick={addTour} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Tour
          </Button>
          <Button onClick={saveTours} disabled={saving} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      {tours.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">No tour packages yet</p>
          <Button onClick={addTour} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Tour
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tours.map((tour, index) => (
            <Card key={tour.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold">Tour {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTour(tour.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Title with Translation */}
                <TranslationTabs
                  fieldName="Title"
                  englishValue={tour.title}
                  armenianValue={tour.titleHy}
                  russianValue={tour.titleRu}
                  onEnglishChange={(value) => updateTour(tour.id, 'title', value)}
                  onArmenianChange={(value) => updateTour(tour.id, 'titleHy', value)}
                  onRussianChange={(value) => updateTour(tour.id, 'titleRu', value)}
                  context="Tour package title"
                />

                {/* Description with Translation */}
                <TranslationTabs
                  fieldName="Description"
                  englishValue={tour.description}
                  armenianValue={tour.descriptionHy}
                  russianValue={tour.descriptionRu}
                  onEnglishChange={(value) => updateTour(tour.id, 'description', value)}
                  onArmenianChange={(value) => updateTour(tour.id, 'descriptionHy', value)}
                  onRussianChange={(value) => updateTour(tour.id, 'descriptionRu', value)}
                  multiline
                  rows={4}
                  context="Tour package description"
                />

                {/* Other Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={tour.category}
                      onValueChange={(value: 'daily' | 'cultural' | 'adventure') => 
                        updateTour(tour.id, 'category', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Tours</SelectItem>
                        <SelectItem value="cultural">Cultural Tours</SelectItem>
                        <SelectItem value="adventure">Adventure Tours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      value={tour.duration}
                      onChange={(e) => updateTour(tour.id, 'duration', e.target.value)}
                      placeholder="e.g., 6 hours"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Group Size</Label>
                    <Input
                      value={tour.groupSize}
                      onChange={(e) => updateTour(tour.id, 'groupSize', e.target.value)}
                      placeholder="e.g., 1-15"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={tour.location}
                      onChange={(e) => updateTour(tour.id, 'location', e.target.value)}
                      placeholder="Province or region"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Price (AMD)</Label>
                    <Input
                      type="number"
                      value={tour.price}
                      onChange={(e) => updateTour(tour.id, 'price', parseInt(e.target.value) || 0)}
                      placeholder="15000"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <ImageUpload
                  label="Tour Image"
                  value={tour.image}
                  onChange={(url) => updateTour(tour.id, 'image', url)}
                  recommendedSize={{ width: 800, height: 600 }}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
