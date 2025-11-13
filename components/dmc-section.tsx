"use client";

import { motion, useInView } from 'framer-motion';
import { Building2, Globe, Users, Briefcase, Award, HeadphonesIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { useEffect, useState, useRef } from 'react';

function AnimatedNumber({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  // Extract numeric value from string like "500+" or "10,000+" or "100%" or "24/7"
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const hasPlus = value.includes('+');
  const hasPercent = value.includes('%');
  const hasSlash = value.includes('/');
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
    if (hasSlash) {
      // For "24/7" format - just show the first number
      return Math.floor(displayValue).toString() + '/7';
    }
    if (hasComma && displayValue >= 1000) {
      // For "10,000+" format
      return Math.floor(displayValue).toLocaleString();
    }
    if (hasPercent) {
      // For "100%" format
      return Math.floor(displayValue).toString();
    }
    return Math.floor(displayValue).toString();
  };

  return (
    <span ref={ref}>
      {formatValue()}{hasPlus ? '+' : ''}{hasPercent ? '%' : ''}
    </span>
  );
}

export function DMCSection() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Building2,
      title: t('home.dmc.services.mice.title'),
      description: t('home.dmc.services.mice.description'),
      color: "text-blue-600"
    },
    {
      icon: Globe,
      title: t('home.dmc.services.dmcService.title'),
      description: t('home.dmc.services.dmcService.description'),
      color: "text-green-600"
    },
    {
      icon: Users,
      title: t('home.dmc.services.groups.title'),
      description: t('home.dmc.services.groups.description'),
      color: "text-purple-600"
    },
    {
      icon: Briefcase,
      title: t('home.dmc.services.corporate.title'),
      description: t('home.dmc.services.corporate.description'),
      color: "text-orange-600"
    },
    {
      icon: Award,
      title: t('home.dmc.services.quality.title'),
      description: t('home.dmc.services.quality.description'),
      color: "text-red-600"
    },
    {
      icon: HeadphonesIcon,
      title: t('home.dmc.services.support.title'),
      description: t('home.dmc.services.support.description'),
      color: "text-teal-600"
    }
  ];

  const stats = [
    { number: "500+", label: t('home.dmc.stats.partners') },
    { number: "10,000+", label: t('home.dmc.stats.guests') },
    { number: "100%", label: t('home.dmc.stats.satisfaction') },
    { number: "24/7", label: t('home.dmc.stats.support') }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
            <span className="text-blue-400 text-sm font-semibold">{t('home.dmc.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('home.dmc.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('home.dmc.subtitle')}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                <AnimatedNumber value={stat.number} />
              </div>
              <div className="text-gray-400 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-2">
                <div className={`${service.color} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            {t('home.dmc.cta.title')}
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('home.dmc.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/b2b">
              <button className="group flex items-center space-x-2 bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-semibold">
                <span>{t('home.dmc.cta.viewServices')}</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
            <Link href="/contact">
              <button className="group flex items-center space-x-2 bg-white/10 border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg transition-all duration-300 font-semibold">
                <span>{t('home.dmc.cta.requestQuote')}</span>
              </button>
            </Link>
          </div>
          
          {/* Contact Info */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-blue-100 mb-2">{t('home.dmc.cta.directContact')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
              <a href="mailto:info@nare.am" className="hover:text-blue-200 transition-colors">
                📧 info@nare.am
              </a>
              <span className="hidden sm:inline text-blue-300">•</span>
              <a href="tel:+37491005046" className="hover:text-blue-200 transition-colors">
                📞 +374 91 005046
              </a>
              <span className="hidden sm:inline text-blue-300">•</span>
              <a href="tel:+37410545046" className="hover:text-blue-200 transition-colors">
                📞 +374 10 545046
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
