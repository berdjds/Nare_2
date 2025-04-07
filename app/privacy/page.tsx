"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';

export default function PrivacyPolicy() {
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
            {t('privacy.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white/90 text-center mt-4 max-w-3xl mx-auto"
          >
            {t('privacy.hero.subtitle')}
          </motion.p>
        </div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${images.heroNoravank})`, opacity: 0.6 }}
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
            <h2>{t('privacy.policy')}</h2>
            <p className="text-gray-600">{t('privacy.lastUpdated')}: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <p>{t('privacy.intro')}</p>
            
            <h3>{t('privacy.sections.collect.title')}</h3>
            <p>{t('privacy.sections.collect.intro')}</p>
            <ul>
              <li>{t('privacy.sections.collect.items.0')}</li>
              <li>{t('privacy.sections.collect.items.1')}</li>
              <li>{t('privacy.sections.collect.items.2')}</li>
              <li>{t('privacy.sections.collect.items.3')}</li>
              <li>{t('privacy.sections.collect.items.4')}</li>
            </ul>
            
            <p>{t('privacy.sections.collect.typesIntro')}</p>
            <ul>
              <li>{t('privacy.sections.collect.types.0')}</li>
              <li>{t('privacy.sections.collect.types.1')}</li>
              <li>{t('privacy.sections.collect.types.2')}</li>
              <li>{t('privacy.sections.collect.types.3')}</li>
              <li>{t('privacy.sections.collect.types.4')}</li>
            </ul>
            
            <h3>{t('privacy.sections.use.title')}</h3>
            <p>{t('privacy.sections.use.intro')}</p>
            <ul>
              <li>{t('privacy.sections.use.items.0')}</li>
              <li>{t('privacy.sections.use.items.1')}</li>
              <li>{t('privacy.sections.use.items.2')}</li>
              <li>{t('privacy.sections.use.items.3')}</li>
              <li>{t('privacy.sections.use.items.4')}</li>
            </ul>
            
            <h3>{t('privacy.sections.share.title')}</h3>
            <p>{t('privacy.sections.share.intro')}</p>
            <ul>
              <li>{t('privacy.sections.share.items.0')}</li>
              <li>{t('privacy.sections.share.items.1')}</li>
              <li>{t('privacy.sections.share.items.2')}</li>
            </ul>
            
            <h3>{t('privacy.sections.security.title')}</h3>
            <p>{t('privacy.sections.security.intro')}</p>
            
            <h3>{t('privacy.sections.rights.title')}</h3>
            <p>{t('privacy.sections.rights.intro')}</p>
            <ul>
              <li>{t('privacy.sections.rights.items.0')}</li>
              <li>{t('privacy.sections.rights.items.1')}</li>
              <li>{t('privacy.sections.rights.items.2')}</li>
              <li>{t('privacy.sections.rights.items.3')}</li>
              <li>{t('privacy.sections.rights.items.4')}</li>
            </ul>
            
            <h3>{t('privacy.sections.changes.title')}</h3>
            <p>{t('privacy.sections.changes.intro')}</p>
            
            <h3>{t('privacy.sections.contact.title')}</h3>
            <p>{t('privacy.sections.contact.intro')}</p>
            <p>{t('privacy.sections.contact.email')}: info@nare.am</p>
            <p>{t('privacy.sections.contact.phone')}: +374-10-545046</p>
            <p>{t('privacy.sections.contact.address')}: Teryan St 105/1, Citadel Business Center, Yerevan, Armenia</p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
