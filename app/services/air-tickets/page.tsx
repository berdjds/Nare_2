"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Clock, MapPin, Headphones, Shield, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';
import { BookNowButton } from '@/components/book-now-button';
import { getLocalizedAirTicket } from '@/lib/localization-helper';
import { PageBanner } from '@/components/page-banner';

interface AirTicket {
  id: string;
  title: string;
  titleHy?: string;
  titleRu?: string;
  description: string;
  descriptionHy?: string;
  descriptionRu?: string;
  route: string;
  airline: string;
  ticketType: string;
  price: number;
  image: string;
  isActive?: boolean;
}

const features = [
  {
    icon: Headphones,
    titleKey: 'airTickets.features.support.title',
    descriptionKey: 'airTickets.features.support.description'
  },
  {
    icon: Shield,
    titleKey: 'airTickets.features.security.title',
    descriptionKey: 'airTickets.features.security.description'
  },
  {
    icon: Users,
    titleKey: 'airTickets.features.service.title',
    descriptionKey: 'airTickets.features.service.description'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AirTickets() {
  const { t, currentLanguage } = useLanguage();
  const { getImageUrl } = useImages();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<AirTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/content/airTickets');
        if (response.ok) {
          const data = await response.json();
          // Filter only active tickets
          const activeTickets = data.filter((ticket: AirTicket) => ticket.isActive !== false);
          setTickets(activeTickets);
        }
      } catch (error) {
        console.error('Failed to fetch air tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleRequestQuote = () => {
    toast({
      title: t('airTickets.toast.title'),
      description: t('airTickets.toast.description'),
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PageBanner pageId="air-tickets" fallbackImage={getImageUrl('serviceFlight')} />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {features.map((feature) => (
            <motion.div key={feature.titleKey} variants={itemVariants}>
              <Card className="text-center h-full">
                <CardHeader>
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle>{t(feature.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t(feature.descriptionKey)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tickets Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading air tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No air tickets available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => {
              const localizedTicket = getLocalizedAirTicket(ticket, currentLanguage);
              
              return (
                <motion.div
                  key={ticket.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                >
                  <Card className="h-full">
                    {ticket.image && (
                      <div className="relative h-48">
                        <Image
                          src={ticket.image}
                          alt={localizedTicket.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    {!ticket.image && (
                      <div className="relative h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{localizedTicket.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{localizedTicket.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{ticket.route}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Plane className="h-4 w-4" />
                            <span>{ticket.airline}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{ticket.ticketType}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                          <div className="text-lg font-semibold">
                            {ticket.price.toLocaleString()} AMD
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-muted rounded-lg p-8 text-center mt-12"
        >
          <h2 className="text-2xl font-bold mb-4">{t('airTickets.cta.title')}</h2>
          <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
            {t('airTickets.cta.subtitle')}
          </p>
          <Button size="lg" onClick={handleRequestQuote}>
            {t('airTickets.cta.button')}
          </Button>
        </motion.div>
      </section>
    </div>
  );
}