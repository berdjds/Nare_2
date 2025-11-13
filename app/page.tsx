"use client";

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Calendar, Star } from 'lucide-react';
import { useImages } from '@/hooks/use-images';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { useLanguage } from '@/hooks/use-language';
import { HeroSlider } from '@/components/hero-slider';
import { TrustBadges } from '@/components/trust-badges';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { UrgencyBanner } from '@/components/urgency-banner';
import { DMCSection } from '@/components/dmc-section';
import { InsightsCarousel } from '@/components/insights-carousel';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const Features = dynamic(() => import('@/components/features'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />
})

const Services = dynamic(() => import('@/components/services'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />
})

export default function Home() {
  const { images } = useImages();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Urgency Banner */}
      <UrgencyBanner />
      
      <div id="main-content"></div>

      {/* Hero Section */}
      <HeroSlider />

      {/* Trust Badges */}
      <TrustBadges />

      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
        <Features />
      </Suspense>

      {/* Travel Insights Carousel */}
      <InsightsCarousel />

      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
        <Services />
      </Suspense>

      {/* DMC Section */}
      <DMCSection />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}