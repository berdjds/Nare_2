"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookNowButton } from '@/components/book-now-button';
import { Clock, Globe, Users, Plane, Calendar, Hotel, MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';

interface Package {
  id: number;
  title: string;
  description: string;
  duration: string;
  groupSize: string;
  destination: string;
  image: keyof ReturnType<typeof useImages>['images'];
  price: number;
}

const packages: Package[] = [
  {
    id: 1,
    title: 'Dubai Adventure',
    description: 'Experience the luxury and excitement of Dubai',
    duration: '5 days',
    groupSize: '2+',
    destination: 'UAE',
    image: 'destinationDubai',
    price: 450000,
  },
  {
    id: 2,
    title: 'European Highlights',
    description: 'Visit the most iconic cities of Europe',
    duration: '10 days',
    groupSize: '2+',
    destination: 'Europe',
    image: 'destinationEurope',
    price: 890000,
  },
  {
    id: 3,
    title: 'Turkish Delight',
    description: 'Explore the rich culture and history of Turkey',
    duration: '7 days',
    groupSize: '2+',
    destination: 'Turkey',
    image: 'destinationTurkey',
    price: 350000,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function OutgoingPackages() {
  const { t } = useLanguage();
  const { images } = useImages();

  return (
    <div>
      <section className="page-hero-section">
        <Image
          src={images.destinationDubai}
          alt={t('services.outgoingPackages.hero.title')}
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
          <h1 className="text-4xl font-bold mb-4">{t('services.outgoingPackages.hero.title')}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('services.outgoingPackages.hero.subtitle')}
          </p>
        </motion.div>
      </section>

      <section className="container py-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {packages.map((pkg) => (
            <motion.div key={pkg.id} variants={item}>
              <Card className="group hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={images[pkg.image]}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{pkg.title}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{pkg.groupSize} people</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{pkg.destination}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    {pkg.price.toLocaleString()} AMD
                  </span>
                  <BookNowButton />
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}