"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';
import { getLocalizedPageBanner } from '@/lib/localization-helper';

interface PageBanner {
  id: string;
  pageId: string;
  title: string;
  titleHy?: string;
  titleRu?: string;
  subtitle: string;
  subtitleHy?: string;
  subtitleRu?: string;
  backgroundImage: string;
  isActive?: boolean;
}

interface PageBannerProps {
  pageId: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackImage?: string;
}

export function PageBanner({ pageId, fallbackTitle, fallbackSubtitle, fallbackImage }: PageBannerProps) {
  const { currentLanguage } = useLanguage();
  const { getImageUrl } = useImages();
  const [banner, setBanner] = useState<PageBanner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch('/api/content/pageBanners');
        if (response.ok) {
          const banners: PageBanner[] = await response.json();
          const foundBanner = banners.find(
            (b) => b.pageId === pageId && b.isActive !== false
          );
          setBanner(foundBanner || null);
        }
      } catch (error) {
        console.error('Failed to fetch page banner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [pageId]);

  if (loading) {
    return (
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-white/20 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const localizedBanner = banner ? getLocalizedPageBanner(banner, currentLanguage) : null;
  const displayTitle = localizedBanner?.title || fallbackTitle || 'Page';
  const displaySubtitle = localizedBanner?.subtitle || fallbackSubtitle || '';
  const displayImage = banner?.backgroundImage || fallbackImage || getImageUrl('heroNoravank');

  return (
    <section className="hero-section">
      <Image
        src={displayImage}
        alt={displayTitle}
        fill
        className="object-cover"
        priority
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl text-white text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {displayTitle}
          </h1>
          {displaySubtitle && (
            <p className="text-xl md:text-2xl">
              {displaySubtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
