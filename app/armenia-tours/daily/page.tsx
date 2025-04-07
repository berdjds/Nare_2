"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { BookNowButton } from '@/components/book-now-button';
import { useImages } from '@/hooks/use-images';

export default function DailyTours() {
  const { t } = useLanguage();
  const { images } = useImages();

  const tours = [
    {
      title: 'Garni-Geghard Tour',
      description: 'Visit the pagan temple of Garni and the medieval monastery of Geghard',
      duration: '6 hours',
      groupSize: '1-15',
      location: 'Kotayk Province',
      image: images.tourGarni,
      price: 15000,
    },
    {
      title: 'Khor Virap & Noravank',
      description: 'Explore ancient monasteries with stunning mountain views',
      duration: '9 hours',
      groupSize: '1-15',
      location: 'Ararat & Vayots Dzor',
      image: images.tourNoravank,
      price: 25000,
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="page-hero-section">
        <Image
          src={images.heroNoravank}
          alt="Daily Tours"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative container mx-auto px-4 text-center text-white"
        >
          <h1 className="text-4xl font-bold mb-4">{t('armeniaTours.tours.dailyTitle')}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('armeniaTours.tours.dailyDescription')}
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour, index) => (
            <motion.div
              key={tour.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <div className="relative h-48">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{tour.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{tour.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{tour.groupSize} people</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{tour.location}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="text-lg font-semibold">
                        {tour.price.toLocaleString()} AMD
                      </div>
                      <BookNowButton />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}