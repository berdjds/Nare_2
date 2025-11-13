"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageBanner } from '@/components/page-banner';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Calendar, 
  Tag, 
  User,
  ArrowRight,
  Newspaper
} from 'lucide-react';

interface Article {
  id: string;
  slug: string;
  title: { en: string; hy: string; ru: string; ar: string };
  excerpt: { en: string; hy: string; ru: string; ar: string };
  category: string;
  tags: string[];
  author: string;
  imageUrl?: string;
  publishedAt?: string;
  createdAt: string;
}

export default function InsightsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { currentLanguage, t } = useLanguage();

  const categories = [
    { value: 'all', key: 'insights.category.all' },
    { value: 'news', key: 'insights.category.news' },
    { value: 'events', key: 'insights.category.events' },
    { value: 'culture', key: 'insights.category.culture' },
    { value: 'food-drinks', key: 'insights.category.food-drinks' },
    { value: 'destinations', key: 'insights.category.destinations' },
  ];

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchQuery, selectedCategory, currentLanguage]);

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      if (response.ok) {
        const data = await response.json();
        
        // API already filters published articles for non-admin users
        // But we filter again as extra safety + sort for consistency
        const publishedArticles = data
          .filter((article: Article & { status: string }) => 
            article.status === 'published'
          )
          .sort((a: Article, b: Article) => {
            // Sort by newest first (publishedAt or createdAt)
            const dateA = new Date(a.publishedAt || a.createdAt).getTime();
            const dateB = new Date(b.publishedAt || b.createdAt).getTime();
            return dateB - dateA; // Newest first
          });
        
        setArticles(publishedArticles);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title[currentLanguage]?.toLowerCase().includes(query) ||
        a.excerpt[currentLanguage]?.toLowerCase().includes(query) ||
        a.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredArticles(filtered);
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? t(cat.key) : category;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-gray-600">{t('insights.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Banner - Managed in Admin > Page Banners */}
      <PageBanner pageId="insights" />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Search and Filters */}
        <div className="container py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder={t('insights.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-4 text-base border-2 focus:border-primary shadow-sm hover:shadow-md transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="sr-only">Clear search</span>
                  ✕
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-medium text-muted-foreground mr-2">
                {t('insights.filterBy')}:
              </span>
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`rounded-full transition-all ${
                    selectedCategory === cat.value
                      ? 'shadow-md scale-105'
                      : 'hover:scale-105'
                  }`}
                >
                  {t(cat.key)}
                  {selectedCategory === cat.value && filteredArticles.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-primary-foreground/20 rounded-full text-xs">
                      {filteredArticles.length}
                    </span>
                  )}
                </Button>
              ))}
            </div>

            {/* Results Count */}
            {searchQuery && (
              <div className="text-sm text-muted-foreground">
                {filteredArticles.length > 0 ? (
                  <span>
                    {t('insights.resultsFound')}: <strong>{filteredArticles.length}</strong>
                  </span>
                ) : (
                  <span>{t('insights.noResults')}</span>
                )}
              </div>
            )}
          </div>
        </div>

      {/* Articles Grid */}
      <div className="container">
        {filteredArticles.length === 0 ? (
          <div className="text-center">
            <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <div className="animate-pulse">{t('insights.noArticles')}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="h-full border-2 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <Link href={`/insights/${article.slug}`} className="block">
                  {article.imageUrl ? (
                    <div className="aspect-video overflow-hidden relative bg-muted">
                      <Image
                        src={article.imageUrl}
                        alt={article.title[currentLanguage] || article.title.en}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Overlay gradient for better readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Newspaper className="w-16 h-16 text-primary/30" />
                    </div>
                  )}
                </Link>

                <CardContent className="p-6 space-y-4">
                  {/* Category and Date */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                      {getCategoryLabel(article.category)}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString(currentLanguage)}
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/insights/${article.slug}`}>
                    <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors cursor-pointer leading-tight">
                      {article.title[currentLanguage] || article.title.en}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                    {article.excerpt[currentLanguage] || article.excerpt.en}
                  </p>

                  {/* Author and Read More */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span className="font-medium">{article.author}</span>
                    </div>
                    <Button asChild size="sm" variant="ghost" className="group/btn">
                      <Link href={`/insights/${article.slug}`} className="flex items-center gap-1">
                        <span className="text-xs font-semibold">{t('insights.readMore')}</span>
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>

                  {/* Tags */}
                  {article.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-2">
                      <Tag className="w-3 h-3 text-muted-foreground/50" />
                      {article.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground hover:bg-muted/80 transition-colors">
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{article.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
