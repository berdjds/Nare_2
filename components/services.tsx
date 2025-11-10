import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/use-language'
import { useImages } from '@/lib/hooks/use-images'
import { ImageWithFallback } from '@/components/image-with-fallback'
import Link from 'next/link'
import { MapPin, Globe, Briefcase, ArrowRight } from 'lucide-react'

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
      title: t('home.services.daily.title'),
      description: t('home.services.daily.description'),
      image: images.tourGarni,
      href: '/armenia-tours/daily',
      color: 'bg-primary'
    },
    {
      icon: Globe,
      title: t('home.services.international.title'),
      description: t('home.services.international.description'),
      image: images.destinationDubai,
      href: '/services/outgoing-packages',
      color: 'bg-blue-500'
    },
    {
      icon: Briefcase,
      title: t('home.services.business.title'),
      description: t('home.services.business.description'),
      image: images.serviceMice,
      href: '/b2b',
      color: 'bg-secondary'
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
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm mb-6 shadow-lg shadow-primary/20"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {t('home.services.tagline') || 'What We Offer'}
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
          
          {/* Decorative line */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-primary rounded-full" />
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-secondary" />
            <div className="w-16 h-1 bg-gradient-to-l from-transparent via-secondary to-secondary rounded-full" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Link href={service.href} className="block h-full">
                  <Card className="group cursor-pointer overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 h-full bg-white relative">
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-700" />
                    
                    <div className="relative">
                      {/* Image section */}
                      <div className="relative overflow-hidden aspect-[16/10]">
                        <ImageWithFallback
                          src={service.image}
                          fallbackKey="heroVernissage"
                          alt={service.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          width={500}
                          height={312}
                          priority={index === 0}
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
                        
                        {/* Icon badge - brand colors */}
                        <div className={`absolute top-6 ${isArabic ? 'right-6' : 'left-6'} z-10`}>
                          <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color === 'bg-primary' ? 'from-primary to-primary/80' : service.color === 'bg-blue-500' ? 'from-blue-500 to-blue-600' : 'from-secondary to-secondary/80'} shadow-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                            <Icon className="w-7 h-7 text-white" />
                            {/* Pulse effect */}
                            <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping" style={{ animationDuration: '2s' }} />
                          </div>
                        </div>
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      
                      {/* Content section */}
                      <CardContent className="p-8">
                        <div className="space-y-4">
                          {/* Title with brand color on hover */}
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                            {service.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-gray-600 leading-relaxed min-h-[48px]">
                            {service.description}
                          </p>
                          
                          {/* CTA section */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            {/* Animated progress bar */}
                            <div className="flex-1 mr-4">
                              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary to-secondary w-0 group-hover:w-full transition-all duration-700 ease-out" />
                              </div>
                            </div>
                            
                            {/* Arrow button with brand gradient */}
                            <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20">
                              <ArrowRight className={`w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300 ${isArabic ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
