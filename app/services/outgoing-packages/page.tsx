"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookNowButton } from '@/components/book-now-button';
import { Clock, Globe, Users, Plane, Calendar, Hotel, MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';
import { getLocalizedOutgoingPackage } from '@/lib/localization-helper';
import { PageBanner } from '@/components/page-banner';

interface Package {
  id: string;
  title: string;
  titleHy?: string;
  titleRu?: string;
  description: string;
  descriptionHy?: string;
  descriptionRu?: string;
  duration: string;
  groupSize: string;
  destination: string;
  price: number;
  image: string;
  isActive?: boolean;
}

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
  const { t, currentLanguage } = useLanguage();
  const { images } = useImages();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch packages from admin API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/content/outgoingPackages');
        if (response.ok) {
          const data = await response.json();
          // Filter only active packages
          const activePackages = data.filter((pkg: Package) => pkg.isActive !== false);
          setPackages(activePackages);
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div>
      <PageBanner pageId="outgoing-packages" />

      <section className="container py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No packages available at the moment.</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {packages.map((pkg) => {
              const localizedPkg = getLocalizedOutgoingPackage(pkg, currentLanguage);
              
              return (
                <motion.div key={pkg.id} variants={item}>
                  <Card className="group hover:shadow-lg transition-shadow duration-300">
                    {pkg.image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={pkg.image}
                          alt={localizedPkg.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    {!pkg.image && (
                      <div className="relative h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{localizedPkg.title}</CardTitle>
                      <CardDescription>{localizedPkg.description}</CardDescription>
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
              );
            })}
          </motion.div>
        )}
      </section>
    </div>
  );
}