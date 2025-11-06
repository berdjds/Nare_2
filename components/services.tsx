import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useLanguage } from '@/components/language-provider'
import { useImages } from '@/lib/hooks/use-images'
import { ImageWithFallback } from '@/components/image-with-fallback'
import Link from 'next/link'

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
  const { t } = useLanguage()
  const { images } = useImages()

  return (
    <motion.section 
      className="py-20 bg-gray-50"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
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
          <motion.div variants={itemVariants}>
            <Link href="/armenia-tours/daily">
              <Card className="service-card group cursor-pointer hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <ImageWithFallback
                    src={images.tourGarni}
                    fallbackKey="heroVernissage"
                    alt={t('home.services.daily.title')}
                    className="transform group-hover:scale-110 transition-transform duration-500"
                    width={400}
                    height={300}
                    priority={true}
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-semibold">{t('home.services.daily.title')}</h3>
                    <p className="mt-2 text-sm text-white/80">{t('home.services.daily.description')}</p>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/services/outgoing-packages">
              <Card className="service-card group cursor-pointer hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <ImageWithFallback
                    src={images.destinationDubai}
                    fallbackKey="heroVernissage"
                    alt={t('home.services.international.title')}
                    className="transform group-hover:scale-110 transition-transform duration-500"
                    width={400}
                    height={300}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-semibold">{t('home.services.international.title')}</h3>
                    <p className="mt-2 text-sm text-white/80">{t('home.services.international.description')}</p>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/b2b">
              <Card className="service-card group cursor-pointer hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <ImageWithFallback
                    src={images.serviceMice}
                    fallbackKey="heroVernissage"
                    alt={t('home.services.business.title')}
                    className="transform group-hover:scale-110 transition-transform duration-500"
                    width={400}
                    height={300}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-semibold">{t('home.services.business.title')}</h3>
                    <p className="mt-2 text-sm text-white/80">{t('home.services.business.description')}</p>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
