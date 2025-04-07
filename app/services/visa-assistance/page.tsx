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

const visaTypes: ServiceItem[] = [
  {
    title: 'Schengen Visa',
    description: 'Travel to European Union countries',
    icon: Globe,
  },
  {
    title: 'US Tourist Visa',
    description: 'Visit the United States',
    icon: Building2,
  },
  {
    title: 'Business Visa',
    description: 'For business travel purposes',
    icon: FileText,
  },
  {
    title: 'Student Visa',
    description: 'Study abroad opportunities',
    icon: Users,
  },
];

const services: ServiceItem[] = [
  {
    title: 'Document Review',
    description: 'Expert review of your visa application documents',
    icon: FileCheck,
  },
  {
    title: 'Application Support',
    description: 'Assistance with filling out visa applications',
    icon: CheckCircle,
  },
  {
    title: 'Appointment Booking',
    description: 'Embassy/consulate appointment scheduling',
    icon: Calendar,
  },
  {
    title: 'Fast Processing',
    description: 'Expedited visa processing when possible',
    icon: Clock,
  },
];

export default function VisaAssistance() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { images } = useImages();

  const handleConsultation = () => {
    toast({
      title: "Request Received",
      description: "Our visa specialist will contact you shortly.",
    });
  };

  return (
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
          <h1 className="text-4xl font-bold mb-4">Visa Assistance Services</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Professional support for your visa application process
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Visa Types We Handle</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expert assistance for various visa categories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {visaTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <ServiceIcon icon={type.icon} />
                  <CardTitle>{type.title}</CardTitle>
                </CardHeader>
                <CardContent>{type.description}</CardContent>
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
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <ServiceIcon icon={service.icon} />
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>{service.description}</CardContent>
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
          <h2 className="text-2xl font-bold mb-4">Ready to Apply?</h2>
          <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
            Get professional assistance with your visa application. Our experts will guide you through the entire process.
          </p>
          <Button size="lg" onClick={handleConsultation}>
            Request Consultation
          </Button>
        </motion.div>
      </section>
    </div>
  );
}