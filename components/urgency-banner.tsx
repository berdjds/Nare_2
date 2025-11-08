"use client";

import { X, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

interface HotNewsBanner {
  id: string;
  isActive: boolean;
  title: {
    en: string;
    hy: string;
    ru: string;
    ar: string;
  };
  message: {
    en: string;
    hy: string;
    ru: string;
    ar: string;
  };
}

export function UrgencyBanner() {
  const [banners, setBanners] = useState<HotNewsBanner[]>([]);
  const [closedBanners, setClosedBanners] = useState<Set<string>>(new Set());
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    // Load active banners from API
    fetch('/api/hot-news')
      .then(res => res.json())
      .then(data => setBanners(Array.isArray(data) ? data.filter(b => b.isActive) : []))
      .catch(err => console.error('Failed to load hot news:', err));
  }, []);

  const closeBanner = (id: string) => {
    setClosedBanners(prev => new Set(prev).add(id));
  };

  const visibleBanners = banners.filter(banner => !closedBanners.has(banner.id));

  if (visibleBanners.length === 0) return null;

  return (
    <div className="sticky top-20 z-40">
      <AnimatePresence>
        {visibleBanners.map((banner, index) => {
          const title = banner.title[currentLanguage] || banner.title.en;
          const message = banner.message[currentLanguage] || banner.message.en;

          return (
            <motion.div
              key={banner.id}
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
            >
              <div className="container">
                <div className="flex items-center justify-between py-3 px-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Zap className="w-5 h-5 animate-pulse" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="font-bold text-sm sm:text-base">
                        {title}
                      </span>
                      <span className="text-xs sm:text-sm">
                        {message}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => closeBanner(banner.id)}
                    className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors duration-200 flex-shrink-0"
                    aria-label="Close banner"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
