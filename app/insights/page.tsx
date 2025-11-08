"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
  const { currentLanguage } = useLanguage();

  const categories = [
    { value: 'all', label: { en: 'All', hy: 'Բոլորը', ru: 'Все', ar: 'الكل' } },
    { value: 'news', label: { en: 'News', hy: 'Նորություններ', ru: 'Новости', ar: 'أخبار' } },
    { value: 'events', label: { en: 'Events', hy: 'Միջոցառումներ', ru: 'События', ar: 'فعاليات' } },
    { value: 'culture', label: { en: 'Culture', hy: 'Մշակույթ', ru: 'Культура', ar: 'ثقافة' } },
    { value: 'food-drinks', label: { en: 'Food & Drinks', hy: 'Կերակուր և Խմիչքներ', ru: 'Еда и Напитки', ar: 'طعام ومشروبات' } },
    { value: 'destinations', label: { en: 'Destinations', hy: 'Ուղղություններ', ru: 'Направления', ar: 'وجهات' } },
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
    return cat ? cat.label[currentLanguage] || cat.label.en : category;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-gray-600">
            {currentLanguage === 'en' && 'Loading articles...'}
            {currentLanguage === 'hy' && 'Բեռնում են հոդվածները...'}
            {currentLanguage === 'ru' && 'Загрузка статей...'}
            {currentLanguage === 'ar' && 'جاري تحميل المقالات...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      {/* Header */}
      <div className="container mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentLanguage === 'en' && 'Travel Insights'}
            {currentLanguage === 'hy' && 'Ճամփորդական Պատմություններ'}
            {currentLanguage === 'ru' && 'Путеводитель'}
            {currentLanguage === 'ar' && 'رؤى السفر'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {currentLanguage === 'en' && 'Discover Armenia and Georgia through our latest stories, events, and cultural insights'}
            {currentLanguage === 'hy' && 'Բացահայտեք Հայաստանը և Վրաստանը մեր վերջին պատմությունների, միջոցառումների և մշակութային պատմությունների միջոցով'}
            {currentLanguage === 'ru' && 'Откройте для себя Армению и Грузию через наши последние истории, события и культурные открытия'}
            {currentLanguage === 'ar' && 'اكتشف أرمينيا وجورجيا من خلال أحدث قصصنا وفعالياتنا ورؤى ثقافية'}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLanguage === 'en' ? 'Search articles...' :
                currentLanguage === 'hy' ? 'Փնտրել հոդվածներ...' :
                currentLanguage === 'ru' ? 'Поиск статей...' :
                'بحث في المقالات...'
              }
              className="pl-10"
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
                {cat.label[currentLanguage] || cat.label.en}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-xl text-gray-500">
              {currentLanguage === 'en' && 'No articles found'}
              {currentLanguage === 'hy' && 'Հոդվածներ չեն գտնվել'}
              {currentLanguage === 'ru' && 'Статьи не найдены'}
              {currentLanguage === 'ar' && 'لم يتم العثور على مقالات'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link key={article.id} href={`/insights/${article.slug}`}>
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                  {article.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title[currentLanguage] || article.title.en}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{getCategoryLabel(article.category)}</Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                          currentLanguage === 'ar' ? 'ar-AE' : 
                          currentLanguage === 'hy' ? 'hy-AM' :
                          currentLanguage === 'ru' ? 'ru-RU' : 'en-US'
                        )}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title[currentLanguage] || article.title.en}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt[currentLanguage] || article.excerpt.en}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
                        {currentLanguage === 'en' && 'Read more'}
                        {currentLanguage === 'hy' && 'Կարդալ ավելին'}
                        {currentLanguage === 'ru' && 'Читать далее'}
                        {currentLanguage === 'ar' && 'اقرأ المزيد'}
                        <ArrowRight className="w-4 h-4" />
                      </div>
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
