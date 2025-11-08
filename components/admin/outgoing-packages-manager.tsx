"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';
import { OutgoingPackage } from '@/lib/content-storage';
import { ImageUpload } from './image-upload';
import { TranslationTabs } from './translation-tabs';
import { useToast } from '@/hooks/use-toast';

export default function OutgoingPackagesManager() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<OutgoingPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<OutgoingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<OutgoingPackage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [packages, searchQuery, destinationFilter]);

  const loadPackages = async () => {
    try {
      const response = await fetch('/api/content/outgoingPackages');
      const data = await response.json();
      setPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPackages = () => {
    let filtered = packages;

    // Destination filter
    if (destinationFilter !== 'all') {
      filtered = filtered.filter(pkg => pkg.destination === destinationFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pkg => 
        pkg.title.toLowerCase().includes(query) ||
        pkg.description.toLowerCase().includes(query) ||
        pkg.destination.toLowerCase().includes(query)
      );
    }

    setFilteredPackages(filtered);
  };

  const createNewPackage = (): OutgoingPackage => ({
    id: Date.now().toString(),
    title: '',
    titleHy: '',
    titleRu: '',
    description: '',
    descriptionHy: '',
    descriptionRu: '',
    duration: '',
    groupSize: '',
    price: 0,
    image: '',
    destination: 'daily',
    isActive: true,
  });

  const handleCreate = async (newPackage: OutgoingPackage) => {
    const updatedPackages = [...packages, newPackage];
    setPackages(updatedPackages);
    await saveAllPackages(updatedPackages);
    toast({
      title: "✅ Success",
      description: "Package created successfully!",
      duration: 5000,
    });
    setIsCreateDialogOpen(false);
  };

  const handleUpdate = async (updatedPackage: OutgoingPackage) => {
    const updatedPackages = packages.map(pkg => pkg.id === updatedPackage.id ? updatedPackage : pkg);
    setPackages(updatedPackages);
    await saveAllPackages(updatedPackages);
    toast({
      title: "✅ Success",
      description: "Package updated successfully!",
      duration: 5000,
    });
    setIsEditDialogOpen(false);
    setEditingPackage(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pkg package?')) return;
    
    const updatedPackages = packages.filter(pkg => pkg.id !== id);
    setPackages(updatedPackages);
    await saveAllPackages(updatedPackages);
  };

  const toggleActive = async (id: string) => {
    const updatedPackages = packages.map(pkg => 
      pkg.id === id ? { ...pkg, isActive: !pkg.isActive } : pkg
    );
    setPackages(updatedPackages);
    await saveAllPackages(updatedPackages);
  };

  const savePackage = async (pkg: OutgoingPackage) => {
    setSaving(true);
    try {
      const updatedPackages = packages.some(t => t.id === pkg.id)
        ? packages.map(t => t.id === pkg.id ? pkg : t)
        : [...packages, pkg];
      
      await saveAllPackages(updatedPackages);
    } finally {
      setSaving(false);
    }
  };

  const saveAllPackages = async (pkgsToSave: OutgoingPackage[]) => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/outgoingPackages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pkgsToSave),
      });
      
      if (response.ok) {
        // Success - silent update
      } else {
        alert('Failed to save packages');
      }
    } catch (error) {
      alert('Error saving packages');
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
            International Packages
            <Badge variant="secondary" className="text-sm">
              {packages.length} {packages.length === 1 ? 'Package' : 'Packages'}
            </Badge>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Manage your international travel packages (Dubai, Europe, Turkey, etc.)
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">
              <Plus className="h-5 w-5 mr-2" />
              Add New Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Package Package</DialogTitle>
            </DialogHeader>
            <PackageForm 
              pkg={createNewPackage()} 
              onSave={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search packages by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 text-base"
          />
        </div>
        <Select value={destinationFilter} onValueChange={setDestinationFilter}>
          <SelectTrigger className="w-56 h-11">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🌍 All Destinations</SelectItem>
            <SelectItem value="daily">🇦🇪 Dubai Packages</SelectItem>
            <SelectItem value="cultural">🇪🇺 Europe Packages</SelectItem>
            <SelectItem value="adventure">🇹🇷 Turkey Packages</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Packages List */}
      {filteredPackages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchQuery || destinationFilter !== 'all' 
                ? 'No packages match your filters' 
                : 'No pkg packages yet'}
            </p>
            {!searchQuery && destinationFilter === 'all' && (
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Package
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className={`transition-all duration-200 hover:shadow-lg border-l-4 ${
              pkg.isActive === false 
                ? 'opacity-60 border-l-gray-300' 
                : 'border-l-blue-500 hover:border-l-blue-600'
            }`}>
              <CardContent className="p-0">
                <div className="flex gap-0">
                  {/* Package Image */}
                  <div className="relative w-64 h-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {pkg.image ? (
                      <Image 
                        src={pkg.image} 
                        alt={pkg.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="256px"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                    {pkg.isActive === false && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-sm px-3 py-1">
                          <EyeOff className="h-4 w-4 mr-1" />
                          Inactive
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Package Info */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {pkg.title || 'Untitled Package'}
                          </h3>
                          <Badge variant={
                            pkg.destination === 'daily' ? 'default' :
                            pkg.destination === 'cultural' ? 'secondary' :
                            'outline'
                          } className="text-xs">
                            {pkg.destination}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                          {pkg.description || 'No description provided'}
                        </p>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="flex flex-wrap gap-4 mt-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-xl">⏱️</span>
                        <span className="text-gray-700 font-medium">{pkg.duration || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-xl">👥</span>
                        <span className="text-gray-700 font-medium">{pkg.groupSize || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-xl">📍</span>
                        <span className="text-gray-700 font-medium">{pkg.destination || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm ml-auto">
                        <span className="text-xl">💰</span>
                        <span className="font-bold text-lg text-blue-600">
                          {pkg.price ? `${pkg.price.toLocaleString()} AMD` : 'Price not set'}
                        </span>
                      </div>
                    </div>

                    {/* Translation Status */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-xs font-medium text-gray-600">Translations:</span>
                      <div className="flex gap-3">
                        <span className={`text-sm flex items-center gap-1 ${pkg.title ? 'text-green-600' : 'text-gray-400'}`}>
                          🇬🇧 {pkg.title ? '✓' : '○'}
                        </span>
                        <span className={`text-sm flex items-center gap-1 ${pkg.titleHy ? 'text-green-600' : 'text-gray-400'}`}>
                          🇦🇲 {pkg.titleHy ? '✓' : '○'}
                        </span>
                        <span className={`text-sm flex items-center gap-1 ${pkg.titleRu ? 'text-green-600' : 'text-gray-400'}`}>
                          🇷🇺 {pkg.titleRu ? '✓' : '○'}
                        </span>
                        <span className={`text-sm flex items-center gap-1 ${pkg.titleAr ? 'text-green-600' : 'text-gray-400'}`}>
                          🇦🇪 {pkg.titleAr ? '✓' : '○'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 p-4 bg-gray-50 border-l border-gray-200">
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full justify-start"
                      onClick={() => {
                        setEditingPackage(pkg);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant={pkg.isActive !== false ? "outline" : "secondary"}
                      className="w-full justify-start"
                      onClick={() => toggleActive(pkg.id)}
                    >
                      {pkg.isActive !== false ? (
                        <><EyeOff className="h-4 w-4 mr-2" /> Deactivate</>
                      ) : (
                        <><Eye className="h-4 w-4 mr-2" /> Activate</>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={() => handleDelete(pkg.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
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
      {editingPackage && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Package Package</DialogTitle>
            </DialogHeader>
            <PackageForm 
              pkg={editingPackage} 
              onSave={handleUpdate}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingPackage(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Package Form Component
interface PackageFormProps {
  pkg: OutgoingPackage;
  onSave: (pkg: OutgoingPackage) => void;
  onCancel: () => void;
}

function PackageForm({ pkg: initialPkg, onSave, onCancel }: PackageFormProps) {
  const { toast } = useToast();
  const [pkg, setPkg] = useState(initialPkg);
  const [autoTranslating, setAutoTranslating] = useState(false);

  const updateField = (field: keyof OutgoingPackage, value: any) => {
    setPkg({ ...pkg, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg.title || !pkg.description) {
      alert('Please fill in at least the English title and description');
      return;
    }

    // Check if auto-translate is enabled
    try {
      const settingsResponse = await fetch('/api/admin/settings');
      if (settingsResponse.ok) {
        const settings = await settingsResponse.json();
        
        if (settings.autoTranslate && settings.enableAITranslation) {
          // Auto-translate missing fields
          setAutoTranslating(true);
          const updatedPkg = { ...pkg };
          
          try {
            // Translate title if missing
            if (pkg.title && !pkg.titleHy) {
              const hyResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text: pkg.title,
                  targetLanguage: 'hy',
                  context: 'International travel package title'
                })
              });
              if (hyResponse.ok) {
                const data = await hyResponse.json();
                updatedPkg.titleHy = data.translatedText;
              }
            }
            
            if (pkg.title && !pkg.titleRu) {
              const ruResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text: pkg.title,
                  targetLanguage: 'ru',
                  context: 'International travel package title'
                })
              });
              if (ruResponse.ok) {
                const data = await ruResponse.json();
                updatedPkg.titleRu = data.translatedText;
              }
            }
            
            // Translate description if missing
            if (pkg.description && !pkg.descriptionHy) {
              const hyResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text: pkg.description,
                  targetLanguage: 'hy',
                  context: 'International travel package description'
                })
              });
              if (hyResponse.ok) {
                const data = await hyResponse.json();
                updatedPkg.descriptionHy = data.translatedText;
              }
            }
            
            if (pkg.description && !pkg.descriptionRu) {
              const ruResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text: pkg.description,
                  targetLanguage: 'ru',
                  context: 'International travel package description'
                })
              });
              if (ruResponse.ok) {
                const data = await ruResponse.json();
                updatedPkg.descriptionRu = data.translatedText;
              }
            }
            
            // Arabic translations
            if (pkg.title && !pkg.titleAr) {
              const arResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text: pkg.title,
                  targetLanguage: 'ar',
                  context: 'International travel package title'
                })
              });
              if (arResponse.ok) {
                const data = await arResponse.json();
                updatedPkg.titleAr = data.translatedText;
              }
            }
            
            if (pkg.description && !pkg.descriptionAr) {
              const arResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text: pkg.description,
                  targetLanguage: 'ar',
                  context: 'International travel package description'
                })
              });
              if (arResponse.ok) {
                const data = await arResponse.json();
                updatedPkg.descriptionAr = data.translatedText;
              }
            }
          } catch (error) {
            console.error('Auto-translate error:', error);
          } finally {
            setAutoTranslating(false);
          }
          
          onSave(updatedPkg);
          return;
        }
      }
    } catch (error) {
      console.error('Settings check error:', error);
    }

    onSave(pkg);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title with Translation */}
      <TranslationTabs
        fieldName="Title"
        englishValue={pkg.title}
        armenianValue={pkg.titleHy}
        russianValue={pkg.titleRu}
        arabicValue={pkg.titleAr || ''}
        onEnglishChange={(value) => updateField('title', value)}
        onArmenianChange={(value) => updateField('titleHy', value)}
        onRussianChange={(value) => updateField('titleRu', value)}
        onArabicChange={(value) => updateField('titleAr', value)}
        context="Outgoing tour package title"
      />

      {/* Description with Translation */}
      <TranslationTabs
        fieldName="Description"
        englishValue={pkg.description}
        armenianValue={pkg.descriptionHy}
        russianValue={pkg.descriptionRu}
        arabicValue={pkg.descriptionAr || ''}
        onEnglishChange={(value) => updateField('description', value)}
        onArmenianChange={(value) => updateField('descriptionHy', value)}
        onRussianChange={(value) => updateField('descriptionRu', value)}
        onArabicChange={(value) => updateField('descriptionAr', value)}
        multiline
        rows={3}
        context="Outgoing tour package description"
      />

      {/* Other Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Destination</Label>
          <Input
            value={pkg.destination}
            onChange={(e) => updateField('destination', e.target.value)}
            placeholder="e.g., Dubai, Europe, Turkey"
          />
        </div>

        <div className="space-y-2">
          <Label>Duration</Label>
          <Input
            value={pkg.duration}
            onChange={(e) => updateField('duration', e.target.value)}
            placeholder="e.g., 5 days, 7 days"
          />
        </div>

        <div className="space-y-2">
          <Label>Group Size</Label>
          <Input
            value={pkg.groupSize}
            onChange={(e) => updateField('groupSize', e.target.value)}
            placeholder="e.g., 2+"
          />
        </div>

        <div className="space-y-2">
        </div>

        <div className="space-y-2">
          <Label>Price (AMD)</Label>
          <Input
            type="number"
            value={pkg.price}
            onChange={(e) => updateField('price', parseInt(e.target.value) || 0)}
            placeholder="15000"
          />
        </div>
      </div>

      {/* Image Upload */}
      <ImageUpload
        label="Package Image"
        value={pkg.image}
        onChange={(url) => updateField('image', url)}
        recommendedSize={{ width: 800, height: 600 }}
      />

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={autoTranslating}>
          Cancel
        </Button>
        <Button type="submit" disabled={autoTranslating}>
          {autoTranslating ? 'Auto-translating...' : 'Save Package'}
        </Button>
      </div>
    </form>
  );
}
