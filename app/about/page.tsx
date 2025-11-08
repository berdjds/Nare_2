"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users2, Award, Clock, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useImages } from '@/hooks/use-images';
import { getLocalizedTeamMember } from '@/lib/localization-helper';
import { PageBanner } from '@/components/page-banner';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  positionHy?: string;
  positionRu?: string;
  bio: string;
  bioHy?: string;
  bioRu?: string;
  image: string;
  order: number;
  isActive?: boolean;
}

const stats = [
  {
    icon: Users2,
    value: '5000+',
    labelKey: 'happy travelers'
  },
  {
    icon: Award,
    value: '10+',
    labelKey: 'years experience'
  },
  {
    icon: Clock,
    value: '24/7',
    labelKey: 'customer support'
  },
  {
    icon: Globe,
    value: '50+',
    labelKey: 'destinations'
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
  const { t, currentLanguage } = useLanguage();
  const { getImageUrl } = useImages();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/content/teamMembers');
        if (response.ok) {
          const data = await response.json();
          // Filter only active members and sort by order
          const activeMembers = data
            .filter((member: TeamMember) => member.isActive !== false)
            .sort((a: TeamMember, b: TeamMember) => a.order - b.order);
          setTeamMembers(activeMembers);
        }
      } catch (error) {
        console.error('Failed to fetch team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <PageBanner pageId="about" />

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
                <motion.div key={stat.labelKey} variants={itemVariants}>
                  <Card className="text-center h-full">
                    <CardContent className="pt-6">
                      <Icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                      <p className="text-muted-foreground">{t(`about.stats.${stat.labelKey}`)}</p>
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

          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Loading team members...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No team members available.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {teamMembers.map((member) => {
                const localizedMember = getLocalizedTeamMember(member, currentLanguage);
                
                return (
                  <motion.div key={member.id} variants={itemVariants}>
                    <Card className="overflow-hidden">
                      {member.image && (
                        <div className="relative h-64">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      {!member.image && (
                        <div className="relative h-64 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <CardContent className="text-center pt-6">
                        <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                        <p className="text-muted-foreground">{localizedMember.position}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}