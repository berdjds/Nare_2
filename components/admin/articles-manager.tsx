"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Newspaper, 
  Plus, 
  Sparkles, 
  Save, 
  Eye, 
  Trash2,
  RefreshCw,
  Globe,
  Image as ImageIcon,
  Youtube,
  Calendar,
  Tag,
  Loader2,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/admin/image-upload';

interface Article {
  id: string;
  slug: string;
  title: { en: string; hy: string; ru: string; ar: string };
  content: { en: string; hy: string; ru: string; ar: string };
  excerpt: { en: string; hy: string; ru: string; ar: string };
  category: string;
  tags: string[];
  author: string;
  imageUrl?: string;
  videoUrl?: string;
  status: 'draft' | 'published';
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface NewsSuggestion {
  id: string;
  title: string;
  summary: string;
  category: string;
  country: string;
  relevanceScore: number;
}

export default function ArticlesManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [newsSuggestions, setNewsSuggestions] = useState<NewsSuggestion[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'list' | 'create' | 'edit' | 'ai'>('list');

  // New article form state
  const [formData, setFormData] = useState({
    title: { en: '', hy: '', ru: '', ar: '' },
    excerpt: { en: '', hy: '', ru: '', ar: '' },
    content: { en: '', hy: '', ru: '', ar: '' },
    category: 'news' as 'events' | 'culture' | 'food-drinks' | 'destinations' | 'news',
    tags: '',
    author: '',
    imageUrl: '',
    videoUrl: '',
    status: 'draft' as 'draft' | 'published',
    sourceUrl: '',
  });

  // Topic for AI generation
  const [customTopic, setCustomTopic] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsSuggestions = async () => {
    setFetchingSuggestions(true);
    try {
      const response = await fetch('/api/ai/news-suggestions', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch suggestions');
      }

      const data = await response.json();
      setNewsSuggestions(data.suggestions);
      toast.success(`Found ${data.suggestions.length} news suggestions!`);
      setMode('ai');
    } catch (error: any) {
      console.error('Error fetching suggestions:', error);
      toast.error(error.message || 'Failed to fetch news suggestions');
    } finally {
      setFetchingSuggestions(false);
    }
  };

  const generateArticleFromNews = async (suggestion: NewsSuggestion) => {
    setGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'news',
          data: { newsSuggestion: suggestion },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate article');
      }

      const result = await response.json();
      
      setFormData({
        ...formData,
        title: { en: result.title, hy: '', ru: '', ar: '' },
        excerpt: { en: result.excerpt, hy: '', ru: '', ar: '' },
        content: { en: result.content, hy: '', ru: '', ar: '' },
        category: suggestion.category as any,
        author: 'AI Generated',
      });

      toast.success('Article generated! Now translate to other languages.');
      setMode('create');
    } catch (error: any) {
      console.error('Error generating article:', error);
      toast.error(error.message || 'Failed to generate article');
    } finally {
      setGenerating(false);
    }
  };

  const generateFromTopic = async () => {
    if (!customTopic.trim()) {
      toast.error('Please enter a topic first');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'topic',
          data: {
            topic: customTopic,
            category: formData.category,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate article');
      }

      const result = await response.json();
      
      setFormData({
        ...formData,
        title: { en: result.title, hy: '', ru: '', ar: '' },
        excerpt: { en: result.excerpt, hy: '', ru: '', ar: '' },
        content: { en: result.content, hy: '', ru: '', ar: '' },
        category: result.category || formData.category,
        tags: result.tags ? result.tags.join(', ') : formData.tags,
        author: 'AI Generated',
      });

      toast.success('Article generated with category and tags! Now translate to other languages.');
      setCustomTopic(''); // Clear topic after generation
    } catch (error: any) {
      console.error('Error generating article:', error);
      toast.error(error.message || 'Failed to generate article');
    } finally {
      setGenerating(false);
    }
  };

  const translateArticle = async (targetLang: 'hy' | 'ru' | 'ar') => {
    if (!formData.content.en) {
      toast.error('Please write English content first');
      return;
    }

    setTranslating(true);
    try {
      const response = await fetch('/api/ai/translate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            title: formData.title.en,
            excerpt: formData.excerpt.en,
            content: formData.content.en,
          },
          targetLang,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to translate');
      }

      const translated = await response.json();
      
      setFormData({
        ...formData,
        title: { ...formData.title, [targetLang]: translated.title },
        excerpt: { ...formData.excerpt, [targetLang]: translated.excerpt },
        content: { ...formData.content, [targetLang]: translated.content },
      });

      const langNames = { hy: 'Armenian', ru: 'Russian', ar: 'Arabic' };
      toast.success(`Translated to ${langNames[targetLang]}!`);
    } catch (error: any) {
      console.error('Error translating:', error);
      toast.error(error.message || 'Failed to translate article');
    } finally {
      setTranslating(false);
    }
  };

  const saveArticle = async () => {
    setSaving(true);
    try {
      let finalFormData = { ...formData };

      // Auto-translate missing languages before saving
      const needsTranslation: Array<'hy' | 'ru' | 'ar'> = [];
      
      if (formData.content.en && !formData.content.hy) needsTranslation.push('hy');
      if (formData.content.en && !formData.content.ru) needsTranslation.push('ru');
      if (formData.content.en && !formData.content.ar) needsTranslation.push('ar');

      if (needsTranslation.length > 0) {
        toast.info(`Auto-translating to ${needsTranslation.length} language(s)...`);
        
        for (const lang of needsTranslation) {
          try {
            const response = await fetch('/api/ai/translate-article', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: {
                  title: formData.title.en,
                  excerpt: formData.excerpt.en,
                  content: formData.content.en,
                },
                targetLang: lang,
              }),
            });

            if (response.ok) {
              const translated = await response.json();
              
              finalFormData = {
                ...finalFormData,
                title: { ...finalFormData.title, [lang]: translated.title },
                excerpt: { ...finalFormData.excerpt, [lang]: translated.excerpt },
                content: { ...finalFormData.content, [lang]: translated.content },
              };

              const langNames = { hy: 'Armenian', ru: 'Russian', ar: 'Arabic' };
              toast.success(`Translated to ${langNames[lang]}!`);
            }
          } catch (error) {
            console.error(`Error translating to ${lang}:`, error);
          }
        }
      }

      const tagsArray = finalFormData.tags.split(',').map(t => t.trim()).filter(Boolean);
      
      const articleData = {
        ...finalFormData,
        tags: tagsArray,
        slug: finalFormData.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        publishedAt: finalFormData.status === 'published' ? new Date().toISOString() : undefined,
      };

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Save failed:', errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      toast.success('Article saved successfully!');
      await loadArticles();
      setMode('list');
      resetForm();
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast.error(error.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const editArticle = async (article: Article) => {
    // Load article data into form
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category as any,
      tags: article.tags.join(', '),
      author: article.author,
      imageUrl: article.imageUrl || '',
      videoUrl: article.videoUrl || '',
      status: article.status,
      sourceUrl: article.sourceUrl || '',
    });
    setSelectedArticle(article);
    setMode('edit');
  };

  const updateArticle = async () => {
    if (!selectedArticle) {
      toast.error('No article selected');
      return;
    }

    console.log('Updating article:', selectedArticle.id);
    console.log('Selected article:', selectedArticle);

    setSaving(true);
    try {
      let finalFormData = { ...formData };

      // Auto-translate missing languages before updating
      const needsTranslation: Array<'hy' | 'ru' | 'ar'> = [];
      
      if (formData.content.en && !formData.content.hy) needsTranslation.push('hy');
      if (formData.content.en && !formData.content.ru) needsTranslation.push('ru');
      if (formData.content.en && !formData.content.ar) needsTranslation.push('ar');

      if (needsTranslation.length > 0) {
        toast.info(`Auto-translating to ${needsTranslation.length} language(s)...`);
        
        for (const lang of needsTranslation) {
          try {
            const response = await fetch('/api/ai/translate-article', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: {
                  title: formData.title.en,
                  excerpt: formData.excerpt.en,
                  content: formData.content.en,
                },
                targetLang: lang,
              }),
            });

            if (response.ok) {
              const translated = await response.json();
              
              finalFormData = {
                ...finalFormData,
                title: { ...finalFormData.title, [lang]: translated.title },
                excerpt: { ...finalFormData.excerpt, [lang]: translated.excerpt },
                content: { ...finalFormData.content, [lang]: translated.content },
              };

              const langNames = { hy: 'Armenian', ru: 'Russian', ar: 'Arabic' };
              toast.success(`Translated to ${langNames[lang]}!`);
            }
          } catch (error) {
            console.error(`Error translating to ${lang}:`, error);
          }
        }
      }

      const tagsArray = finalFormData.tags.split(',').map(t => t.trim()).filter(Boolean);
      
      const articleData = {
        ...finalFormData,
        tags: tagsArray,
        slug: finalFormData.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        publishedAt: finalFormData.status === 'published' && !selectedArticle.publishedAt
          ? new Date().toISOString()
          : selectedArticle.publishedAt,
      };

      console.log('Sending PUT to:', `/api/articles/${selectedArticle.id}`);
      console.log('Article data:', articleData);

      const response = await fetch(`/api/articles/${selectedArticle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Update failed:', errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      toast.success('Article updated successfully!');
      await loadArticles();
      setMode('list');
      setSelectedArticle(null);
      resetForm();
    } catch (error: any) {
      console.error('Error updating article:', error);
      toast.error(error.message || 'Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      toast.success('Article deleted');
      await loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
    }
  };

  const resetForm = () => {
    setFormData({
      title: { en: '', hy: '', ru: '', ar: '' },
      excerpt: { en: '', hy: '', ru: '', ar: '' },
      content: { en: '', hy: '', ru: '', ar: '' },
      category: 'news',
      tags: '',
      author: '',
      imageUrl: '',
      videoUrl: '',
      status: 'draft',
      sourceUrl: '',
    });
  };

  if (loading) {
    return <div className="p-8">Loading articles...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                Travel Insights Manager
              </CardTitle>
              <CardDescription>
                Create and manage blog articles with AI assistance
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={fetchNewsSuggestions}
                disabled={fetchingSuggestions}
                variant="outline"
              >
                {fetchingSuggestions ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Fetching...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" />AI News Suggestions</>
                )}
              </Button>
              <Button onClick={() => { resetForm(); setMode('create'); }}>
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* AI Suggestions Mode */}
      {mode === 'ai' && (
        <Card>
          <CardHeader>
            <CardTitle>AI News Suggestions</CardTitle>
            <CardDescription>
              Select a news topic to generate an article
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {newsSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{suggestion.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{suggestion.summary}</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{suggestion.category}</Badge>
                        <Badge variant="outline">{suggestion.country}</Badge>
                        <Badge variant="outline">Score: {Math.round(suggestion.relevanceScore * 100)}%</Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => generateArticleFromNews(suggestion)}
                      disabled={generating}
                      size="sm"
                    >
                      {generating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>Generate Article</>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" onClick={() => setMode('list')}>
                Back to Articles
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Mode */}
      {(mode === 'create' || mode === 'edit') && (
        <Card>
          <CardHeader>
            <CardTitle>{mode === 'edit' ? 'Edit Article' : 'Create New Article'}</CardTitle>
            <CardDescription>
              {mode === 'edit' ? 'Update article content and settings' : 'Write or generate content with AI assistance'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="food-drinks">Food & Drinks</SelectItem>
                    <SelectItem value="destinations">Destinations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Author</Label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="armenia, travel, culture"
                />
              </div>
            </div>

            {/* AI Generation from Custom Topic */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-purple-700 font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Article with AI</span>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Enter your topic or idea:</Label>
                  <Textarea
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Example: Traditional Armenian lavash bread making, Dilijan national park hiking trails, Best time to visit Lake Sevan..."
                    rows={3}
                    className="bg-white"
                  />
                </div>
                <Button
                  onClick={generateFromTopic}
                  disabled={generating || !customTopic.trim()}
                  className="w-full"
                  variant="default"
                >
                  {generating ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Article...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" />Generate Article</>
                  )}
                </Button>
                <p className="text-xs text-gray-600">
                  AI will create a 400-600 word professional article in English with automatic category and tags. You can then translate it to other languages.
                </p>
              </CardContent>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="en">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
                  <TabsTrigger value="hy">🇦🇲 Armenian</TabsTrigger>
                  <TabsTrigger value="ru">🇷🇺 Russian</TabsTrigger>
                  <TabsTrigger value="ar">🇦🇪 Arabic</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button
                    onClick={() => translateArticle('hy')}
                    disabled={translating || !formData.content.en}
                    variant="outline"
                    size="sm"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    Translate HY
                  </Button>
                  <Button
                    onClick={() => translateArticle('ru')}
                    disabled={translating || !formData.content.en}
                    variant="outline"
                    size="sm"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    Translate RU
                  </Button>
                  <Button
                    onClick={() => translateArticle('ar')}
                    disabled={translating || !formData.content.en}
                    variant="outline"
                    size="sm"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    Translate AR
                  </Button>
                </div>
              </div>

              {(['en', 'hy', 'ru', 'ar'] as const).map((lang) => (
                <TabsContent key={lang} value={lang} className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={formData.title[lang]}
                      onChange={(e) => setFormData({
                        ...formData,
                        title: { ...formData.title, [lang]: e.target.value }
                      })}
                      placeholder="Article title"
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div>
                    <Label>Excerpt</Label>
                    <Textarea
                      value={formData.excerpt[lang]}
                      onChange={(e) => setFormData({
                        ...formData,
                        excerpt: { ...formData.excerpt, [lang]: e.target.value }
                      })}
                      placeholder="Brief summary (2-3 sentences)"
                      rows={3}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={formData.content[lang]}
                      onChange={(e) => setFormData({
                        ...formData,
                        content: { ...formData.content, [lang]: e.target.value }
                      })}
                      placeholder="Full article content"
                      rows={15}
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Media */}
            <div className="space-y-4">
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                label="Article Featured Image (optional)"
                recommendedSize={{ width: 1200, height: 630 }}
              />
              <div>
                <Label className="flex items-center gap-2">
                  <Youtube className="w-4 h-4" />
                  YouTube Video URL (optional)
                </Label>
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setMode('list'); setSelectedArticle(null); resetForm(); }} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={mode === 'edit' ? updateArticle : saveArticle} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === 'edit' ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {mode === 'edit' ? 'Update Article' : 'Save Article'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List Mode */}
      {mode === 'list' && (
        <Card>
          <CardHeader>
            <CardTitle>All Articles ({articles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articles.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No articles yet. Create your first one!</p>
                </div>
              ) : (
                articles.map((article) => (
                  <Card key={article.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{article.title.en}</h3>
                          <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                            {article.status}
                          </Badge>
                          <Badge variant="outline">{article.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{article.excerpt.en}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                          <span>{article.author}</span>
                          {article.tags.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {article.tags.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/insights/${article.slug}`, '_blank')}
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editArticle(article)}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteArticle(article.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
