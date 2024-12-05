"use client";

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

export default function Home() {
  const { images } = useImages();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSlider />

      {/* Features Section */}
      <motion.section 
        className="py-20 bg-gradient-to-b from-background to-background/50"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              {t('home.features.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="feature-card">
                <CardContent className="p-6">
                  <div className="feature-icon-wrapper">
                    <Globe className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mt-4">{t('home.features.explore.title')}</h3>
                  <p className="mt-2 text-muted-foreground">{t('home.features.explore.description')}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="feature-card">
                <CardContent className="p-6">
                  <div className="feature-icon-wrapper">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mt-4">{t('home.features.plan.title')}</h3>
                  <p className="mt-2 text-muted-foreground">{t('home.features.plan.description')}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="feature-card">
                <CardContent className="p-6">
                  <div className="feature-icon-wrapper">
                    <Star className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mt-4">{t('home.features.experience.title')}</h3>
                  <p className="mt-2 text-muted-foreground">{t('home.features.experience.description')}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        className="py-20 bg-gradient-to-t from-background/50 to-background"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              {t('home.services.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.services.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="service-card group">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <ImageWithFallback
                    src={images.tourGarni}
                    fallbackKey="heroVernissage"
                    alt={t('home.services.daily.title')}
                    className="transform group-hover:scale-110 transition-transform duration-500"
                    width={400}
                    height={300}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-semibold">{t('home.services.daily.title')}</h3>
                    <p className="mt-2 text-sm text-white/80">{t('home.services.daily.description')}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="service-card group">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <ImageWithFallback
                    src={images.destinationDubai}
                    fallbackKey="heroVernissage"
                    alt={t('home.services.international.title')}
                    className="transform group-hover:scale-110 transition-transform duration-500"
                    width={400}
                    height={300}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-semibold">{t('home.services.international.title')}</h3>
                    <p className="mt-2 text-sm text-white/80">{t('home.services.international.description')}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="service-card group">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <ImageWithFallback
                    src={images.serviceMice}
                    fallbackKey="heroVernissage"
                    alt={t('home.services.business.title')}
                    className="transform group-hover:scale-110 transition-transform duration-500"
                    width={400}
                    height={300}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-semibold">{t('home.services.business.title')}</h3>
                    <p className="mt-2 text-sm text-white/80">{t('home.services.business.description')}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}