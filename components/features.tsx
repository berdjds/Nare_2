import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Users, Route, HeadphonesIcon } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

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
  const { t, currentLanguage } = useLanguage()
  const isArabic = currentLanguage === 'ar' || currentLanguage === ('ar' as any)

  return (
    <motion.section 
      className="py-20 bg-gradient-to-b from-white to-gray-50"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      dir={isArabic ? 'rtl' : 'ltr'}
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
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{t('home.features.explore.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('home.features.explore.description')}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                  <Route className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{t('home.features.plan.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('home.features.plan.description')}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <HeadphonesIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{t('home.features.experience.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('home.features.experience.description')}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
