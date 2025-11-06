"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Edit, Save, Download, Upload, AlertCircle, Sparkles, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TranslationEntry {
  key: string;
  en: string;
  hy: string;
  ru: string;
  ar: string;
  section: string;
}

interface TranslationSection {
  name: string;
  entries: TranslationEntry[];
}

export default function TranslationsManager() {
  const [sections, setSections] = useState<TranslationSection[]>([]);
  const [filteredSections, setFilteredSections] = useState<TranslationSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [editingEntry, setEditingEntry] = useState<TranslationEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [bulkTranslating, setBulkTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    loadTranslations();
  }, []);

  useEffect(() => {
    filterTranslations();
  }, [sections, searchQuery, sectionFilter]);

  const loadTranslations = async () => {
    try {
      const response = await fetch('/api/content/translations');
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      } else {
        // Initialize with empty sections if not found
        setSections([]);
      }
    } catch (error) {
      console.error('Failed to load translations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTranslations = () => {
    let filtered = sections;

    // Section filter
    if (sectionFilter !== 'all') {
      filtered = filtered.filter(section => section.name === sectionFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.map(section => ({
        ...section,
        entries: section.entries.filter(entry =>
          entry.key.toLowerCase().includes(query) ||
          entry.en.toLowerCase().includes(query) ||
          entry.hy.toLowerCase().includes(query) ||
          entry.ru.toLowerCase().includes(query) ||
          entry.ar?.toLowerCase().includes(query)
        )
      })).filter(section => section.entries.length > 0);
    }

    setFilteredSections(filtered);
  };

  const handleEdit = (entry: TranslationEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  };

  const handleSaveEntry = async (updatedEntry: TranslationEntry) => {
    const updatedSections = sections.map(section => ({
      ...section,
      entries: section.entries.map(entry =>
        entry.key === updatedEntry.key ? updatedEntry : entry
      )
    }));

    setSections(updatedSections);
    await saveTranslations(updatedSections);
    setIsEditDialogOpen(false);
    setEditingEntry(null);
  };

  const saveTranslations = async (sectionsToSave: TranslationSection[]) => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionsToSave),
      });

      if (!response.ok) {
        alert('Failed to save translations');
      }
    } catch (error) {
      alert('Error saving translations');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(sections, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translations-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setSections(imported);
        await saveTranslations(imported);
        alert('Translations imported successfully!');
      } catch (error) {
        alert('Error importing translations. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const getTotalKeys = () => {
    return sections.reduce((total, section) => total + section.entries.length, 0);
  };

  const getTranslationProgress = () => {
    const total = getTotalKeys();
    if (total === 0) return { hy: 0, ru: 0, ar: 0 };

    const hyComplete = sections.reduce((count, section) =>
      count + section.entries.filter(e => e.hy).length, 0
    );
    const ruComplete = sections.reduce((count, section) =>
      count + section.entries.filter(e => e.ru).length, 0
    );
    const arComplete = sections.reduce((count, section) =>
      count + section.entries.filter(e => e.ar).length, 0
    );

    return {
      hy: Math.round((hyComplete / total) * 100),
      ru: Math.round((ruComplete / total) * 100),
      ar: Math.round((arComplete / total) * 100)
    };
  };

  const getMissingTranslations = () => {
    const missing: { entry: TranslationEntry; lang: 'hy' | 'ru' | 'ar' }[] = [];
    
    sections.forEach(section => {
      section.entries.forEach(entry => {
        if (entry.en && !entry.hy) {
          missing.push({ entry, lang: 'hy' });
        }
        if (entry.en && !entry.ru) {
          missing.push({ entry, lang: 'ru' });
        }
        if (entry.en && !entry.ar) {
          missing.push({ entry, lang: 'ar' });
        }
      });
    });
    
    return missing;
  };

  const translateWithAI = async (text: string, targetLang: 'hy' | 'ru' | 'ar', context?: string): Promise<string> => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLanguage: targetLang,
          context: context || 'UI translation'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Translation failed';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error('AI translation error:', error);
      throw error;
    }
  };

  const handleBulkTranslate = async () => {
    const missing = getMissingTranslations();
    
    if (missing.length === 0) {
      alert('All translations are complete!');
      return;
    }

    const confirmed = confirm(
      `Found ${missing.length} missing translations.\n\n` +
      `This will use AI to translate all missing text.\n\n` +
      `⚠️ Make sure you have configured your DeepSeek API key in Settings first!\n\n` +
      `Continue?`
    );

    if (!confirmed) return;

    setBulkTranslating(true);
    setTranslationProgress({ current: 0, total: missing.length });

    const updatedSections = [...sections];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < missing.length; i++) {
      const { entry, lang } = missing[i];
      setTranslationProgress({ current: i + 1, total: missing.length });

      try {
        const translated = await translateWithAI(entry.en, lang, `UI element: ${entry.key}`);
        
        // Update the entry in sections
        updatedSections.forEach(section => {
          const entryIndex = section.entries.findIndex(e => e.key === entry.key);
          if (entryIndex !== -1) {
            section.entries[entryIndex][lang] = translated;
          }
        });

        successCount++;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to translate ${entry.key} to ${lang}:`, error);
        failCount++;
      }
    }

    setSections(updatedSections);
    await saveTranslations(updatedSections);
    
    setBulkTranslating(false);
    setTranslationProgress({ current: 0, total: 0 });

    if (failCount > 0 && successCount === 0) {
      alert(
        `❌ Bulk translation failed!\n\n` +
        `All ${failCount} translations failed.\n\n` +
        `Please check:\n` +
        `1. DeepSeek API key is configured in Settings\n` +
        `2. API key is valid and active\n` +
        `3. You have API credits available`
      );
    } else {
      alert(
        `Bulk translation complete!\n\n` +
        `✅ Successful: ${successCount}\n` +
        `❌ Failed: ${failCount}`
      );
    }
  };

  if (loading) return <div className="text-center py-8">Loading translations...</div>;

  const progress = getTranslationProgress();
  const totalKeys = getTotalKeys();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">UI Translations</h2>
          <p className="text-sm text-gray-500 mt-1">
            {totalKeys} translation keys across {sections.length} sections
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleBulkTranslate}
            disabled={bulkTranslating || getMissingTranslations().length === 0}
          >
            <Zap className="h-4 w-4 mr-2" />
            {bulkTranslating 
              ? `Translating ${translationProgress.current}/${translationProgress.total}...`
              : `AI Translate Missing (${getMissingTranslations().length})`
            }
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
            </label>
          </Button>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Armenian (HY)</p>
                <p className="text-2xl font-bold">{progress.hy}%</p>
              </div>
              <Badge variant={progress.hy === 100 ? "default" : "secondary"}>
                🇦🇲
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Russian (RU)</p>
                <p className="text-2xl font-bold">{progress.ru}%</p>
              </div>
              <Badge variant={progress.ru === 100 ? "default" : "secondary"}>
                🇷🇺
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Arabic (AR)</p>
                <p className="text-2xl font-bold">{progress.ar}%</p>
              </div>
              <Badge variant={progress.ar === 100 ? "default" : "secondary"}>
                🇦🇪
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search translations by key or value..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sectionFilter} onValueChange={setSectionFilter}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="All Sections" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {sections.map(section => (
              <SelectItem key={section.name} value={section.name}>
                {section.name} ({section.entries.length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Translations List */}
      {filteredSections.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery || sectionFilter !== 'all'
                ? 'No translations match your filters'
                : 'No translations found. They will be imported from your translations file.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" defaultValue={filteredSections.map(s => s.name)} className="space-y-4">
          {filteredSections.map((section) => (
            <AccordionItem key={section.name} value={section.name} className="border rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{section.name}</h3>
                    <Badge variant="outline">{section.entries.length} keys</Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-3">
                  {section.entries.map((entry) => (
                    <Card key={entry.key} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {entry.key}
                              </code>
                              <div className="flex gap-1">
                                <span className="text-xs">{entry.en ? '🇬🇧' : '⚪'}</span>
                                <span className="text-xs">{entry.hy ? '🇦🇲' : '⚪'}</span>
                                <span className="text-xs">{entry.ru ? '🇷🇺' : '⚪'}</span>
                                <span className="text-xs">{entry.ar ? '🇦🇪' : '⚪'}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">English</p>
                                <p className={entry.en ? '' : 'text-gray-400 italic'}>
                                  {entry.en || 'Not translated'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Armenian</p>
                                <p className={entry.hy ? '' : 'text-gray-400 italic'}>
                                  {entry.hy || 'Not translated'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Russian</p>
                                <p className={entry.ru ? '' : 'text-gray-400 italic'}>
                                  {entry.ru || 'Not translated'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Arabic</p>
                                <p className={entry.ar ? '' : 'text-gray-400 italic'} dir="rtl">
                                  {entry.ar || 'Not translated'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(entry)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Edit Dialog */}
      {editingEntry && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Translation</DialogTitle>
            </DialogHeader>
            <TranslationEditForm
              entry={editingEntry}
              onSave={handleSaveEntry}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingEntry(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Translation Edit Form Component
interface TranslationEditFormProps {
  entry: TranslationEntry;
  onSave: (entry: TranslationEntry) => void;
  onCancel: () => void;
}

function TranslationEditForm({ entry: initialEntry, onSave, onCancel }: TranslationEditFormProps) {
  const [entry, setEntry] = useState(initialEntry);
  const [translating, setTranslating] = useState<'hy' | 'ru' | 'ar' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(entry);
  };

  const handleAITranslate = async (targetLang: 'hy' | 'ru' | 'ar') => {
    if (!entry.en) {
      alert('Please enter English text first');
      return;
    }

    setTranslating(targetLang);
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: entry.en,
          targetLanguage: targetLang,
          context: `UI translation for: ${entry.key}`
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setEntry({ ...entry, [targetLang]: data.translatedText });
    } catch (error) {
      alert(`Translation failed. Please check your API key in Settings.`);
      console.error('Translation error:', error);
    } finally {
      setTranslating(null);
    }
  };

  const isMultiline = entry.en.length > 50 || entry.en.includes('\n');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Translation Key</Label>
        <code className="block text-sm bg-gray-100 px-3 py-2 rounded">
          {entry.key}
        </code>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>🇬🇧 English</Label>
          {isMultiline ? (
            <Textarea
              value={entry.en}
              onChange={(e) => setEntry({ ...entry, en: e.target.value })}
              rows={3}
              placeholder="English text"
            />
          ) : (
            <Input
              value={entry.en}
              onChange={(e) => setEntry({ ...entry, en: e.target.value })}
              placeholder="English text"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>🇦🇲 Armenian (Հայերեն)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAITranslate('hy')}
              disabled={translating !== null || !entry.en}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {translating === 'hy' ? 'Translating...' : 'AI Translate'}
            </Button>
          </div>
          {isMultiline ? (
            <Textarea
              value={entry.hy}
              onChange={(e) => setEntry({ ...entry, hy: e.target.value })}
              rows={3}
              placeholder="Armenian translation"
            />
          ) : (
            <Input
              value={entry.hy}
              onChange={(e) => setEntry({ ...entry, hy: e.target.value })}
              placeholder="Armenian translation"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>🇷🇺 Russian (Русский)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAITranslate('ru')}
              disabled={translating !== null || !entry.en}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {translating === 'ru' ? 'Translating...' : 'AI Translate'}
            </Button>
          </div>
          {isMultiline ? (
            <Textarea
              value={entry.ru}
              onChange={(e) => setEntry({ ...entry, ru: e.target.value })}
              rows={3}
              placeholder="Russian translation"
            />
          ) : (
            <Input
              value={entry.ru}
              onChange={(e) => setEntry({ ...entry, ru: e.target.value })}
              placeholder="Russian translation"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>🇦🇪 Arabic (العربية)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAITranslate('ar')}
              disabled={translating !== null || !entry.en}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {translating === 'ar' ? 'Translating...' : 'AI Translate'}
            </Button>
          </div>
          {isMultiline ? (
            <Textarea
              value={entry.ar || ''}
              onChange={(e) => setEntry({ ...entry, ar: e.target.value })}
              rows={3}
              placeholder="Arabic translation"
              dir="rtl"
              className="text-right"
            />
          ) : (
            <Input
              value={entry.ar || ''}
              onChange={(e) => setEntry({ ...entry, ar: e.target.value })}
              placeholder="Arabic translation"
              dir="rtl"
              className="text-right"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Translation
        </Button>
      </div>
    </form>
  );
}
