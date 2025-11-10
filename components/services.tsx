'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/use-language'
import { useImages } from '@/lib/hooks/use-images'
import { ImageWithFallback } from '@/components/image-with-fallback'
import Link from 'next/link'
import { MapPin, Globe, Briefcase, ArrowRight, Sparkles, Star, TrendingUp, Award, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function Services() {
  const { t, currentLanguage } = useLanguage()
  const { images } = useImages()
  const isArabic = currentLanguage === 'ar' || currentLanguage === ('ar' as any)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const services = [
    {
      icon: MapPin,
      title: t('home.services.daily.title') || 'Daily Tours',
      description: t('home.services.daily.description') || 'Discover Armenia\'s most beautiful destinations',
      image: images.tourGarni,
      href: '/armenia-tours/daily',
      color: 'orange',
      stats: { icon: Star, value: '4.9/5', label: t('home.services.daily.stats') || '500+ Tours' },
      features: [
        t('home.services.daily.feature1') || 'Expert Guides',
        t('home.services.daily.feature2') || 'Small Groups',
        t('home.services.daily.feature3') || 'Flexible Schedule'
      ]
    },
    {
      icon: Globe,
      title: t('home.services.international.title') || 'International Travel',
      description: t('home.services.international.description') || 'Explore worldwide destinations',
      image: images.destinationDubai,
      href: '/services/outgoing-packages',
      color: 'blue',
      stats: { icon: TrendingUp, value: '10K+', label: t('home.services.international.stats') || '50+ Destinations' },
      features: [
        t('home.services.international.feature1') || 'Visa Support',
        t('home.services.international.feature2') || 'Best Deals',
        t('home.services.international.feature3') || 'Custom Packages'
      ]
    },
    {
      icon: Briefcase,
      title: t('home.services.business.title') || 'Business Travel',
      description: t('home.services.business.description') || 'Professional MICE and DMC services',
      image: images.serviceMice,
      href: '/b2b',
      color: 'purple',
      stats: { icon: Award, value: '200+', label: t('home.services.business.stats') || 'Corporate Events' },
      features: [
        t('home.services.business.feature1') || 'MICE Services',
        t('home.services.business.feature2') || 'DMC Solutions',
        t('home.services.business.feature3') || '24/7 Support'
      ]
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'orange':
        return {
          gradient: 'from-[#FF6B35] to-[#FF5722]',
          bg: 'bg-[#FF6B35]/10',
          text: 'text-[#FF6B35]',
          border: 'border-[#FF6B35]/20',
          hover: 'hover:border-[#FF6B35]',
          lightBg: 'bg-[#FF6B35]/5'
        }
      case 'blue':
        return {
          gradient: 'from-[#2196F3] to-[#1976D2]',
          bg: 'bg-[#2196F3]/10',
          text: 'text-[#2196F3]',
          border: 'border-[#2196F3]/20',
          hover: 'hover:border-[#2196F3]',
          lightBg: 'bg-[#2196F3]/5'
        }
      case 'purple':
        return {
          gradient: 'from-[#7C3AED] to-[#6D28D9]',
          bg: 'bg-[#7C3AED]/10',
          text: 'text-[#7C3AED]',
          border: 'border-[#7C3AED]/20',
          hover: 'hover:border-[#7C3AED]',
          lightBg: 'bg-[#7C3AED]/5'
        }
      default:
        return {
          gradient: 'from-[#FF6B35] to-[#FF5722]',
          bg: 'bg-[#FF6B35]/10',
          text: 'text-[#FF6B35]',
          border: 'border-[#FF6B35]/20',
          hover: 'hover:border-[#FF6B35]',
          lightBg: 'bg-[#FF6B35]/5'
        }
    }
  }

  return (
    <motion.section 
      className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Modern background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-transparent to-transparent opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent opacity-70" />
      
      <div className="container relative z-10">
        {/* Header Section */}
        <motion.div className="text-center mb-20 max-w-4xl mx-auto" variants={itemVariants}>
          <Badge className="mb-6 px-5 py-2.5 text-sm font-semibold bg-[#FF6B35] text-white border-0 shadow-lg">
            <Sparkles className="w-4 h-4 mr-2" />
            {t('home.services.tagline') || 'What We Offer'}
          </Badge>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            {t('home.services.title') || 'Our Services'}
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-4 font-medium">
            {t('home.services.subtitle') || 'Experience excellence in travel'}
          </p>
          
          <Separator className="w-24 mx-auto h-1 bg-[#FF6B35]" />
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            const StatIcon = service.stats.icon
            const colors = getColorClasses(service.color)
            const isExpanded = expandedCard === index

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <Card className={cn(
                  "overflow-hidden border-2 transition-all duration-500 h-full flex flex-col",
                  colors.border,
                  colors.hover,
                  "hover:shadow-2xl shadow-lg bg-white"
                )}>
                  {/* Image Header */}
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={service.image}
                      fallbackKey="heroVernissage"
                      alt={service.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      width={600}
                      height={400}
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Icon Badge */}
                    <div className={cn(
                      "absolute top-6 left-6 w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500",
                      colors.gradient
                    )}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Stats Badge */}
                    <div className="absolute top-6 right-6">
                      <Badge className="bg-white/95 backdrop-blur-sm text-gray-900 border-0 shadow-lg gap-2 px-4 py-2">
                        <StatIcon className="w-4 h-4" />
                        <span className="font-bold">{service.stats.value}</span>
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    {/* Stats Label */}
                    <div className={cn("flex items-center gap-2 px-4 py-2.5 rounded-lg", colors.lightBg)}>
                      <StatIcon className={cn("w-4 h-4", colors.text)} />
                      <span className={cn("text-sm font-semibold", colors.text)}>
                        {service.stats.label}
                      </span>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        {t('home.services.keyFeatures') || 'Key Features'}
                      </p>
                      <div className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", colors.bg)}>
                              <Check className={cn("w-3 h-3", colors.text)} />
                            </div>
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  {/* Footer with CTA */}
                  <CardFooter className="pt-6 border-t">
                    <Link href={service.href} className="w-full">
                      <Button className={cn(
                        "w-full bg-gradient-to-r text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group/btn",
                        colors.gradient
                      )}>
                        {t('home.services.learnMore') || 'Explore Now'}
                        <ArrowRight className={cn(
                          "w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform",
                          isArabic && "rotate-180 group-hover/btn:-translate-x-1"
                        )} />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
