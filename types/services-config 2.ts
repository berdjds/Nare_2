/**
 * Services Section Configuration Schema
 * This defines the structure for admin-manageable content in the Services section
 */

export interface ServicesContent {
  // Section Header
  tagline: {
    en: string
    hy: string
    ru: string
    ar: string
  }
  title: {
    en: string
    hy: string
    ru: string
    ar: string
  }
  subtitle: {
    en: string
    hy: string
    ru: string
    ar: string
  }
  description: {
    en: string
    hy: string
    ru: string
    ar: string
  }
  
  // Individual Services
  services: {
    daily: {
      title: {
        en: string
        hy: string
        ru: string
        ar: string
      }
      description: {
        en: string
        hy: string
        ru: string
        ar: string
      }
      enabled: boolean
      order: number
      icon: 'MapPin' | 'Globe' | 'Briefcase' | 'Users' | 'Route' | 'HeadphonesIcon'
      color: string
      href: string
      imageKey?: string
    }
    international: {
      title: {
        en: string
        hy: string
        ru: string
        ar: string
      }
      description: {
        en: string
        hy: string
        ru: string
        ar: string
      }
      enabled: boolean
      order: number
      icon: 'MapPin' | 'Globe' | 'Briefcase' | 'Users' | 'Route' | 'HeadphonesIcon'
      color: string
      href: string
      imageKey?: string
    }
    business: {
      title: {
        en: string
        hy: string
        ru: string
        ar: string
      }
      description: {
        en: string
        hy: string
        ru: string
        ar: string
      }
      enabled: boolean
      order: number
      icon: 'MapPin' | 'Globe' | 'Briefcase' | 'Users' | 'Route' | 'HeadphonesIcon'
      color: string
      href: string
      imageKey?: string
    }
  }
}

/**
 * Example API Endpoint Structure for Admin Panel
 * 
 * GET /api/admin/services-content
 * Returns: ServicesContent
 * 
 * PUT /api/admin/services-content
 * Body: Partial<ServicesContent>
 * Returns: { success: boolean, message: string }
 * 
 * PATCH /api/admin/services-content/:serviceKey
 * Body: Partial<ServicesContent['services'][keyof ServicesContent['services']]>
 * Returns: { success: boolean, message: string }
 */

/**
 * Default Content (Fallback when API is unavailable)
 */
export const defaultServicesContent: ServicesContent = {
  tagline: {
    en: 'What We Offer',
    hy: 'Ինչ Ենք Առաջարկում',
    ru: 'Что Мы Предлагаем',
    ar: 'ما نقدمه'
  },
  title: {
    en: 'Our Services',
    hy: 'Մեր Ծառայությունները',
    ru: 'Наши Услуги',
    ar: 'خدماتنا'
  },
  subtitle: {
    en: 'Experience excellence in travel with our dedicated services',
    hy: 'Փորձառու ճամփորդական ծառայություններ',
    ru: 'Профессиональные туристические услуги',
    ar: 'تجربة التميز في السفر مع خدماتنا المتخصصة'
  },
  description: {
    en: 'From exploring Armenia\'s ancient wonders to planning your dream international getaway, we provide comprehensive travel solutions tailored to your needs. With over a decade of expertise, we turn your travel aspirations into unforgettable experiences.',
    hy: 'Հայաստանի հնագույն հրաշալիքների հետազոտությունից մինչև ձեր երազանքի միջազգային ճանապարհորդության պլանավորում՝ մենք տրամադրում ենք ձեր կարիքներին համապատասխան համապարփակ ճամփորդական լուծումներ։ Ունենալով ավելի քան տասնամյակ փորձ՝ մենք ձեր ճամփորդական ձգտումները վերածում ենք անմոռանալի փորձառությունների։',
    ru: 'От исследования древних чудес Армении до планирования отпуска вашей мечты за рубежом — мы предоставляем комплексные туристические решения, адаптированные под ваши потребности. С более чем десятилетним опытом мы превращаем ваши туристические стремления в незабываемые впечатления.',
    ar: 'من استكشاف عجائب أرمينيا القديمة إلى التخطيط لعطلة أحلامك الدولية، نقدم حلول سفر شاملة مصممة خصيصاً لاحتياجاتك. مع أكثر من عقد من الخبرة، نحول تطلعاتك للسفر إلى تجارب لا تُنسى.'
  },
  services: {
    daily: {
      title: {
        en: 'Daily Tours',
        hy: 'Օրական Տուրեր',
        ru: 'Однодневные Туры',
        ar: 'الجولات اليومية'
      },
      description: {
        en: 'Discover Armenia\'s most beautiful destinations with expert local guides',
        hy: 'Բացահայտեք Հայաստանի ամենագեղեցիկ վայրերը փորձառու տեղական գիդերի հետ',
        ru: 'Изучите самые красивые места Армении с опытными местными гидами',
        ar: 'اكتشف أجمل وجهات أرمينيا مع مرشدين محليين خبراء'
      },
      enabled: true,
      order: 1,
      icon: 'MapPin',
      color: 'bg-primary',
      href: '/armenia-tours/daily',
      imageKey: 'tourGarni'
    },
    international: {
      title: {
        en: 'International Travel',
        hy: 'Միջազգային Ճամփորդություն',
        ru: 'Международные Путешествия',
        ar: 'السفر الدولي'
      },
      description: {
        en: 'Explore worldwide destinations with our curated travel packages',
        hy: 'Հետազոտեք աշխարհի տարբեր վայրեր մեր ընտրված ճամփորդական փաթեթներով',
        ru: 'Исследуйте направления по всему миру с нашими тщательно подобранными турпакетами',
        ar: 'استكشف وجهات عالمية مع باقات السفر المنسقة'
      },
      enabled: true,
      order: 2,
      icon: 'Globe',
      color: 'bg-blue-500',
      href: '/services/outgoing-packages',
      imageKey: 'destinationDubai'
    },
    business: {
      title: {
        en: 'Business Travel',
        hy: 'Բիզնես Ճամփորդություն',
        ru: 'Бизнес-Путешествия',
        ar: 'سفر الأعمال'
      },
      description: {
        en: 'Professional MICE and DMC services for corporate clients',
        hy: 'Պրոֆեսիոնալ MICE և DMC ծառայություններ կորպորատիվ հաճախորդների համար',
        ru: 'Профессиональные услуги MICE и DMC для корпоративных клиентов',
        ar: 'خدمات MICE و DMC المهنية للعملاء من الشركات'
      },
      enabled: true,
      order: 3,
      icon: 'Briefcase',
      color: 'bg-secondary',
      href: '/b2b',
      imageKey: 'serviceMice'
    }
  }
}

/**
 * Admin Panel Field Configuration
 * Defines how each field should be displayed and edited in the admin panel
 */
export const servicesFieldsConfig = {
  tagline: {
    type: 'text',
    label: 'Tagline (Small badge text above title)',
    maxLength: 50,
    required: true,
    placeholder: 'e.g., What We Offer',
    helpText: 'Short phrase that appears in the badge above the main title'
  },
  title: {
    type: 'text',
    label: 'Section Title',
    maxLength: 100,
    required: true,
    placeholder: 'e.g., Our Services',
    helpText: 'Main heading for the services section'
  },
  subtitle: {
    type: 'text',
    label: 'Subtitle',
    maxLength: 200,
    required: true,
    placeholder: 'e.g., Experience excellence in travel...',
    helpText: 'Brief subtitle below the main title'
  },
  description: {
    type: 'textarea',
    label: 'Description',
    maxLength: 500,
    required: true,
    rows: 4,
    placeholder: 'Detailed description of services...',
    helpText: 'Comprehensive paragraph explaining your services (optimal: 200-300 characters)'
  },
  serviceTitle: {
    type: 'text',
    label: 'Service Name',
    maxLength: 100,
    required: true,
    placeholder: 'e.g., Daily Tours',
    helpText: 'Name of the service displayed on the card'
  },
  serviceDescription: {
    type: 'textarea',
    label: 'Service Description',
    maxLength: 200,
    required: true,
    rows: 2,
    placeholder: 'Brief description...',
    helpText: 'Short description displayed under service name (optimal: 80-120 characters)'
  },
  serviceIcon: {
    type: 'select',
    label: 'Icon',
    options: [
      { value: 'MapPin', label: 'Map Pin (Location)' },
      { value: 'Globe', label: 'Globe (International)' },
      { value: 'Briefcase', label: 'Briefcase (Business)' },
      { value: 'Users', label: 'Users (Groups)' },
      { value: 'Route', label: 'Route (Tours)' },
      { value: 'HeadphonesIcon', label: 'Headphones (Support)' }
    ],
    required: true,
    helpText: 'Icon displayed in the circular badge on the service card'
  },
  serviceColor: {
    type: 'color',
    label: 'Badge Color',
    required: true,
    helpText: 'Background color for the icon badge (use Tailwind classes like bg-primary, bg-blue-500)'
  },
  serviceHref: {
    type: 'text',
    label: 'Link URL',
    required: true,
    placeholder: '/armenia-tours/daily',
    helpText: 'URL where users are directed when clicking the service card'
  },
  serviceEnabled: {
    type: 'checkbox',
    label: 'Enable Service',
    helpText: 'Toggle to show/hide this service from the website'
  },
  serviceOrder: {
    type: 'number',
    label: 'Display Order',
    min: 1,
    max: 10,
    required: true,
    helpText: 'Order in which the service appears (1 = first, 2 = second, etc.)'
  }
}
