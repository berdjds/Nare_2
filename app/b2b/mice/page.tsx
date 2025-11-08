"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users2, Building2, Calendar, Globe2, Presentation, Coffee, MapPin, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';
import { PageBanner } from '@/components/page-banner';

const services = [
  {
    id: 'meetings',
    icon: Users2,
  },
  {
    id: 'incentives',
    icon: Trophy,
  },
  {
    id: 'conferences',
    icon: Presentation,
  },
  {
    id: 'events',
    icon: Calendar,
  },
];

const capabilities = [
  {
    id: 'venue',
    icon: Building2,
  },
  {
    id: 'activities',
    icon: MapPin,
  },
  {
    id: 'catering',
    icon: Coffee,
  },
  {
    id: 'standards',
    icon: Globe2,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function MICEServices() {
  const { t } = useLanguage();
  const { getImageUrl } = useImages();
  const { toast } = useToast();

  const handleContact = () => {
    toast({
      title: t('b2b.mice.toast.title'),
      description: t('b2b.mice.toast.description'),
    });
  };

  return (
    <>
      <PageBanner pageId="b2b-mice" />
      
      <section className="container py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={itemVariants}>
              <Card className="text-center h-full">
                <CardHeader>
                  <service.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle>{t(`b2b.mice.services.${service.id}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(`b2b.mice.services.${service.id}.description`)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">{t('b2b.mice.capabilities.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('b2b.mice.capabilities.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {capabilities.map((capability) => (
            <motion.div key={capability.id} variants={itemVariants}>
              <Card className="text-center h-full">
                <CardHeader>
                  <capability.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle>{t(`b2b.mice.capabilities.${capability.id}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(`b2b.mice.capabilities.${capability.id}.description`)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-muted rounded-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">{t('b2b.mice.cta.title')}</h2>
          <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
            {t('b2b.mice.cta.subtitle')}
          </p>
          <Button size="lg" onClick={handleContact}>
            {t('b2b.mice.cta.button')}
          </Button>
        </motion.div>
      </section>
    </>
  );
}