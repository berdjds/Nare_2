"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, MapPin, Camera } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { BookNowButton } from '@/components/book-now-button';

const tours = [
  {
    title: 'Armenian Heritage Tour',
    description: 'Discover the rich cultural heritage of Armenia',
    duration: '5 days',
    groupSize: '2-12',
    location: 'Multiple Regions',
    image: 'https://images.unsplash.com/photo-1589307357824-96e63ff87e33',
    price: 250000,
  },
  {
    title: 'Monastery Circuit',
    description: 'Visit the most significant monasteries of Armenia',
    duration: '3 days',
    groupSize: '2-12',
    location: 'Various Provinces',
    image: 'https://images.unsplash.com/photo-1589307357824-96e63ff87e33',
    price: 150000,
  },
  // Add more cultural tours
];

export default function CulturalTours() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="relative h-[40vh] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1589307357824-96e63ff87e33"
          alt="Cultural Tours"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative container text-center text-white"
        >
          <h1 className="text-4xl font-bold mb-4">{t('tours.culturalTitle')}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('tours.culturalDescription')}
          </p>
        </motion.div>
      </section>

      <section className="container py-12">
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