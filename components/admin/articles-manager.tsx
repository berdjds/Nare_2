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
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

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
  const [mode, setMode] = useState<'list' | 'edit' | 'create' | 'ai'>('list');

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
    const topic = prompt('Enter the topic you want an article about:');
    if (!topic) return;

    setGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'topic',
          data: {
            topic,
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
    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      
      const articleData = {
        ...formData,
        tags: tagsArray,
        slug: formData.title.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        publishedAt: formData.status === 'published' ? new Date().toISOString() : undefined,
      };

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        throw new Error('Failed to save article');
      }

      toast.success('Article saved successfully!');
      await loadArticles();
      setMode('list');
      resetForm();
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Failed to save article');
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
      {mode === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Article</CardTitle>
            <CardDescription>
              Write or generate content with AI assistance
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

            {/* AI Generation */}
            <div className="flex gap-2">
              <Button
                onClick={generateFromTopic}
                disabled={generating}
                variant="outline"
                size="sm"
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" />Generate from Topic</>
                )}
              </Button>
            </div>

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
              <div>
                <Label className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image URL (optional)
                </Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
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
              <Button variant="outline" onClick={() => setMode('list')}>
                Cancel
              </Button>
              <Button onClick={saveArticle}>
                <Save className="w-4 h-4 mr-2" />
                Save Article
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
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteArticle(article.id)}
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
