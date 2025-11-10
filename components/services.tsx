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
              <motion.div key={index} variants={itemVariants}>
                <Link href={service.href}>
                  <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <ImageWithFallback
                        src={service.image}
                        fallbackKey="heroVernissage"
                        alt={service.title}
                        className="transform group-hover:scale-110 transition-transform duration-700 object-cover"
                        width={400}
                        height={300}
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      {/* Icon Badge */}
                      <div className={`absolute top-4 ${isArabic ? 'right-4' : 'left-4'} w-12 h-12 ${service.color} rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                        <ArrowRight className={`w-5 h-5 text-primary flex-shrink-0 mt-1 transform group-hover:translate-x-1 transition-transform duration-300 ${isArabic ? 'rotate-180' : ''}`} />
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
