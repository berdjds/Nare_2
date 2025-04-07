"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, MapPin, Mountain } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';
import { BookNowButton } from '@/components/book-now-button';

interface TourItem {
  title: string;
  description: string;
  duration: string;
  groupSize: string;
  location: string;
  image: keyof ReturnType<typeof useImages>['images'];
  price: number;
}

const tours: TourItem[] = [
  {
    title: 'Mount Aragats Hiking',
    description: 'Climb the highest peak in Armenia',
    duration: '1 day',
    groupSize: '4-10',
    location: 'Aragats',
    image: 'adventureHiking',
    price: 35000,
  },
  {
    title: 'Dilijan Trail Adventure',
    description: 'Explore the Swiss Alps of Armenia',
    duration: '2 days',
    groupSize: '4-12',
    location: 'Dilijan',
    image: 'adventureCamping',
    price: 65000,
  },
  // Add more adventure tours
];

export default function AdventureTours() {
  const { t } = useLanguage();
  const { images } = useImages();

  return (
    <div>
      <section className="page-hero-section">
        <Image
          src={images.adventureHiking}
          alt={t('armeniaTours.tours.adventureTitle')}
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
          <h1 className="text-4xl font-bold mb-4">{t('armeniaTours.tours.adventureTitle')}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('armeniaTours.tours.adventureDescription')}
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
                    src={images[tour.image]}
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