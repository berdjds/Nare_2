"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, MapPin, Mountain } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';
import { BookNowButton } from '@/components/book-now-button';
import { getLocalizedTourPackage } from '@/lib/localization-helper';
import { PageBanner } from '@/components/page-banner';

interface Tour {
  id: string;
  title: string;
  titleHy?: string;
  titleRu?: string;
  description: string;
  descriptionHy?: string;
  descriptionRu?: string;
  duration: string;
  groupSize: string;
  location: string;
  price: number;
  image: string;
  category: 'daily' | 'cultural' | 'adventure';
  isActive?: boolean;
}

export default function AdventureTours() {
  const { t, currentLanguage } = useLanguage();
  const { images } = useImages();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tours from admin API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/content/tourPackages');
        if (response.ok) {
          const data = await response.json();
          // Filter only active adventure tours
          const adventureTours = data.filter((tour: Tour) => 
            tour.category === 'adventure' && tour.isActive !== false
          );
          setTours(adventureTours);
        }
      } catch (error) {
        console.error('Failed to fetch tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <>
      {/* Page Banner - Managed in Admin > Page Banners */}
      <PageBanner pageId="armenia-tours-adventure" />
      
      <div className="min-h-screen py-20">
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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading tours...</p>
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No adventure tours available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour, index) => {
              const localizedTour = getLocalizedTourPackage(tour, currentLanguage);
              
              return (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    {tour.image && (
                      <div className="relative h-48">
                        <Image
                          src={tour.image}
                          alt={localizedTour.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    {!tour.image && (
                      <div className="relative h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{localizedTour.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{localizedTour.description}</p>
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
              );
            })}
          </div>
        )}
      </section>
    </div>
    </>
  );
}