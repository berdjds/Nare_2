"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users2, Award, Clock, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';

const stats = [
  {
    icon: Users2,
    value: '5000+',
    label: 'Happy Travelers'
  },
  {
    icon: Award,
    value: '10+',
    label: 'Years Experience'
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Customer Support'
  },
  {
    icon: Globe,
    value: '50+',
    label: 'Destinations'
  }
];

const teamMembers = [
  {
    name: 'Nare Sargsyan',
    role: 'Founder & CEO',
    image: '/images/team/team-member-1.webp'
  },
  {
    name: 'Davit Grigoryan',
    role: 'Travel Consultant',
    image: '/images/team/team-member-2.webp'
  },
  {
    name: 'Marine Hovhannisyan',
    role: 'Visa Specialist',
    image: '/images/team/team-member-3.webp'
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

export default function AboutPage() {
  const { t } = useLanguage();
  const { getImageUrl } = useImages();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <Image
          src={getImageUrl('teamOffice')}
          alt="About Us"
          fill
          className="object-cover"
          priority
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl">
              {t('about.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted section-padding">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} variants={itemVariants}>
                  <Card className="text-center h-full">
                    <CardContent className="pt-6">
                      <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <div className="text-3xl font-bold mb-2">{stat.value}</div>
                      <div className="text-muted-foreground">{t(`about.stats.${stat.label.toLowerCase()}`)}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="section-title">{t('about.story.title')}</h2>
            <p className="section-subtitle">
              {t('about.story.content')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">{t('about.team.title')}</h2>
            <p className="section-subtitle">
              {t('about.team.subtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {teamMembers.map((member) => (
              <motion.div key={member.name} variants={itemVariants}>
                <Card className="overflow-hidden">
                  <div className="relative h-64">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="text-center pt-6">
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}