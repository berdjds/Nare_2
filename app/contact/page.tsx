"use client";

import { useState } from 'react';
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

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@nare.am',
    href: 'mailto:info@nare.am'
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+374-10-545046 / +374-91-005046',
    href: 'tel:+37410545046',
    mobileHref: 'tel:+37491005046'
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'Teryan St 105/1, Citadel Business Center',
    href: 'https://maps.app.goo.gl/5hJ5A6w6Z9YeJNZD6'
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

export default function Contact() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { images } = useImages();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <section className="page-hero-section">
        <Image
          src={images.teamOffice}
          alt={t('contact.hero.title')}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative container text-center text-white"
        >
          <h1 className="text-4xl font-bold mb-4">{t('contact.hero.title')}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t('contact.hero.subtitle')}
          </p>
        </motion.div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.label}
                  variants={itemVariants}
                  className="group"
                >
                  <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow duration-300">
                    <Icon className="h-8 w-8 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-semibold mb-2">{t(`contact.info.${info.label.toLowerCase()}.title`)}</h3>
                    
                    {info.href ? (
                      <a href={info.href} className="block text-muted-foreground hover:text-primary transition-colors">
                        <p className="text-muted-foreground">{info.value}</p>
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{info.value}</p>
                    )}
                    
                    {info.mobileHref && (
                      <div className="mt-2">
                        <a href={info.mobileHref} className="text-sm text-primary hover:underline">
                          Call mobile
                        </a>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
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
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.014889635281!2d44.51436937677336!3d40.19099437147437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406abce629a8b13d%3A0x317917f94a18f83!2sCitadel%20Business%20Center!5e0!3m2!1sen!2s!4v1700139427044!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Office Hours</p>
                    <p className="text-muted-foreground">Monday - Friday: 9:30 AM - 5:30 PM</p>
                    <p className="text-muted-foreground">Saturday: 9:30 AM - 2:30 PM</p>
                    <p className="text-muted-foreground">Sunday: Closed</p>
                    <p className="text-muted-foreground font-medium text-primary mt-1">Customer support available 24/7</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}