"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Globe2, MapPin, Users2, Clock, Shield, Briefcase, Plane } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';
import { PageBanner } from '@/components/page-banner';

const services = [
  {
    id: 'ground',
    icon: Plane,
  },
  {
    id: 'hotels',
    icon: Building2,
  },
  {
    id: 'local',
    icon: MapPin,
  },
  {
    id: 'corporate',
    icon: Briefcase,
  },
];

const features = [
  {
    id: 'support',
    icon: Clock,
  },
  {
    id: 'network',
    icon: Globe2,
  },
  {
    id: 'team',
    icon: Users2,
  },
  {
    id: 'security',
    icon: Shield,
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

export default function DMCServices() {
  const { t } = useLanguage();
  const { getImageUrl } = useImages();
  const { toast } = useToast();

  const handleContact = () => {
    toast({
      title: t('b2b.dmc.toast.title'),
      description: t('b2b.dmc.toast.description'),
    });
  };

  return (
    <>
      <PageBanner pageId="b2b-dmc" />
      
      <section className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">{t('b2b.dmc.services.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('b2b.dmc.services.subtitle')}
          </p>
        </motion.div>

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
                  <CardTitle>{t(`b2b.dmc.services.${service.id}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(`b2b.dmc.services.${service.id}.description`)}
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
          <h2 className="text-3xl font-bold mb-4">{t('b2b.dmc.features.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('b2b.dmc.features.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature) => (
            <motion.div key={feature.id} variants={itemVariants}>
              <Card className="text-center h-full">
                <CardHeader>
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle>{t(`b2b.dmc.features.${feature.id}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(`b2b.dmc.features.${feature.id}.description`)}
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
          <h2 className="text-2xl font-bold mb-4">{t('b2b.dmc.cta.title')}</h2>
          <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
            {t('b2b.dmc.cta.subtitle')}
          </p>
          <Button size="lg" onClick={handleContact}>
            {t('b2b.dmc.cta.button')}
          </Button>
        </motion.div>
      </section>
    </>
  );
}