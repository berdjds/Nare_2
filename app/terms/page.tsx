"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';

export default function TermsOfService() {
  const { t } = useLanguage();
  const { images } = useImages();

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="page-hero-section bg-gradient-to-r from-indigo-600 to-blue-500 relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white text-center"
          >
            {t('terms.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white/90 text-center mt-4 max-w-3xl mx-auto"
          >
            {t('terms.hero.subtitle')}
          </motion.p>
        </div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${images.heroTatev})`, opacity: 0.6 }}
        ></div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <h2>{t('terms.title')}</h2>
            <p className="text-gray-600">{t('terms.lastUpdated')}: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <p>{t('terms.intro')}</p>
            
            <h3>{t('terms.sections.acceptance.title')}</h3>
            <p>{t('terms.sections.acceptance.content')}</p>
            
            <h3>{t('terms.sections.booking.title')}</h3>
            <p>{t('terms.sections.booking.intro')}</p>
            <ul>
              <li>{t('terms.sections.booking.items.0')}</li>
              <li>{t('terms.sections.booking.items.1')}</li>
              <li>{t('terms.sections.booking.items.2')}</li>
              <li>{t('terms.sections.booking.items.3')}</li>
            </ul>
            
            <h3>{t('terms.sections.payment.title')}</h3>
            <p>{t('terms.sections.payment.intro')}</p>
            <ul>
              <li>{t('terms.sections.payment.items.0')}</li>
              <li>{t('terms.sections.payment.items.1')}</li>
              <li>{t('terms.sections.payment.items.2')}</li>
            </ul>
            
            <h3>{t('terms.sections.cancellations.title')}</h3>
            <p>{t('terms.sections.cancellations.intro')}</p>
            <ul>
              <li>{t('terms.sections.cancellations.items.0')}</li>
              <li>{t('terms.sections.cancellations.items.1')}</li>
              <li>{t('terms.sections.cancellations.items.2')}</li>
              <li>{t('terms.sections.cancellations.items.3')}</li>
            </ul>
            
            <h3>{t('terms.sections.limitation.title')}</h3>
            <p>{t('terms.sections.limitation.content')}</p>
            <ul>
              <li>{t('terms.sections.limitation.items.0')}</li>
              <li>{t('terms.sections.limitation.items.1')}</li>
              <li>{t('terms.sections.limitation.items.2')}</li>
            </ul>
            
            <h3>{t('terms.sections.intellectual.title')}</h3>
            <p>{t('terms.sections.intellectual.content')}</p>
            
            <h3>{t('terms.sections.governing.title')}</h3>
            <p>{t('terms.sections.governing.content')}</p>
            
            <h3>{t('terms.sections.changes.title')}</h3>
            <p>{t('terms.sections.changes.content')}</p>
            
            <h3>{t('terms.sections.contact.title')}</h3>
            <p>{t('terms.sections.contact.content')}</p>
            <p>{t('terms.sections.contact.email')}: info@nare.am</p>
            <p>{t('terms.sections.contact.phone')}: +374-10-545046</p>
            <p>{t('terms.sections.contact.address')}: Teryan St 105/1, Citadel Business Center, Yerevan, Armenia</p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
