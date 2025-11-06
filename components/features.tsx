import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Globe, Calendar, Star } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

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

export default function Features() {
  const { t } = useLanguage()

  return (
    <motion.section 
      className="py-20 bg-white"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container">
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {t('home.features.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home.features.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div variants={itemVariants}>
            <Card className="feature-card">
              <CardContent className="p-6">
                <div className="feature-icon-wrapper">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mt-4 text-gray-900">{t('home.features.explore.title')}</h3>
                <p className="mt-2 text-gray-600">{t('home.features.explore.description')}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="feature-card">
              <CardContent className="p-6">
                <div className="feature-icon-wrapper">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mt-4 text-gray-900">{t('home.features.plan.title')}</h3>
                <p className="mt-2 text-gray-600">{t('home.features.plan.description')}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="feature-card">
              <CardContent className="p-6">
                <div className="feature-icon-wrapper">
                  <Star className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mt-4 text-gray-900">{t('home.features.experience.title')}</h3>
                <p className="mt-2 text-gray-600">{t('home.features.experience.description')}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
