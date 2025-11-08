"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';
import { TourPackage } from '@/lib/content-storage';
import { ImageUpload } from './image-upload';
import { TranslationTabs } from './translation-tabs';
import { useToast } from '@/hooks/use-toast';

export default function TourPackagesManager() {
  const { toast } = useToast();
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [filteredTours, setFilteredTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<TourPackage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadTours();
  }, []);

  useEffect(() => {
    filterTours();
  }, [tours, searchQuery, categoryFilter]);

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

  const filterTours = () => {
    let filtered = tours;

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(tour => tour.category === categoryFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tour => 
        tour.title.toLowerCase().includes(query) ||
        tour.description.toLowerCase().includes(query) ||
        tour.location.toLowerCase().includes(query)
      );
    }

    setFilteredTours(filtered);
  };

  const createNewTour = (): TourPackage => ({
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
    isActive: true,
  });

  const handleSave = async (tour: TourPackage) => {
    const existingIndex = tours.findIndex(t => t.id === tour.id);
    let updated: TourPackage[];
    const isNew = existingIndex < 0;
    
    if (existingIndex >= 0) {
      updated = [...tours];
      updated[existingIndex] = tour;
    } else {
      updated = [...tours, tour];
    }
    
    setTours(updated);
    await saveAllTours(updated);
    toast({
      title: "✅ Success",
      description: isNew ? "Tour package created successfully!" : "Tour package updated successfully!",
      duration: 5000,
    });
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingTour(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour package?')) return;
    
    const updatedTours = tours.filter(tour => tour.id !== id);
    setTours(updatedTours);
    await saveAllTours(updatedTours);
  };

  const toggleActive = async (id: string) => {
    const updatedTours = tours.map(tour => 
      tour.id === id ? { ...tour, isActive: !tour.isActive } : tour
    );
    setTours(updatedTours);
    await saveAllTours(updatedTours);
  };

  const saveTour = async (tour: TourPackage) => {
    setSaving(true);
    try {
      const updatedTours = tours.some(t => t.id === tour.id)
        ? tours.map(t => t.id === tour.id ? tour : t)
        : [...tours, tour];
      
      await saveAllTours(updatedTours);
    } finally {
      setSaving(false);
    }
  };

  const saveAllTours = async (toursToSave: TourPackage[]) => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/tourPackages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toursToSave),
      });
      
      if (!response.ok) {
        toast({
          title: "❌ Error",
          description: "Failed to save tours",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Error saving tours",
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
            Armenia Tour Packages
            <Badge variant="secondary" className="text-sm">
              {tours.length} {tours.length === 1 ? 'Tour' : 'Tours'}
            </Badge>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Manage your Armenia tour packages (Daily, Cultural, and Adventure tours)
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">
              <Plus className="h-5 w-5 mr-2" />
              Add New Tour
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Tour Package</DialogTitle>
            </DialogHeader>
            <TourForm 
              tour={createNewTour()} 
              onSave={handleSave}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tours by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="daily">Daily Tours</SelectItem>
            <SelectItem value="cultural">Cultural Tours</SelectItem>
            <SelectItem value="adventure">Adventure Tours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tours List */}
      {filteredTours.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchQuery || categoryFilter !== 'all' 
                ? 'No tours match your filters' 
                : 'No tour packages yet'}
            </p>
            {!searchQuery && categoryFilter === 'all' && (
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Tour
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTours.map((tour) => (
            <Card key={tour.id} className={tour.isActive === false ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Tour Image */}
                  <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {tour.image ? (
                      <Image 
                        src={tour.image} 
                        alt={tour.title}
                        fill
                        className="object-cover"
                        sizes="192px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Tour Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold">{tour.title || 'Untitled Tour'}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {tour.description || 'No description'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          tour.category === 'daily' ? 'default' :
                          tour.category === 'cultural' ? 'secondary' :
                          'outline'
                        }>
                          {tour.category}
                        </Badge>
                        {tour.isActive === false && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm text-gray-600 mt-3">
                      <span>⏱️ {tour.duration || 'N/A'}</span>
                      <span>👥 {tour.groupSize || 'N/A'}</span>
                      <span>📍 {tour.location || 'N/A'}</span>
                      <span className="font-semibold text-gray-900">
                        {tour.price ? `${tour.price.toLocaleString()} AMD` : 'Price not set'}
                      </span>
                    </div>

                    {/* Translation Status */}
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs text-gray-500">Translations:</span>
                      <span className="text-xs">🇬🇧 {tour.title ? '✓' : '○'}</span>
                      <span className="text-xs">🇦🇲 {tour.titleHy ? '✓' : '○'}</span>
                      <span className="text-xs">🇷🇺 {tour.titleRu ? '✓' : '○'}</span>
                      <span className="text-xs">🇦🇪 {tour.titleAr ? '✓' : '○'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingTour(tour);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(tour.id)}
                    >
                      {tour.isActive !== false ? (
                        <><EyeOff className="h-4 w-4 mr-1" /> Deactivate</>
                      ) : (
                        <><Eye className="h-4 w-4 mr-1" /> Activate</>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(tour.id)}
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
      {editingTour && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Tour Package</DialogTitle>
            </DialogHeader>
            <TourForm 
              tour={editingTour} 
              onSave={handleSave}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingTour(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Tour Form Component
interface TourFormProps {
  tour: TourPackage;
  onSave: (tour: TourPackage) => void;
  onCancel: () => void;
}

function TourForm({ tour: initialTour, onSave, onCancel }: TourFormProps) {
  const { toast } = useToast();
  const [tour, setTour] = useState(initialTour);
  const [autoTranslating, setAutoTranslating] = useState(false);

  const updateField = (field: keyof TourPackage, value: any) => {
    setTour({ ...tour, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour.title || !tour.description) {
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
          const updatedTour = { ...tour };
          
          try {
            if (tour.title && !tour.titleHy) {
              const hyResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: tour.title, targetLanguage: 'hy', context: 'Armenia tour package title' })
              });
              if (hyResponse.ok) {
                const data = await hyResponse.json();
                updatedTour.titleHy = data.translatedText;
              }
            }
            
            if (tour.title && !tour.titleRu) {
              const ruResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: tour.title, targetLanguage: 'ru', context: 'Armenia tour package title' })
              });
              if (ruResponse.ok) {
                const data = await ruResponse.json();
                updatedTour.titleRu = data.translatedText;
              }
            }
            
            if (tour.description && !tour.descriptionHy) {
              const hyResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: tour.description, targetLanguage: 'hy', context: 'Armenia tour package description' })
              });
              if (hyResponse.ok) {
                const data = await hyResponse.json();
                updatedTour.descriptionHy = data.translatedText;
              }
            }
            
            if (tour.description && !tour.descriptionRu) {
              const ruResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: tour.description, targetLanguage: 'ru', context: 'Armenia tour package description' })
              });
              if (ruResponse.ok) {
                const data = await ruResponse.json();
                updatedTour.descriptionRu = data.translatedText;
              }
            }
            
            // Arabic translations
            if (tour.title && !tour.titleAr) {
              const arResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: tour.title, targetLanguage: 'ar', context: 'Armenia tour package title' })
              });
              if (arResponse.ok) {
                const data = await arResponse.json();
                updatedTour.titleAr = data.translatedText;
              }
            }
            
            if (tour.description && !tour.descriptionAr) {
              const arResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: tour.description, targetLanguage: 'ar', context: 'Armenia tour package description' })
              });
              if (arResponse.ok) {
                const data = await arResponse.json();
                updatedTour.descriptionAr = data.translatedText;
              }
            }
          } catch (error) {
            console.error('Auto-translate error:', error);
          } finally {
            setAutoTranslating(false);
          }
          
          onSave(updatedTour);
          return;
        }
      }
    } catch (error) {
      console.error('Settings check error:', error);
    }

    onSave(tour);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title with Translation */}
      <TranslationTabs
        fieldName="Title"
        englishValue={tour.title}
        armenianValue={tour.titleHy}
        russianValue={tour.titleRu}
        arabicValue={tour.titleAr || ''}
        onEnglishChange={(value) => updateField('title', value)}
        onArmenianChange={(value) => updateField('titleHy', value)}
        onRussianChange={(value) => updateField('titleRu', value)}
        onArabicChange={(value) => updateField('titleAr', value)}
        context="Tour package title"
      />

      {/* Description with Translation */}
      <TranslationTabs
        fieldName="Description"
        englishValue={tour.description}
        armenianValue={tour.descriptionHy}
        russianValue={tour.descriptionRu}
        arabicValue={tour.descriptionAr || ''}
        onEnglishChange={(value) => updateField('description', value)}
        onArmenianChange={(value) => updateField('descriptionHy', value)}
        onRussianChange={(value) => updateField('descriptionRu', value)}
        onArabicChange={(value) => updateField('descriptionAr', value)}
        multiline
        rows={3}
        context="Tour package description"
      />

      {/* Other Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={tour.category}
            onValueChange={(value: 'daily' | 'cultural' | 'adventure') => 
              updateField('category', value)
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
            onChange={(e) => updateField('duration', e.target.value)}
            placeholder="e.g., 6 hours, 2 days"
          />
        </div>

        <div className="space-y-2">
          <Label>Group Size</Label>
          <Input
            value={tour.groupSize}
            onChange={(e) => updateField('groupSize', e.target.value)}
            placeholder="e.g., 1-15"
          />
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            value={tour.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="Province or region"
          />
        </div>

        <div className="space-y-2">
          <Label>Price (AMD)</Label>
          <Input
            type="number"
            value={tour.price}
            onChange={(e) => updateField('price', parseInt(e.target.value) || 0)}
            placeholder="15000"
          />
        </div>
      </div>

      {/* Image Upload */}
      <ImageUpload
        label="Tour Image"
        value={tour.image}
        onChange={(url) => updateField('image', url)}
        recommendedSize={{ width: 800, height: 600 }}
      />

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={autoTranslating}>
          Cancel
        </Button>
        <Button type="submit" disabled={autoTranslating}>
          {autoTranslating ? 'Auto-translating...' : 'Save Tour Package'}
        </Button>
      </div>
    </form>
  );
}
