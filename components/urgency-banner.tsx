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
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    // Load active banners from API
    fetch('/api/hot-news')
      .then(res => res.json())
      .then(data => setBanners(Array.isArray(data) ? data.filter(b => b.isActive) : []))
      .catch(err => console.error('Failed to load hot news:', err));
  }, []);

  const visibleBanners = banners.filter(banner => !closedBanners.has(banner.id));

  // Auto-rotate through banners
  useEffect(() => {
    if (visibleBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % visibleBanners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(interval);
  }, [visibleBanners.length]);

  const closeBanner = (id: string) => {
    setClosedBanners(prev => new Set(prev).add(id));
    // Reset index if current banner is closed
    if (visibleBanners[currentIndex]?.id === id) {
      setCurrentIndex(0);
    }
  };

  if (visibleBanners.length === 0) return null;

  const currentBanner = visibleBanners[currentIndex];

  const title = currentBanner.title[currentLanguage] || currentBanner.title.en;
  const message = currentBanner.message[currentLanguage] || currentBanner.message.en;

  return (
    <div className="sticky top-20 z-40">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
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
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                {/* Pagination dots */}
                {visibleBanners.length > 1 && (
                  <div className="flex gap-1">
                    {visibleBanners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-white w-4' 
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                        aria-label={`Go to banner ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
                <button
                  onClick={() => closeBanner(currentBanner.id)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                  aria-label="Close banner"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
