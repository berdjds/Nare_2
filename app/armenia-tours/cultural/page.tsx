"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, MapPin } from 'lucide-react';
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

export default function CulturalTours() {
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
          // Filter only active cultural tours
          const culturalTours = data.filter((tour: Tour) => 
            tour.category === 'cultural' && tour.isActive !== false
          );
          setTours(culturalTours);
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
      <PageBanner pageId="armenia-tours-cultural" />
      
      <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading tours...</p>
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No cultural tours available at the moment.</p>
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
      </div>
    </div>
    </>
  );
}