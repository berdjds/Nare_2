"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileCheck,
  Globe,
  Clock,
  CheckCircle,
  FileText,
  Building,
  Calendar,
  Users,
  Building2,
  LucideIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';
import { PageBanner } from '@/components/page-banner';

interface ServiceIconProps {
  icon: LucideIcon;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({ icon: Icon }) => {
  if (!Icon) return null;
  return <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />;
};

interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

const visaTypes = [
  { id: 'schengen', icon: Globe },
  { id: 'usTourist', icon: Building2 },
  { id: 'business', icon: FileText },
  { id: 'student', icon: Users },
];

const services = [
  { id: 'documentReview', icon: FileCheck },
  { id: 'applicationSupport', icon: CheckCircle },
  { id: 'appointmentBooking', icon: Calendar },
  { id: 'fastProcessing', icon: Clock },
];

export default function VisaAssistance() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { images } = useImages();

  const handleConsultation = () => {
    toast({
      title: t('services.visaAssistance.toast.title'),
      description: t('services.visaAssistance.toast.description'),
    });
  };

  return (
    <>
      {/* Page Banner - Managed in Admin > Page Banners */}
      <PageBanner pageId="visa-assistance" />
      
      <div className="min-h-screen">
      <section className="page-hero-section">
        <Image
          src={images.serviceVisa}
          alt="Visa Assistance"
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
          <h1 className="text-4xl font-bold mb-4">{t('services.visaAssistance.hero.title')}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('services.visaAssistance.hero.subtitle')}
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">{t('services.visaAssistance.types.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('services.visaAssistance.types.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {visaTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <ServiceIcon icon={type.icon} />
                  <CardTitle>{t(`services.visaAssistance.types.${type.id}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t(`services.visaAssistance.types.${type.id}.description`)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive visa application support
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <ServiceIcon icon={service.icon} />
                  <CardTitle>{t(`services.visaAssistance.services.${service.id}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t(`services.visaAssistance.services.${service.id}.description`)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">{t('services.visaAssistance.cta.title')}</h2>
          <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
            {t('services.visaAssistance.cta.subtitle')}
          </p>
          <Button size="lg" onClick={handleConsultation}>
            {t('services.visaAssistance.cta.button')}
          </Button>
        </motion.div>
      </section>
    </div>
    </>
  );
}