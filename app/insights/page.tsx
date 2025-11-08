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
      
      <div className="min-h-screen py-20">
        {/* Search and Filters */}
        <div className="container mb-12">
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder={t('insights.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {t(cat.key)}
              </Button>
            ))}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                {article.imageUrl && (
                  <Link href={`/insights/${article.slug}`}>
                    <div className="aspect-video overflow-hidden relative">
                      <Image
                        src={article.imageUrl}
                        alt={article.title[currentLanguage] || article.title.en}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </Link>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">
                      {getCategoryLabel(article.category)}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link href={`/insights/${article.slug}`}>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer">
                      {article.title[currentLanguage] || article.title.en}
                    </h3>
                  </Link>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt[currentLanguage] || article.excerpt.en}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/insights/${article.slug}`}>
                        {t('insights.readMore')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>

                  {article.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                      <Tag className="w-3 h-3 text-gray-400" />
                      {article.tags.map((tag, i) => (
                        <span key={i} className="text-xs text-gray-500">
                          #{tag}
                        </span>
                      ))}
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
