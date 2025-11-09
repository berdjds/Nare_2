"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Newspaper, Calendar } from 'lucide-react';

interface Article {
  id: string;
  slug: string;
  title: { en: string; hy: string; ru: string; ar: string };
  excerpt: { en: string; hy: string; ru: string; ar: string };
  category: string;
  imageUrl?: string;
  publishedAt?: string;
  createdAt: string;
}

export function InsightsCarousel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currentLanguage, t } = useLanguage();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      if (response.ok) {
        const data = await response.json();
        // Get the 6 latest published articles
        const latestArticles = data
          .filter((article: Article & { status: string }) => article.status === 'published')
          .sort((a: Article, b: Article) => {
            const dateA = new Date(a.publishedAt || a.createdAt).getTime();
            const dateB = new Date(b.publishedAt || b.createdAt).getTime();
            return dateB - dateA;
          })
          .slice(0, 6);
        
        setArticles(latestArticles);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, articles.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, articles.length - 2)) % Math.max(1, articles.length - 2));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      news: 'bg-blue-500',
      events: 'bg-purple-500',
      culture: 'bg-pink-500',
      'food-drinks': 'bg-orange-500',
      destinations: 'bg-green-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Newspaper className="w-4 h-4" />
            <span className="text-sm font-medium">{t('home.insights.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('home.insights.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.insights.subtitle')}
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {articles.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full shadow-lg bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={nextSlide}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Cards */}
          <div className="overflow-hidden px-2">
            <motion.div
              className="flex gap-6"
              animate={{ x: `${-currentIndex * (100 / 3)}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {articles.map((article) => (
                <motion.div
                  key={article.id}
                  className="flex-shrink-0 w-full md:w-[calc(33.333%-1rem)]"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/insights/${article.slug}`}>
                    <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl group overflow-hidden">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-muted">
                        {article.imageUrl ? (
                          <Image
                            src={article.imageUrl}
                            alt={article.title[currentLanguage]}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                            <Newspaper className="w-16 h-16 text-primary/30" />
                          </div>
                        )}
                        {/* Category Badge */}
                        <Badge className={`absolute top-3 left-3 ${getCategoryColor(article.category)} text-white border-0`}>
                          {t(`insights.category.${article.category}`)}
                        </Badge>
                      </div>

                      {/* Content */}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title[currentLanguage]}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                          {article.excerpt[currentLanguage]}
                        </p>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(article.publishedAt || article.createdAt).toLocaleDateString(currentLanguage)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                            <span>{t('home.insights.readMore')}</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          {articles.length > 3 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.max(1, articles.length - 2) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/insights">
            <Button size="lg" className="group">
              {t('home.insights.viewAll')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
