"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';
import { AirTicket } from '@/lib/content-storage';
import { ImageUpload } from './image-upload';
import { TranslationTabs } from './translation-tabs';
import { useToast } from '@/hooks/use-toast';

export default function AirTicketsManager() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<AirTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | 'all'>('all');
  const [editingTicket, setEditingTicket] = useState<AirTicket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await fetch('/api/content/airTickets');
      const data = await response.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load air tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const saveTickets = async (updatedTickets: AirTicket[]) => {
    try {
      const response = await fetch('/api/content/airTickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTickets),
      });

      if (!response.ok) throw new Error('Failed to save');

      setTickets(updatedTickets);
      toast({
        title: "✅ Success",
        description: "Air tickets saved successfully!",
        duration: 5000,
      });
    } catch (error) {
      console.error('Failed to save air tickets:', error);
      toast({
        title: "❌ Error",
        description: "Failed to save air tickets",
        variant: "destructive",
      });
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.airline.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterActive === 'all' || ticket.isActive === filterActive;
    
    return matchesSearch && matchesFilter;
  });

  const createNewTicket = (): AirTicket => ({
    id: Date.now().toString(),
    title: '',
    titleHy: '',
    titleRu: '',
    description: '',
    descriptionHy: '',
    descriptionRu: '',
    route: '',
    airline: '',
    ticketType: 'Round-trip',
    price: 0,
    image: '',
    isActive: true,
    order: tickets.length,
  });

  const handleAddTicket = () => {
    setEditingTicket(createNewTicket());
    setIsDialogOpen(true);
  };

  const handleEditTicket = (ticket: AirTicket) => {
    setEditingTicket(ticket);
    setIsDialogOpen(true);
  };

  const handleDeleteTicket = (id: string) => {
    if (confirm('Are you sure you want to delete this air ticket?')) {
      const updated = tickets.filter(t => t.id !== id);
      saveTickets(updated);
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = tickets.map(t =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    );
    saveTickets(updated);
  };

  const handleSave = async (ticket: AirTicket) => {
    const existingIndex = tickets.findIndex(t => t.id === ticket.id);
    let updated: AirTicket[];
    const isNew = existingIndex < 0;
    
    if (existingIndex >= 0) {
      updated = [...tickets];
      updated[existingIndex] = ticket;
    } else {
      updated = [...tickets, ticket];
    }
    
    setTickets(updated);
    await saveTickets(updated);
    toast({
      title: "✅ Success",
      description: isNew ? "Air ticket created successfully!" : "Air ticket updated successfully!",
      duration: 5000,
    });
    setIsDialogOpen(false);
    setEditingTicket(null);
  };

  if (loading) {
    return <div className="p-8">Loading air tickets...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Air Tickets
            <Badge variant="secondary" className="text-sm">
              {tickets.length} {tickets.length === 1 ? 'Ticket' : 'Tickets'}
            </Badge>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Manage flight tickets and travel offerings
          </p>
        </div>
        <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow" onClick={handleAddTicket}>
          <Plus className="w-5 h-5 mr-2" />
          Add New Ticket
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by title, route, airline, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 text-base"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterActive === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterActive('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filterActive === true ? 'default' : 'outline'}
            onClick={() => setFilterActive(true)}
            size="sm"
          >
            Active
          </Button>
          <Button
            variant={filterActive === false ? 'default' : 'outline'}
            onClick={() => setFilterActive(false)}
            size="sm"
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{tickets.length}</div>
            <div className="text-sm text-gray-500">Total Tickets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.isActive).length}
            </div>
            <div className="text-sm text-gray-500">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-400">
              {tickets.filter(t => !t.isActive).length}
            </div>
            <div className="text-sm text-gray-500">Inactive</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredTickets.length}</div>
            <div className="text-sm text-gray-500">Filtered Results</div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        <h3 className="font-semibold">Air Ticket Listings</h3>
        <div className="text-sm text-gray-500">
          {filteredTickets.length} of {tickets.length} tickets
        </div>

        <div className="grid gap-4">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} className={!ticket.isActive ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-32 h-32 bg-gray-100 rounded flex-shrink-0 overflow-hidden relative">
                    {ticket.image ? (
                      <Image src={ticket.image} alt={ticket.title} fill className="object-cover" sizes="128px" />
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
                        <h4 className="font-semibold text-lg">{ticket.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>✈️ {ticket.route}</span>
                          <span>🛫 {ticket.airline}</span>
                          <span>🎫 {ticket.ticketType}</span>
                          <span className="font-semibold text-blue-600">
                            {ticket.price.toLocaleString()} AMD
                          </span>
                        </div>
                    </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(ticket.id)}
                        >
                          {ticket.isActive ? (
                            <><Eye className="w-4 h-4 mr-1" /> Active</>
                          ) : (
                            <><EyeOff className="w-4 h-4 mr-1" /> Inactive</>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditTicket(ticket)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTicket(ticket.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Translation Status */}
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs text-gray-500">Translations:</span>
                      <span className="text-xs">🇬🇧 {ticket.title ? '✓' : '○'}</span>
                      <span className="text-xs">🇦🇲 {ticket.titleHy ? '✓' : '○'}</span>
                      <span className="text-xs">🇷🇺 {ticket.titleRu ? '✓' : '○'}</span>
                      <span className="text-xs">🇦🇪 {ticket.titleAr ? '✓' : '○'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No air tickets found. {searchTerm && 'Try adjusting your search.'}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTicket?.id && tickets.find(t => t.id === editingTicket.id)
                ? 'Edit Air Ticket'
                : 'Add New Air Ticket'}
            </DialogTitle>
          </DialogHeader>
          {editingTicket && (
            <TicketForm
              ticket={editingTicket}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingTicket(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Ticket Form Component
interface TicketFormProps {
  ticket: AirTicket;
  onSave: (ticket: AirTicket) => void;
  onCancel: () => void;
}

function TicketForm({ ticket: initialTicket, onSave, onCancel }: TicketFormProps) {
  const { toast } = useToast();
  const [ticket, setTicket] = useState(initialTicket);
  const [autoTranslating, setAutoTranslating] = useState(false);

  const updateField = (field: keyof AirTicket, value: any) => {
    setTicket({ ...ticket, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket.title || !ticket.description) {
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
          const updatedTicket = { ...ticket };
          
          try {
            if (ticket.title && !ticket.titleHy) {
              const hyResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: ticket.title, targetLanguage: 'hy', context: 'Air ticket title' })
              });
              if (hyResponse.ok) {
                const data = await hyResponse.json();
                updatedTicket.titleHy = data.translatedText;
              }
            }
            
            if (ticket.title && !ticket.titleRu) {
              const ruResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: ticket.title, targetLanguage: 'ru', context: 'Air ticket title' })
              });
              if (ruResponse.ok) {
                const data = await ruResponse.json();
                updatedTicket.titleRu = data.translatedText;
              }
            }
            
            if (ticket.description && !ticket.descriptionHy) {
              const hyResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: ticket.description, targetLanguage: 'hy', context: 'Air ticket description' })
              });
              if (hyResponse.ok) {
                const data = await hyResponse.json();
                updatedTicket.descriptionHy = data.translatedText;
              }
            }
            
            if (ticket.description && !ticket.descriptionRu) {
              const ruResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: ticket.description, targetLanguage: 'ru', context: 'Air ticket description' })
              });
              if (ruResponse.ok) {
                const data = await ruResponse.json();
                updatedTicket.descriptionRu = data.translatedText;
              }
            }
            
            // Arabic translations
            if (ticket.title && !ticket.titleAr) {
              const arResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: ticket.title, targetLanguage: 'ar', context: 'Air ticket title' })
              });
              if (arResponse.ok) {
                const data = await arResponse.json();
                updatedTicket.titleAr = data.translatedText;
              }
            }
            
            if (ticket.description && !ticket.descriptionAr) {
              const arResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: ticket.description, targetLanguage: 'ar', context: 'Air ticket description' })
              });
              if (arResponse.ok) {
                const data = await arResponse.json();
                updatedTicket.descriptionAr = data.translatedText;
              }
            }
          } catch (error) {
            console.error('Auto-translate error:', error);
          } finally {
            setAutoTranslating(false);
          }
          
          onSave(updatedTicket);
          return;
        }
      }
    } catch (error) {
      console.error('Settings check error:', error);
    }

    onSave(ticket);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title with Translation */}
      <TranslationTabs
        fieldName="Title"
        englishValue={ticket.title}
        armenianValue={ticket.titleHy}
        russianValue={ticket.titleRu}
        arabicValue={ticket.titleAr || ''}
        onEnglishChange={(value) => updateField('title', value)}
        onArmenianChange={(value) => updateField('titleHy', value)}
        onRussianChange={(value) => updateField('titleRu', value)}
        onArabicChange={(value) => updateField('titleAr', value)}
        context="Air ticket offer title"
      />

      {/* Description with Translation */}
      <TranslationTabs
        fieldName="Description"
        englishValue={ticket.description}
        armenianValue={ticket.descriptionHy}
        russianValue={ticket.descriptionRu}
        arabicValue={ticket.descriptionAr || ''}
        onEnglishChange={(value) => updateField('description', value)}
        onArmenianChange={(value) => updateField('descriptionHy', value)}
        onRussianChange={(value) => updateField('descriptionRu', value)}
        onArabicChange={(value) => updateField('descriptionAr', value)}
        multiline
        rows={3}
        context="Air ticket offer description"
      />

      {/* Other Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Route</Label>
          <Input
            value={ticket.route}
            onChange={(e) => updateField('route', e.target.value)}
            placeholder="e.g., Yerevan - Dubai"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Airline</Label>
          <Input
            value={ticket.airline}
            onChange={(e) => updateField('airline', e.target.value)}
            placeholder="e.g., Emirates, Qatar Airways"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Ticket Type</Label>
          <Input
            value={ticket.ticketType}
            onChange={(e) => updateField('ticketType', e.target.value)}
            placeholder="e.g., One-way, Round-trip"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Price (AMD)</Label>
          <Input
            type="number"
            value={ticket.price}
            onChange={(e) => updateField('price', Number(e.target.value))}
            placeholder="e.g., 150000"
            required
          />
        </div>
      </div>

      {/* Image Upload */}
      <ImageUpload
        label="Ticket Image"
        value={ticket.image}
        onChange={(url) => updateField('image', url)}
        recommendedSize={{ width: 800, height: 600 }}
      />

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={autoTranslating}>
          Cancel
        </Button>
        <Button type="submit" disabled={autoTranslating}>
          {autoTranslating ? 'Auto-translating...' : 'Save Air Ticket'}
        </Button>
      </div>
    </form>
  );
}
