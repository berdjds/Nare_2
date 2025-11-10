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
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {t('home.services.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home.services.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full bg-white relative">
                    {/* Gradient Border Effect on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 rounded-lg pointer-events-none" />
                    
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <ImageWithFallback
                        src={service.image}
                        fallbackKey="heroVernissage"
                        alt={service.title}
                        className="transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 object-cover brightness-95 group-hover:brightness-100"
                        width={400}
                        height={300}
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                      
                      {/* Icon Badge with Pulse Effect */}
                      <div className={`absolute top-4 ${isArabic ? 'right-4' : 'left-4'} w-14 h-14 ${service.color} rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                        <Icon className="w-7 h-7 text-white" />
                        {/* Pulse ring on hover */}
                        <div className="absolute inset-0 rounded-full border-2 border-white/30 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                      </div>
                    </div>
                    
                    <CardContent className="p-6 relative">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {service.description}
                          </p>
                          {/* Decorative underline */}
                          <div className="mt-4 w-0 group-hover:w-12 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-500" />
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary transition-colors duration-300">
                          <ArrowRight className={`w-5 h-5 text-primary group-hover:text-white flex-shrink-0 transform group-hover:translate-x-1 transition-all duration-300 ${isArabic ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </CardContent>
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
