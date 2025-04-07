"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, MapPin } from 'lucide-react';
import { BookNowButton } from '@/components/book-now-button';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';

interface TourCategory {
  id: string;
  image: keyof ReturnType<typeof useImages>['images'];
  href: string;
}

const tourCategories: TourCategory[] = [
  {
    id: 'daily',
    image: 'tourGarni',
    href: '/armenia-tours/daily',
  },
  {
    id: 'multi_day',
    image: 'tourKhorVirap',
    href: '',
  },
  {
    id: 'adventure',
    image: 'adventureHiking',
    href: '/armenia-tours/adventure',
  },
  {
    id: 'cultural',
    image: 'culturalMonastery',
    href: '/armenia-tours/cultural',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ArmeniaTours() {
  const { t } = useLanguage();
  const { getImageUrl } = useImages();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <Image
          src={getImageUrl('heroArmeniaMain')}
          alt={t('armeniaTours.hero.title')}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl text-white mx-auto text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('armeniaTours.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                {t('armeniaTours.hero.subtitle')}
              </p>
              <BookNowButton variant="secondary" size="lg" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tour Categories */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('armeniaTours.categories.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('armeniaTours.categories.subtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {tourCategories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <Link href={category.href}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 h-full overflow-hidden">
                    <div className="relative h-64">
                      <Image
                        src={getImageUrl(category.image)}
                        alt={t(`armeniaTours.categories.${category.id}.title`)}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">
                          {t(`armeniaTours.categories.${category.id}.title`)}
                        </h3>
                        <p className="text-white/90 mb-4">
                          {t(`armeniaTours.categories.${category.id}.description`)}
                        </p>
                      </div>
                    </div>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">
                            {t(`armeniaTours.categories.${category.id}.duration`)}
                          </p>
                        </div>
                        <div className="text-center">
                          <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">
                            {t(`armeniaTours.categories.${category.id}.groupSize`)}
                          </p>
                        </div>
                        <div className="text-center">
                          <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">
                            {t(`armeniaTours.categories.${category.id}.locations`)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('armeniaTours.cta.title')}
            </h2>
            <p className="text-lg opacity-90 mb-8">
              {t('armeniaTours.cta.subtitle')}
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                {t('armeniaTours.cta.button')}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}