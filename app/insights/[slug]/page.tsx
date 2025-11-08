"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageBanner } from '@/components/page-banner';
import { 
  Calendar, 
  User, 
  Tag, 
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';

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
  publishedAt?: string;
  createdAt: string;
}

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentLanguage, isRTL } = useLanguage();

  useEffect(() => {
    if (params.slug) {
      loadArticle(params.slug as string);
    }
  }, [params.slug]);

  const loadArticle = async (slug: string) => {
    try {
      // Get all articles and find by slug
      const response = await fetch('/api/articles');
      if (response.ok) {
        const articles = await response.json();
        const foundArticle = articles.find((a: Article) => a.slug === slug);
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          router.push('/insights');
        }
      }
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareArticle = (platform: string) => {
    if (!article) return;
    
    const url = window.location.href;
    const title = article.title[currentLanguage] || article.title.en;
    
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <Button onClick={() => router.push('/insights')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Insights
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Banner - Managed in Admin > Page Banners */}
      <PageBanner pageId="insights-detail" />
      
      <div className="min-h-screen py-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container max-w-4xl">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => router.push('/insights')}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentLanguage === 'en' && 'Back to Insights'}
            {currentLanguage === 'hy' && 'Վերադառնալ'}
            {currentLanguage === 'ru' && 'Назад'}
            {currentLanguage === 'ar' && 'العودة'}
          </Button>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-sm">
              {article.category}
            </Badge>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                currentLanguage === 'ar' ? 'ar-AE' : 
                currentLanguage === 'hy' ? 'hy-AM' :
                currentLanguage === 'ru' ? 'ru-RU' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <User className="w-4 h-4" />
              {article.author}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {article.title[currentLanguage] || article.title.en}
          </h1>

          <p className="text-xl text-gray-600">
            {article.excerpt[currentLanguage] || article.excerpt.en}
          </p>

          {article.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <Tag className="w-4 h-4 text-gray-400" />
              {article.tags.map((tag, i) => (
                <Badge key={i} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title[currentLanguage] || article.title.en}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* YouTube Video */}
        {article.videoUrl && getYouTubeEmbedUrl(article.videoUrl) && (
          <div className="mb-8 aspect-video rounded-xl overflow-hidden">
            <iframe
              src={getYouTubeEmbedUrl(article.videoUrl)!}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {/* Article Content */}
        <Card className="mb-8">
          <CardContent className="p-8 prose prose-lg max-w-none">
            <div 
              className="whitespace-pre-wrap"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              {article.content[currentLanguage] || article.content.en}
            </div>
          </CardContent>
        </Card>

        {/* Share Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-gray-600" />
                <span className="font-medium">
                  {currentLanguage === 'en' && 'Share this article'}
                  {currentLanguage === 'hy' && 'Կիսվել հոդվածով'}
                  {currentLanguage === 'ru' && 'Поделиться статьей'}
                  {currentLanguage === 'ar' && 'شارك هذا المقال'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareArticle('facebook')}
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareArticle('twitter')}
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareArticle('linkedin')}
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
