const fs = require('fs');
const path = require('path');

// Read the current translations.json
const jsonPath = path.join(__dirname, '../data/translations.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Find or create home section
let homeSection = data.find(s => s.name === 'home');
if (!homeSection) {
  homeSection = { name: 'home', entries: [] };
  data.push(homeSection);
}

// New translation keys to add
const newKeys = [
  // Trust Badges
  { key: 'home.trustBadges.rating', en: '4.8/5 Rating', hy: '4.8/5 Գնահատական', ru: '4.8/5 Рейтинг', ar: 'تقييم 4.8/5' },
  { key: 'home.trustBadges.ratingSubtext', en: '500+ Reviews', hy: '500+ Ակնարկներ', ru: '500+ Отзывов', ar: 'أكثر من 500 تقييم' },
  { key: 'home.trustBadges.travelers', en: '10,000+', hy: '10,000+', ru: '10,000+', ar: '+10,000' },
  { key: 'home.trustBadges.travelersSubtext', en: 'Happy Travelers', hy: 'Գոհ Ճանապարհորդներ', ru: 'Довольных Путешественников', ar: 'مسافرون سعداء' },
  { key: 'home.trustBadges.licensed', en: 'Licensed', hy: 'Լիցենզավորված', ru: 'Лицензированы', ar: 'مرخص' },
  { key: 'home.trustBadges.licensedSubtext', en: '& Insured', hy: 'և Ապահովագրված', ru: 'И Застрахованы', ar: 'ومؤمن' },
  { key: 'home.trustBadges.experience', en: '10+ Years', hy: '10+ Տարի', ru: '10+ Лет', ar: '+10 سنوات' },
  { key: 'home.trustBadges.experienceSubtext', en: 'Experience', hy: 'Փորձ', ru: 'Опыта', ar: 'من الخبرة' },
  { key: 'home.trustBadges.support', en: '24/7', hy: '24/7', ru: '24/7', ar: '24/7' },
  { key: 'home.trustBadges.supportSubtext', en: 'Support', hy: 'Աջակցություն', ru: 'Поддержка', ar: 'دعم' },
  { key: 'home.trustBadges.cancellation', en: 'Free', hy: 'Անվճար', ru: 'Бесплатно', ar: 'مجاني' },
  { key: 'home.trustBadges.cancellationSubtext', en: 'Cancellation', hy: 'Չեղարկում', ru: 'Отмена', ar: 'إلغاء' },
  
  // Urgency Banner
  { key: 'home.urgencyBanner.title', en: 'Limited Time Offer!', hy: 'Սահմանափակ Ժամանակ Առաջարկ!', ru: 'Ограниченное Предложение!', ar: 'عرض لفترة محدودة!' },
  { key: 'home.urgencyBanner.message', en: 'Book by December 31st and save 15% on all Armenia tours', hy: 'Ամրագրեք մինչև դեկտեմբերի 31-ը և խնայեք 15% բոլոր Հայաստանի տուրերի վրա', ru: 'Забронируйте до 31 декабря и сэкономьте 15% на все туры по Армении', ar: 'احجز قبل 31 ديسمبر ووفر 15٪ على جميع جولات أرمينيا' },
  
  // WhatsApp
  { key: 'home.whatsapp.tooltip', en: 'Chat with us on WhatsApp', hy: 'Զրուցեք մեզ հետ WhatsApp-ում', ru: 'Напишите нам в WhatsApp', ar: 'تحدث معنا على واتساب' },
  { key: 'home.whatsapp.message', en: "Hi! I'm interested in booking a tour with Nare Travel.", hy: 'Բարև! Հետաքրքրված եմ տուր ամրագրել Նարե Թրավելի հետ։', ru: 'Здравствуйте! Я заинтересован в бронировании тура с Nare Travel.', ar: 'مرحباً! أنا مهتم بحجز جولة مع Nare Travel.' },
  
  // DMC Section
  { key: 'home.dmc.badge', en: 'B2B SERVICES', hy: 'B2B ԾԱՌԱՅՈՒԹՅՈՒՆՆԵՐ', ru: 'B2B УСЛУГИ', ar: 'خدمات B2B' },
  { key: 'home.dmc.title', en: 'Professional DMC Services in Armenia', hy: 'Պրոֆեսիոնալ DMC Ծառայություններ Հայաստանում', ru: 'Профессиональные DMC Услуги в Армении', ar: 'خدمات DMC المهنية في أرمينيا' },
  { key: 'home.dmc.subtitle', en: 'Your reliable partner for destination management, MICE, and ground handling services in Armenia', hy: 'Ձեր վստահելի գործընկերը տուրիստական կառավարման, MICE և գետնային սպասարկման ծառայությունների համար Հայաստանում', ru: 'Ваш надежный партнер по управлению дестинациями, MICE и наземному обслуживанию в Армении', ar: 'شريكك الموثوق في إدارة الوجهات وخدمات MICE والخدمات الأرضية في أرمينيا' },
  
  { key: 'home.dmc.stats.partners', en: 'Partner Agencies', hy: 'Գործընկեր Գործակալություններ', ru: 'Партнерские Агентства', ar: 'الوكالات الشريكة' },
  { key: 'home.dmc.stats.guests', en: 'Guests Handled', hy: 'Սպասարկված Հյուրեր', ru: 'Обслужено Гостей', ar: 'الضيوف الذين تمت خدمتهم' },
  { key: 'home.dmc.stats.satisfaction', en: 'Client Satisfaction', hy: 'Հաճախորդների Գոհունակություն', ru: 'Удовлетворенность Клиентов', ar: 'رضا العملاء' },
  { key: 'home.dmc.stats.support', en: 'On-Ground Support', hy: 'Գետնային Աջակցություն', ru: 'Наземная Поддержка', ar: 'دعم أرضي' },
  
  { key: 'home.dmc.services.mice.title', en: 'MICE Services', hy: 'MICE Ծառայություններ', ru: 'MICE Услуги', ar: 'خدمات MICE' },
  { key: 'home.dmc.services.mice.description', en: 'Meetings, Incentives, Conferences & Events management', hy: 'Հանդիպումներ, խրախուսումներ, կոնֆերանսներ և միջոցառումների կազմակերպում', ru: 'Организация встреч, поощрений, конференций и мероприятий', ar: 'إدارة الاجتماعات والحوافز والمؤتمرات والفعاليات' },
  
  { key: 'home.dmc.services.dmcService.title', en: 'Destination Management', hy: 'Տուրիստական Կառավարում', ru: 'Управление Дестинациями', ar: 'إدارة الوجهات' },
  { key: 'home.dmc.services.dmcService.description', en: 'Complete ground handling and logistics in Armenia', hy: 'Ամբողջական գետնային սպասարկում և լոգիստիկա Հայաստանում', ru: 'Полное наземное обслуживание и логистика в Армении', ar: 'خدمات أرضية ولوجستية كاملة في أرمينيا' },
  
  { key: 'home.dmc.services.groups.title', en: 'Group Tours', hy: 'Խմբային Տուրեր', ru: 'Групповые Туры', ar: 'جولات جماعية' },
  { key: 'home.dmc.services.groups.description', en: 'Customized group packages for travel agencies', hy: 'Անհատականացված խմբային փաթեթներ ճամփորդական գործակալությունների համար', ru: 'Индивидуальные групповые пакеты для туристических агентств', ar: 'باقات جماعية مخصصة لوكالات السفر' },
  
  { key: 'home.dmc.services.corporate.title', en: 'Corporate Travel', hy: 'Կորպորատիվ Ճամփորդություն', ru: 'Корпоративные Поездки', ar: 'السفر الشركات' },
  { key: 'home.dmc.services.corporate.description', en: 'Business travel solutions and VIP services', hy: 'Բիզնես ճամփորդության լուծումներ և VIP ծառայություններ', ru: 'Решения для деловых поездок и VIP услуги', ar: 'حلول السفر التجاري وخدمات VIP' },
  
  { key: 'home.dmc.services.quality.title', en: 'Quality Guaranteed', hy: 'Որակի Երաշխիք', ru: 'Гарантия Качества', ar: 'جودة مضمونة' },
  { key: 'home.dmc.services.quality.description', en: 'Licensed DMC with 10+ years of experience', hy: 'Լիցենզավորված DMC 10+ տարվա փորձով', ru: 'Лицензированная DMC с опытом более 10 лет', ar: 'DMC مرخص مع أكثر من 10 سنوات من الخبرة' },
  
  { key: 'home.dmc.services.support.title', en: '24/7 Support', hy: '24/7 Աջակցություն', ru: '24/7 Поддержка', ar: 'دعم 24/7' },
  { key: 'home.dmc.services.support.description', en: 'Dedicated account manager and emergency assistance', hy: 'Նվիրված հաշվի մենեջեր և արտակարգ օգնություն', ru: 'Персональный менеджер и экстренная помощь', ar: 'مدير حساب مخصص ومساعدة طوارئ' },
  
  { key: 'home.dmc.cta.title', en: 'Partner With Us', hy: 'Դարձեք Մեր Գործընկերը', ru: 'Станьте Нашим Партнером', ar: 'شراكة معنا' },
  { key: 'home.dmc.cta.subtitle', en: 'Join 500+ travel agencies and tour operators who trust Nare Travel for their Armenia operations', hy: 'Միացեք 500+ ճամփորդական գործակալություններին և տուրօպերատորներին, որոնք վստահում են Նարե Թրավելին իրենց Հայաստանի գործառնությունների համար', ru: 'Присоединяйтесь к 500+ туристическим агентствам и туроператорам, которые доверяют Nare Travel для своих операций в Армении', ar: 'انضم إلى أكثر من 500 وكالة سفر ومشغل سياحي يثقون في Nare Travel لعملياتهم في أرمينيا' },
  
  { key: 'home.dmc.cta.viewServices', en: 'View DMC Services', hy: 'Դիտել DMC Ծառայությունները', ru: 'Посмотреть DMC Услуги', ar: 'عرض خدمات DMC' },
  { key: 'home.dmc.cta.requestQuote', en: 'Request Quote', hy: 'Պահանջել Գնահատական', ru: 'Запросить Цену', ar: 'طلب عرض سعر' },
  { key: 'home.dmc.cta.directContact', en: 'Direct B2B Contact', hy: 'Ուղղակի B2B Կապ', ru: 'Прямой B2B Контакт', ar: 'اتصال B2B مباشر' }
];

// Add new entries to home section
newKeys.forEach(newKey => {
  const exists = homeSection.entries.find(e => e.key === newKey.key);
  if (!exists) {
    homeSection.entries.push({
      key: newKey.key,
      en: newKey.en,
      hy: newKey.hy,
      ru: newKey.ru,
      ar: newKey.ar,
      section: 'home'
    });
  }
});

// Sort entries by key
homeSection.entries.sort((a, b) => a.key.localeCompare(b.key));

// Write back to file
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log('✅ Added', newKeys.length, 'new translation keys to data/translations.json');
console.log('✅ Home section now has', homeSection.entries.length, 'entries');
console.log('✅ Translations synced successfully!');
