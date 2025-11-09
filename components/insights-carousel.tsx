"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Newspaper, Calendar } from 'lucide-react';

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
      news: 'bg-[#722F37]',        // Wine color
      events: 'bg-[#8B4049]',      // Lighter wine
      culture: 'bg-[#9B5563]',     // Rose wine
      'food-drinks': 'bg-[#722F37]',
      destinations: 'bg-[#8B4049]',
    };
    return colors[category] || 'bg-[#722F37]';
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
            <Newspaper className="w-5 h-5 text-[#722F37]" />
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

        {/* Carousel - Full Width Layout */}
        <div 
          className="relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Cards Container - Continuous Sliding Belt */}
          <div className="relative h-[500px] overflow-hidden">
            <div className="h-full relative w-full">
              {[-2, -1, 0, 1].map((offset) => {
                const articleIndex = getCardIndex(offset);
                const article = articles[articleIndex];
                const isCenter = offset === 0;
                const isLeft = offset === -1;
                const isRight = offset === 1;
                const isExiting = offset === -2;
                
                // Positions: Exiting(-20%), Left(0%), Center(20%), Right(80%)
                // Widths: Exiting(20%), Left(20%), Center(60%), Right(20%)
                const positions = {
                  '-2': -25,  // Exiting position (off-screen left)
                  '-1': 0,    // Left position
                  '0': 20,    // Center position
                  '1': 80,    // Right position
                };
                
                const widths = {
                  '-2': 20,   // Exiting width
                  '-1': 20,   // Left width
                  '0': 60,    // Center width
                  '1': 20,    // Right width
                };
                
                const leftPos = positions[String(offset) as keyof typeof positions];
                const cardWidth = widths[String(offset) as keyof typeof widths];
                
                return (
                  <motion.div
                    key={`card-${articleIndex}`}
                    className="absolute h-full cursor-pointer"
                    initial={false}
                    animate={{
                      left: `${leftPos}%`,
                      width: `${cardWidth}%`,
                      opacity: isExiting ? 0 : 1,
                      zIndex: isCenter ? 20 : 10,
                    }}
                    transition={{ 
                      duration: 0.8,
                      ease: [0.4, 0.0, 0.2, 1],
                      opacity: { duration: 0.6 }
                    }}
                    onClick={() => !isCenter && !isExiting && setCurrentIndex(articleIndex)}
                  >
                    <Link href={`/insights/${article.slug}`} className={isCenter ? '' : 'pointer-events-none'}>
                      <div className="relative w-full h-full overflow-hidden group">
                        <motion.div
                          className="absolute inset-0"
                          animate={{
                            filter: isCenter ? 'grayscale(0)' : isExiting ? 'grayscale(0.8)' : 'grayscale(0.4)',
                            opacity: isCenter ? 1 : isExiting ? 0.3 : 0.6,
                          }}
                          transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
                        >
                        {/* Background Image */}
                        {article.imageUrl ? (
                          <Image
                            src={article.imageUrl}
                            alt={article.title[currentLanguage]}
                            fill
                            className={`object-cover transition-all duration-700 ${isCenter ? 'group-hover:scale-105' : ''}`}
                            sizes="(max-width: 768px) 100vw, 60vw"
                            priority={isCenter}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <Newspaper className="w-32 h-32 text-gray-300" />
                          </div>
                        )}
                        
                        {/* Dark Gradient Overlay - Stronger on sides */}
                        <div className={`absolute inset-0 transition-all duration-500 ${
                          isCenter 
                            ? 'bg-gradient-to-t from-black/70 via-black/30 to-transparent' 
                            : 'bg-gradient-to-t from-black/80 via-black/50 to-black/20'
                        }`} />
                        
                        {/* Category Badge - Only on center */}
                        {isCenter && (
                          <Badge className={`absolute top-6 left-6 ${getCategoryColor(article.category)} text-white border-0 px-5 py-2 text-sm font-bold uppercase tracking-widest shadow-2xl`}>
                            {t(`insights.category.${article.category}`)}
                          </Badge>
                        )}
                        
                        {/* Content Overlaid on Image */}
                        <motion.div 
                          className="absolute inset-0 flex flex-col justify-end"
                          animate={{
                            padding: isCenter ? '2rem' : '1.5rem'
                          }}
                          transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
                        >
                          <motion.h3 
                            className="font-bold text-white drop-shadow-2xl line-clamp-2"
                            animate={{
                              fontSize: isCenter ? 'clamp(1.875rem, 4vw, 3rem)' : '1.25rem',
                              marginBottom: isCenter ? '1rem' : '0.75rem'
                            }}
                            transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
                          >
                            {article.title[currentLanguage]}
                          </motion.h3>
                          
                          {isCenter && (
                            <>
                              <p className="text-lg md:text-xl text-white/95 line-clamp-2 mb-6 leading-relaxed drop-shadow-lg">
                                {article.excerpt[currentLanguage]}
                              </p>
                              
                              {/* Footer */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white/90 text-sm">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {new Date(article.publishedAt || article.createdAt).toLocaleDateString(currentLanguage)}
                                  </span>
                                </div>
                                <motion.div 
                                  className="flex items-center gap-2 text-white font-semibold bg-[#722F37] hover:bg-[#8B4049] px-6 py-3 rounded-lg shadow-lg transition-colors"
                                  whileHover={{ scale: 1.05, x: 5 }}
                                >
                                  <span>{t('home.insights.readMore')}</span>
                                  <ArrowRight className="w-5 h-5" />
                                </motion.div>
                              </div>
                            </>
                          )}
                        </motion.div>
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-12">
            {articles.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`h-3 rounded-full transition-all duration-500 ${
                  index === currentIndex
                    ? 'w-16 bg-gradient-to-r from-[#722F37] to-[#8B4049] shadow-lg shadow-[#722F37]/50'
                    : 'w-3 bg-gray-300 hover:bg-gray-400'
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
              className="group relative px-10 py-5 bg-gradient-to-r from-[#722F37] to-[#8B4049] rounded-full text-white font-bold text-lg shadow-2xl shadow-[#722F37]/40 hover:shadow-[#722F37]/60 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#8B4049] to-[#722F37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
