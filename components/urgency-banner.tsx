"use client";

import { X, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

interface BannerConfig {
  isActive: boolean;
  title: Record<string, string>;
  message: Record<string, string>;
}

export function UrgencyBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [config, setConfig] = useState<BannerConfig | null>(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    // Load banner configuration from API
    fetch('/api/banner')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load banner config:', err));
  }, []);

  if (!config || !config.isActive || !isVisible) return null;

  const title = config.title[currentLanguage] || config.title.en;
  const message = config.message[currentLanguage] || config.message.en;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        exit={{ y: -100 }}
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white sticky top-20 z-40 shadow-lg"
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
              onClick={() => setIsVisible(false)}
              className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors duration-200 flex-shrink-0"
              aria-label="Close banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
