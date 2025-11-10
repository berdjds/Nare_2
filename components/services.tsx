import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/use-language'
import { useImages } from '@/lib/hooks/use-images'
import { ImageWithFallback } from '@/components/image-with-fallback'
import Link from 'next/link'
import { MapPin, Globe, Briefcase, ArrowRight, Sparkles, Star, TrendingUp, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  const services = [
    {
      icon: MapPin,
      title: t('home.services.daily.title') || 'Daily Tours',
      description: t('home.services.daily.description') || 'Discover Armenia\'s most beautiful destinations with expert local guides',
      image: images.tourGarni,
      href: '/armenia-tours/daily',
      color: 'orange',
      stats: { icon: Star, label: t('home.services.daily.stats') || '500+ Tours', value: '4.9/5' },
      features: [
        t('home.services.daily.feature1') || 'Expert Guides',
        t('home.services.daily.feature2') || 'Small Groups',
        t('home.services.daily.feature3') || 'Flexible Schedule'
      ]
    },
    {
      icon: Globe,
      title: t('home.services.international.title') || 'International Travel',
      description: t('home.services.international.description') || 'Explore worldwide destinations with our curated travel packages',
      image: images.destinationDubai,
      href: '/services/outgoing-packages',
      color: 'blue',
      stats: { icon: TrendingUp, label: t('home.services.international.stats') || '50+ Destinations', value: '10K+' },
      features: [
        t('home.services.international.feature1') || 'Visa Support',
        t('home.services.international.feature2') || 'Best Deals',
        t('home.services.international.feature3') || 'Custom Packages'
      ]
    },
    {
      icon: Briefcase,
      title: t('home.services.business.title') || 'Business Travel',
      description: t('home.services.business.description') || 'Professional MICE and DMC services for corporate clients',
      image: images.serviceMice,
      href: '/b2b',
      color: 'purple',
      stats: { icon: Award, label: t('home.services.business.stats') || 'Corporate Events', value: '200+' },
      features: [
        t('home.services.business.feature1') || 'MICE Services',
        t('home.services.business.feature2') || 'DMC Solutions',
        t('home.services.business.feature3') || '24/7 Support'
      ]
    }
  ]

  return (
    <motion.section 
      className="py-24 bg-white relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="container relative z-10">
        <motion.div className="text-center mb-16 max-w-4xl mx-auto" variants={itemVariants}>
          {/* Tagline Badge using shadcn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#FF6B35] to-[#FF8F6B] hover:from-[#FF5722] hover:to-[#FF6B35] text-white border-0 shadow-lg gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              {t('home.services.tagline') || 'What We Offer'}
            </Badge>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            {t('home.services.title') || 'Our Services'}
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-6 font-medium">
            {t('home.services.subtitle') || 'Experience excellence in travel with our dedicated services'}
          </p>
          {/* Description paragraph */}
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {t('home.services.description') || 'From exploring ancient wonders to planning your dream getaway, we provide comprehensive travel solutions tailored to your needs. With over a decade of expertise, we turn your travel aspirations into unforgettable experiences.'}
          </p>
          
          {/* Decorative separator using shadcn */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <Separator className="w-16 bg-gradient-to-r from-transparent via-[#FF6B35] to-[#FF6B35] h-1 rounded-full" />
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#2196F3] shadow-lg" />
            <Separator className="w-16 bg-gradient-to-l from-transparent via-[#2196F3] to-[#2196F3] h-1 rounded-full" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            const StatIcon = service.stats.icon
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <TooltipProvider>
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <Link href={service.href} className="block h-full group/card">
                  <Card className="cursor-pointer overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 h-full bg-white relative group-hover/card:scale-[1.02]">
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover/card:from-primary/5 group-hover/card:to-secondary/5 transition-all duration-700" />
                    
                    <div className="relative">
                      {/* Image section */}
                      <div className="relative overflow-hidden aspect-[16/10]">
                        <ImageWithFallback
                          src={service.image}
                          fallbackKey="heroVernissage"
                          alt={service.title}
                          className="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-700"
                          width={500}
                          height={312}
                          priority={index === 0}
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
                        
                        {/* Icon badge with tooltip - brand colors */}
                        <div className={`absolute top-6 ${isArabic ? 'right-6' : 'left-6'} z-10`}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={cn(
                                "relative w-14 h-14 rounded-2xl bg-gradient-to-br shadow-2xl flex items-center justify-center transform group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-500 cursor-pointer",
                                service.color === 'orange' ? 'from-[#FF6B35] to-[#FF5722]' : 
                                service.color === 'blue' ? 'from-[#2196F3] to-[#1976D2]' : 
                                'from-[#7C3AED] to-[#6D28D9]'
                              )}>
                                <Icon className="w-7 h-7 text-white" />
                                {/* Pulse effect */}
                                <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping" style={{ animationDuration: '2s' }} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-gray-900 text-white border-0">
                              <p className="font-semibold">{service.title}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        
                        {/* Stats badge */}
                        <div className="absolute top-6 right-6 z-10">
                          <Badge className="bg-white/95 backdrop-blur-sm text-gray-900 border-0 shadow-lg hover:bg-white gap-1.5 px-3">
                            <StatIcon className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">{service.stats.value}</span>
                          </Badge>
                        </div>
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                      </div>
                      
                      {/* Content section */}
                      <CardContent className="p-8">
                        <div className="space-y-4">
                          {/* Title with brand color on hover */}
                          <h3 className="text-2xl font-bold text-gray-900 group-hover/card:text-primary transition-colors duration-300">
                            {service.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-gray-600 leading-relaxed min-h-[48px]">
                            {service.description}
                          </p>
                          
                          {/* Feature tags */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {service.features.slice(0, 2).map((feature, idx) => (
                              <Badge key={idx} className={cn(
                                "text-xs font-normal border-0",
                                service.color === 'orange' ? 'bg-[#FF6B35]/10 text-[#FF6B35]' :
                                service.color === 'blue' ? 'bg-[#2196F3]/10 text-[#2196F3]' :
                                'bg-[#7C3AED]/10 text-[#7C3AED]'
                              )}>
                                {feature}
                              </Badge>
                            ))}
                          </div>
                          
                          {/* CTA section with shadcn Button */}
                          <Separator className="my-4" />
                          <div className="flex items-center justify-between pt-2">
                            {/* Animated progress bar */}
                            <div className="flex-1 mr-4">
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className={cn(
                                  "h-full bg-gradient-to-r rounded-full w-0 group-hover/card:w-full transition-all duration-700 ease-out",
                                  service.color === 'orange' ? 'from-[#FF6B35] to-[#FF8F6B]' :
                                  service.color === 'blue' ? 'from-[#2196F3] to-[#64B5F6]' :
                                  'from-[#7C3AED] to-[#A78BFA]'
                                )} />
                              </div>
                            </div>
                            
                            {/* shadcn Button with brand gradient */}
                            <Button
                              size="icon"
                              className={cn(
                                "w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 shadow-md hover:shadow-lg border-0",
                                service.color === 'orange' && "hover:from-[#FF6B35] hover:to-[#FF8F6B]",
                                service.color === 'blue' && "hover:from-[#2196F3] hover:to-[#64B5F6]",
                                service.color === 'purple' && "hover:from-[#7C3AED] hover:to-[#A78BFA]",
                                isArabic && "rotate-180"
                              )}
                            >
                              <ArrowRight className="w-6 h-6 text-gray-700 group-hover/card:text-white transition-colors duration-300" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                      </Link>
                    </HoverCardTrigger>
                    
                    {/* Rich hover preview */}
                    <HoverCardContent 
                      side="top" 
                      align="center"
                      className="w-80 p-0 border-0 shadow-2xl"
                    >
                      <Card className="border-0">
                        <CardHeader className="space-y-3 pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
                                service.color === 'orange' ? 'from-[#FF6B35] to-[#FF5722]' : 
                                service.color === 'blue' ? 'from-[#2196F3] to-[#1976D2]' : 
                                'from-[#7C3AED] to-[#6D28D9]'
                              )}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{service.title}</CardTitle>
                                <CardDescription className="text-xs flex items-center gap-1 mt-1">
                                  <StatIcon className="w-3 h-3" />
                                  {service.stats.label}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {service.stats.value}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {service.description}
                          </p>
                          <Separator />
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('home.services.keyFeatures') || 'Key Features'}</p>
                            <div className="flex flex-wrap gap-2">
                              {service.features.map((feature, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button className="w-full bg-gradient-to-r from-[#FF6B35] to-[#2196F3] hover:from-[#FF5722] hover:to-[#1976D2] text-white border-0 shadow-lg" size="sm">
                            {t('home.services.learnMore') || 'Learn More'}
                            <ArrowRight className={cn("w-4 h-4 ml-2", isArabic && "rotate-180")} />
                          </Button>
                        </CardContent>
                      </Card>
                    </HoverCardContent>
                  </HoverCard>
                </TooltipProvider>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
