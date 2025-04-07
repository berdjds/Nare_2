"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users2, CalendarRange, Globe2, Briefcase, Building, Plane, Hotel } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';

interface ServiceItem {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
}

const services: ServiceItem[] = [
  {
    icon: Building2,
    title: 'DMC Services',
    description: 'Comprehensive Destination Management Company services in Armenia',
    features: [
      'Local expertise and knowledge',
      'Ground handling services',
      'Hotel and venue selection',
      'Transportation management',
      'Local activity coordination'
    ]
  },
  {
    icon: Users2,
    title: 'MICE Solutions',
    description: 'Complete MICE event planning and management',
    features: [
      'Meeting and conference organization',
      'Incentive travel programs',
      'Corporate event management',
      'Exhibition support services',
      'Team building activities'
    ]
  },
  {
    icon: Plane,
    title: 'Corporate Travel',
    description: 'Efficient business travel management services',
    features: [
      'Flight reservations',
      'Hotel bookings',
      'Ground transportation',
      'Travel policy compliance',
      '24/7 support'
    ]
  },
  {
    icon: Hotel,
    title: 'Group Bookings',
    description: 'Specialized services for large group travel',
    features: [
      'Bulk reservations',
      'Custom itineraries',
      'Group rates negotiation',
      'Logistics coordination',
      'On-site support'
    ]
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

export default function B2BPage() {
  const { t } = useLanguage();
  const { getImageUrl } = useImages();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="page-hero-section">
        <Image
          src={getImageUrl('serviceMice')}
          alt="B2B Services"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('b2b.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              {t('b2b.hero.subtitle')}
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">{t('b2b.hero.cta')}</Link>
            </Button>
          </motion.div>
        </div>
      </section>


      {/* Services Section */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">{t('b2b.services.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('b2b.services.subtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.title} variants={itemVariants}>
                  <Card className="h-full">
                    <CardHeader>
                      <Icon className="h-12 w-12 mb-4 text-primary" />
                      <CardTitle>{t(`b2b.services.${service.title.toLowerCase()}.title`)}</CardTitle>
                      <CardDescription>
                        {t(`b2b.services.${service.title.toLowerCase()}.description`)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span className="text-muted-foreground">
                              {t(`b2b.services.${service.title.toLowerCase()}.features.${index}`)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">{t('b2b.whyChooseUs.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('b2b.whyChooseUs.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Globe2 className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">{t('b2b.whyChooseUs.global.title')}</h3>
                <p className="text-muted-foreground">{t('b2b.whyChooseUs.global.description')}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Building className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">{t('b2b.whyChooseUs.local.title')}</h3>
                <p className="text-muted-foreground">{t('b2b.whyChooseUs.local.description')}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <CalendarRange className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">{t('b2b.whyChooseUs.experience.title')}</h3>
                <p className="text-muted-foreground">{t('b2b.whyChooseUs.experience.description')}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">{t('b2b.whyChooseUs.professional.title')}</h3>
                <p className="text-muted-foreground">{t('b2b.whyChooseUs.professional.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">{t('b2b.cta.title')}</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              {t('b2b.cta.subtitle')}
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">{t('b2b.cta.button')}</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}