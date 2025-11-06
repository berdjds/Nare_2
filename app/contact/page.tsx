"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';
import Image from 'next/image';
import { getLocalizedAddress, getLocalizedOfficeHours } from '@/lib/localization-helper';
import { PageBanner } from '@/components/page-banner';

interface ContactInfo {
  phone: string;
  phone2?: string;
  email: string;
  address: string;
  addressUrl?: string;
  mapEmbedUrl?: string;
  whatsapp: string;
  telegram: string;
  officeHours?: {
    weekdays?: string;
    saturday?: string;
    sunday?: string;
    support?: string;
  };
}


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

export default function Contact() {
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();
  const { images } = useImages();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/content/contactInfo');
        if (response.ok) {
          const data = await response.json();
          setContactInfo(data);
        }
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: t('contact.form.success.title'),
      description: t('contact.form.success.message'),
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <PageBanner
        pageId="contact"
        fallbackTitle={t('contact.hero.title')}
        fallbackSubtitle={t('contact.hero.subtitle')}
        fallbackImage={images.teamOffice}
      />

      {/* Contact Information */}
      <section className="py-16">
        <div className="container">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">{t('contact.info.loading')}</p>
            </div>
          ) : !contactInfo ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">{t('contact.info.notAvailable')}</p>
            </div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
              >
                <motion.div variants={itemVariants}>
                  <Card className="p-6 text-center h-full">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">{t('contact.info.email')}</h3>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 text-center h-full">
                    <Phone className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">{t('contact.info.phone')}</h3>
                    <div className="space-y-1">
                      <a
                        href={`tel:${contactInfo.phone.replace(/[^+0-9]/g, '')}`}
                        className="block text-muted-foreground hover:text-primary transition-colors"
                      >
                        {contactInfo.phone}
                      </a>
                      {contactInfo.phone2 && (
                        <a
                          href={`tel:${contactInfo.phone2.replace(/[^+0-9]/g, '')}`}
                          className="block text-muted-foreground hover:text-primary transition-colors"
                        >
                          {contactInfo.phone2}
                        </a>
                      )}
                    </div>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 text-center h-full">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Address</h3>
                    {contactInfo.addressUrl ? (
                      <a
                        href={contactInfo.addressUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {getLocalizedAddress(contactInfo, currentLanguage)}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{getLocalizedAddress(contactInfo, currentLanguage)}</p>
                    )}
                  </Card>
                </motion.div>
              </motion.div>
            </>
          )}

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">{t('contact.form.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.form.name')}</Label>
                    <Input id="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.form.email')}</Label>
                    <Input type="email" id="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t('contact.form.subject')}</Label>
                    <Input id="subject" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{t('contact.form.message')}</Label>
                    <Textarea id="message" rows={5} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Map or Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 h-full">
                <h2 className="text-2xl font-bold mb-6">{t('contact.office.title')}</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {t('contact.office.description')}
                  </p>
                  {contactInfo?.mapEmbedUrl && (
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      <iframe
                        src={contactInfo.mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  )}
                  {contactInfo?.officeHours && (
                    <div className="space-y-2">
                      <p className="font-semibold">{t('contact.info.officeHours')}</p>
                      {getLocalizedOfficeHours(contactInfo.officeHours, 'weekdays', currentLanguage) && (
                        <p className="text-muted-foreground">
                          {getLocalizedOfficeHours(contactInfo.officeHours, 'weekdays', currentLanguage)}
                        </p>
                      )}
                      {getLocalizedOfficeHours(contactInfo.officeHours, 'saturday', currentLanguage) && (
                        <p className="text-muted-foreground">
                          {getLocalizedOfficeHours(contactInfo.officeHours, 'saturday', currentLanguage)}
                        </p>
                      )}
                      {getLocalizedOfficeHours(contactInfo.officeHours, 'sunday', currentLanguage) && (
                        <p className="text-muted-foreground">
                          {getLocalizedOfficeHours(contactInfo.officeHours, 'sunday', currentLanguage)}
                        </p>
                      )}
                      {getLocalizedOfficeHours(contactInfo.officeHours, 'support', currentLanguage) && (
                        <p className="text-muted-foreground font-medium text-primary mt-1">
                          {getLocalizedOfficeHours(contactInfo.officeHours, 'support', currentLanguage)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}