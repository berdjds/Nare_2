"use client";

import { Star, Users, Shield, Award, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

export function TrustBadges() {
  const { t } = useLanguage();
  
  const badges = [
    {
      icon: Star,
      text: t('home.trustBadges.rating'),
      subtext: t('home.trustBadges.ratingSubtext'),
      color: "text-yellow-500"
    },
    {
      icon: Users,
      text: t('home.trustBadges.travelers'),
      subtext: t('home.trustBadges.travelersSubtext'),
      color: "text-blue-500"
    },
    {
      icon: Shield,
      text: t('home.trustBadges.licensed'),
      subtext: t('home.trustBadges.licensedSubtext'),
      color: "text-green-500"
    },
    {
      icon: Award,
      text: t('home.trustBadges.experience'),
      subtext: t('home.trustBadges.experienceSubtext'),
      color: "text-purple-500"
    },
    {
      icon: Clock,
      text: t('home.trustBadges.support'),
      subtext: t('home.trustBadges.supportSubtext'),
      color: "text-orange-500"
    },
    {
      icon: CheckCircle,
      text: t('home.trustBadges.cancellation'),
      subtext: t('home.trustBadges.cancellationSubtext'),
      color: "text-teal-500"
    }
  ];

  return (
    <section className="py-8 bg-white border-y border-gray-100">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className={`${badge.color} mb-2 transform group-hover:scale-110 transition-transform duration-300`}>
                <badge.icon className="w-8 h-8" />
              </div>
              <div className="font-bold text-gray-900 text-lg">
                {badge.text}
              </div>
              <div className="text-sm text-gray-600">
                {badge.subtext}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
