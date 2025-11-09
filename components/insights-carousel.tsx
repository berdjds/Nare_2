"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
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
  const [isPaused, setIsPaused] = useState(false);
  const { currentLanguage, t } = useLanguage();

  useEffect(() => {
    loadArticles();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (articles.length === 0 || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [articles.length, isPaused]);

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      if (response.ok) {
        const data = await response.json();
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
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const getCardIndex = (offset: number) => {
    return (currentIndex + offset + articles.length) % articles.length;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      news: 'bg-red-600',
      events: 'bg-rose-600',
      culture: 'bg-pink-600',
      'food-drinks': 'bg-red-500',
      destinations: 'bg-rose-500',
    };
    return colors[category] || 'bg-red-600';
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
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-200/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[600px] bg-red-200/30 rounded-full blur-[120px] animate-pulse delay-2000" />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-rose-300/40 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 backdrop-blur-md border border-rose-200 text-gray-800 mb-6 shadow-xl"
          >
            <Newspaper className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold tracking-wide">{t('home.insights.badge')}</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-gray-900"
          >
            {t('home.insights.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
          >
            {t('home.insights.subtitle')}
          </motion.p>
        </motion.div>

        {/* Carousel - Center Focused Layout */}
        <div 
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white backdrop-blur-xl border-2 border-rose-200 flex items-center justify-center shadow-2xl hover:bg-rose-50 transition-all group"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6 text-gray-700 group-hover:text-red-600 transition-colors" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white backdrop-blur-xl border-2 border-rose-200 flex items-center justify-center shadow-2xl hover:bg-rose-50 transition-all group"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6 text-gray-700 group-hover:text-red-600 transition-colors" />
          </motion.button>

          {/* Cards Container */}
          <div className="relative h-[550px] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {[-1, 0, 1].map((offset) => {
                const articleIndex = getCardIndex(offset);
                const article = articles[articleIndex];
                const isCenter = offset === 0;
                
                return (
                  <motion.div
                    key={`card-${currentIndex}-${offset}`}
                    className="absolute"
                    initial={{
                      x: offset * 600,
                      scale: isCenter ? 1 : 0.8,
                      opacity: isCenter ? 1 : 0.4,
                      zIndex: isCenter ? 20 : 10,
                    }}
                    animate={{
                      x: offset * 480,
                      scale: isCenter ? 1 : 0.8,
                      opacity: isCenter ? 1 : 0.4,
                      zIndex: isCenter ? 20 : 10,
                    }}
                    exit={{
                      x: offset * 300,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
                    style={{ width: '600px', height: '450px' }}
                  >
                    <Link href={`/insights/${article.slug}`} className={isCenter ? '' : 'pointer-events-none'}>
                      <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group ${
                        isCenter 
                          ? 'ring-2 ring-white/50 hover:ring-white/80 hover:shadow-[0_30px_100px_rgba(225,29,72,0.4)]' 
                          : ''
                      }`}>
                        {/* Background Image */}
                        {article.imageUrl ? (
                          <Image
                            src={article.imageUrl}
                            alt={article.title[currentLanguage]}
                            fill
                            className={`object-cover transition-all duration-700 ${isCenter ? 'group-hover:scale-110' : ''}`}
                            sizes="600px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
                            <Newspaper className="w-32 h-32 text-rose-300" />
                          </div>
                        )}
                        
                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        
                        {/* Category Badge */}
                        <Badge className={`absolute top-6 left-6 ${getCategoryColor(article.category)} text-white border-0 px-5 py-2 text-xs font-bold uppercase tracking-wider shadow-xl`}>
                          {t(`insights.category.${article.category}`)}
                        </Badge>
                        
                        {/* Content Overlaid on Image */}
                        <div className="absolute inset-0 flex flex-col justify-end p-8">
                          <h3 className="text-3xl md:text-4xl font-bold mb-4 line-clamp-2 text-white drop-shadow-2xl">
                            {article.title[currentLanguage]}
                          </h3>
                          <p className="text-lg text-white/90 line-clamp-3 mb-6 leading-relaxed drop-shadow-lg">
                            {article.excerpt[currentLanguage]}
                          </p>
                          
                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(article.publishedAt || article.createdAt).toLocaleDateString(currentLanguage)}
                              </span>
                            </div>
                            {isCenter && (
                              <motion.div 
                                className="flex items-center gap-2 text-white font-semibold bg-red-600 px-6 py-3 rounded-full shadow-lg"
                                whileHover={{ scale: 1.05, x: 5 }}
                              >
                                <span>{t('home.insights.readMore')}</span>
                                <ArrowRight className="w-5 h-5" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-10">
            {articles.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  index === currentIndex
                    ? 'w-12 bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/50'
                    : 'w-2.5 bg-rose-300/50 hover:bg-rose-400/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Link href="/insights">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-10 py-5 bg-gradient-to-r from-red-600 to-rose-600 rounded-full text-white font-bold text-lg shadow-2xl shadow-red-500/50 hover:shadow-red-600/70 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-rose-700 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-3">
                {t('home.insights.viewAll')}
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
