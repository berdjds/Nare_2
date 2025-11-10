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
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="container">
        <motion.div className="text-center mb-16 max-w-4xl mx-auto" variants={itemVariants}>
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold text-sm mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {t('home.services.tagline') || 'What We Offer'}
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {t('home.services.title') || 'Our Services'}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 font-medium">
            {t('home.services.subtitle') || 'Experience excellence in travel with our dedicated services'}
          </p>
          {/* Description paragraph */}
          <p className="text-base text-gray-500 leading-relaxed max-w-3xl mx-auto">
            {t('home.services.description') || 'From exploring ancient wonders to planning your dream getaway, we provide comprehensive travel solutions tailored to your needs. With over a decade of expertise, we turn your travel aspirations into unforgettable experiences.'}
          </p>
          
          {/* Decorative line */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Link href={service.href}>
                  <Card className="group cursor-pointer overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 h-full bg-white relative rounded-2xl">
                    {/* Premium gradient border glow */}
                    <div className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl blur-sm pointer-events-none" />
                    
                    {/* Card content wrapper */}
                    <div className="relative bg-white rounded-2xl overflow-hidden">
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <ImageWithFallback
                          src={service.image}
                          fallbackKey="heroVernissage"
                          alt={service.title}
                          className="transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 object-cover"
                          width={400}
                          height={300}
                          priority={index === 0}
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                        {/* Refined gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-500" />
                        
                        {/* Enhanced icon badge */}
                        <div className={`absolute top-5 ${isArabic ? 'right-5' : 'left-5'} w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                          <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                          {/* Animated pulse ring */}
                          <div className="absolute inset-0 rounded-2xl border-2 border-white/40 scale-90 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                          <div className="absolute inset-0 rounded-2xl bg-white/20 scale-100 group-hover:scale-150 opacity-100 group-hover:opacity-0 transition-all duration-700" />
                        </div>
                      </div>
                      
                      <CardContent className="p-7 relative bg-gradient-to-b from-white to-gray-50/50 group-hover:from-white group-hover:to-white transition-colors duration-500">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 leading-tight">
                              {service.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {service.description}
                            </p>
                            {/* Animated underline */}
                            <div className="flex items-center gap-2 pt-2">
                              <div className="w-0 group-hover:w-16 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full" />
                              <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300" />
                            </div>
                          </div>
                          {/* Premium arrow button */}
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary group-hover:to-secondary shadow-sm group-hover:shadow-md transition-all duration-300">
                            <ArrowRight className={`w-5 h-5 text-primary group-hover:text-white flex-shrink-0 transform group-hover:translate-x-1 transition-all duration-300 ${isArabic ? 'rotate-180' : ''}`} />
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
