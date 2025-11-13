"use client";

import { Star, Users, Shield, Award, Clock, CheckCircle } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { useEffect, useState, useRef } from 'react';

function AnimatedNumber({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  // Extract numeric value from string like "4.8/5 Rating" or "10,000+"
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const hasPlus = value.includes('+');
  const hasDivision = value.includes('/');
  const hasComma = value.includes(',');

  useEffect(() => {
    if (!isInView || isNaN(numericValue)) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = numericValue / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  if (isNaN(numericValue)) {
    return <span>{value}</span>;
  }

  const formatValue = () => {
    if (hasDivision) {
      // For "4.8/5 Rating" format
      return `${displayValue.toFixed(1)}/5`;
    }
    if (hasComma && displayValue >= 1000) {
      // For "10,000+" format
      return Math.floor(displayValue).toLocaleString();
    }
    if (displayValue >= 10) {
      return Math.floor(displayValue).toString();
    }
    return displayValue.toFixed(1);
  };

  return (
    <span ref={ref}>
      {formatValue()}{hasPlus ? '+' : ''}{suffix}
    </span>
  );
}

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
                <AnimatedNumber value={badge.text} />
              </div>
              <div className="text-sm text-gray-600">
                <AnimatedNumber value={badge.subtext} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
