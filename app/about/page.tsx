"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users2, Award, Clock, Globe, ArrowRight, Sparkles } from 'lucide-react';
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
      <section className="section-padding bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const gradients = [
                'from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20',
                'from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20',
                'from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20',
                'from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20'
              ];
              const iconColors = [
                'text-blue-600 dark:text-blue-400',
                'text-purple-600 dark:text-purple-400',
                'text-orange-600 dark:text-orange-400',
                'text-green-600 dark:text-green-400'
              ];
              
              return (
                <motion.div key={stat.labelKey} variants={itemVariants}>
                  <Card className={`text-center h-full border-2 bg-gradient-to-br ${gradients[index]} transition-all duration-300 hover:shadow-lg hover:scale-105 group`}>
                    <CardContent className="pt-8 pb-6">
                      <div className="relative inline-block mb-4">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                        <Icon className={`h-14 w-14 relative ${iconColors[index]} group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                      <h3 className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {stat.value}
                      </h3>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        {t(`about.stats.${stat.labelKey}`)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Our Journey</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t('about.story.title')}
              </h2>
            </div>
            
            <Card className="border-2 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <p className="text-lg md:text-xl leading-relaxed text-muted-foreground text-center">
                  {t('about.story.content')}
                </p>
                
                {/* Decorative element */}
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2 text-primary">
                    <div className="h-px w-12 bg-primary/30" />
                    <ArrowRight className="w-5 h-5" />
                    <div className="h-px w-12 bg-primary/30" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gradient-to-b from-muted/50 to-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Users2 className="w-4 h-4" />
              <span className="text-sm font-medium">Meet the Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('about.team.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
              <p className="mt-4 text-lg text-muted-foreground">Loading team members...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="text-center py-12">
                <Users2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg text-muted-foreground">No team members available.</p>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {teamMembers.map((member) => {
                const localizedMember = getLocalizedTeamMember(member, currentLanguage);
                
                return (
                  <motion.div key={member.id} variants={itemVariants}>
                    <Card className="group overflow-hidden h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl">
                      <div className="relative h-80 overflow-hidden">
                        {member.image ? (
                          <>
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                            
                            {/* Bio overlay on hover */}
                            {localizedMember.bio && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                                <p className="text-white text-sm leading-relaxed text-center line-clamp-6">
                                  {localizedMember.bio}
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="relative h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Users2 className="w-20 h-20 text-primary/30" />
                          </div>
                        )}
                        
                        {/* Name and position overlay at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-0 group-hover:translate-y-full transition-transform duration-300">
                          <h3 className="text-2xl font-bold mb-1 drop-shadow-lg">{member.name}</h3>
                          <p className="text-sm text-white/90 font-medium drop-shadow-md">
                            {localizedMember.position}
                          </p>
                        </div>
                      </div>
                      
                      {/* Card content (shown when not hovering if there's a bio) */}
                      <CardContent className="p-6 bg-card">
                        <h3 className="text-xl font-semibold mb-1 text-center">{member.name}</h3>
                        <p className="text-sm text-primary font-medium text-center mb-3">
                          {localizedMember.position}
                        </p>
                        {localizedMember.bio && (
                          <p className="text-xs text-muted-foreground text-center italic">
                            Hover to read bio
                          </p>
                        )}
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