"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Clock, MapPin, Headphones, Shield, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';
import { BookNowButton } from '@/components/book-now-button';

interface TicketItem {
  titleKey: string;
  descriptionKey: string;
  image: keyof ReturnType<typeof useImages>['images'];
  duration: string;
  airline: string;
  destination: string;
  price: number;
}

const tickets: TicketItem[] = [
  {
    titleKey: 'airTickets.tickets.economy.title',
    descriptionKey: 'airTickets.tickets.economy.description',
    image: 'ticketEconomy',
    duration: '2-4h',
    airline: 'Multiple Airlines',
    destination: 'Popular Routes',
    price: 25000
  },
  {
    titleKey: 'airTickets.tickets.business.title',
    descriptionKey: 'airTickets.tickets.business.description',
    image: 'ticketBusiness',
    duration: '2-4h',
    airline: 'Premium Airlines',
    destination: 'Global Network',
    price: 150000
  },
  {
    titleKey: 'airTickets.tickets.group.title',
    descriptionKey: 'airTickets.tickets.group.description',
    image: 'ticketGroup',
    duration: 'Flexible',
    airline: 'Selected Airlines',
    destination: 'Custom Routes',
    price: 20000
  }
];

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
  const { t } = useLanguage();
  const { getImageUrl } = useImages();
  const { toast } = useToast();

  const handleRequestQuote = () => {
    toast({
      title: t('airTickets.toast.title'),
      description: t('airTickets.toast.description'),
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="page-hero-section">
        <Image
          src={getImageUrl('serviceFlight')}
          alt={t('airTickets.hero.title')}
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
          <h1 className="text-4xl font-bold mb-4">{t('airTickets.hero.title')}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('airTickets.hero.subtitle')}
          </p>
        </motion.div>
      </section>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <motion.div
              key={ticket.titleKey}
              variants={itemVariants}
              initial="hidden"
              animate="show"
            >
              <Card className="h-full">
                <div className="relative h-48">
                  <Image
                    src={getImageUrl(ticket.image)}
                    alt={t(ticket.titleKey)}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{t(ticket.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{t(ticket.descriptionKey)}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{t('airTickets.common.duration')}: {ticket.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4" />
                        <span>{t('airTickets.common.airline')}: {ticket.airline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{t('airTickets.common.destination')}: {ticket.destination}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="text-lg font-semibold">
                        {t('airTickets.tickets.economy.from')} {ticket.price.toLocaleString()} {t('airTickets.common.currency')}
                      </div>
                      <BookNowButton />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

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