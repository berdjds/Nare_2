const fs = require('fs');
const path = require('path');

// Read the current translations.json
const jsonPath = path.join(__dirname, '../data/translations.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Find home section
let homeSection = data.find(s => s.name === 'home');
if (!homeSection) {
  console.error('Home section not found!');
  process.exit(1);
}

// Updated feature translations
const updates = {
  'home.features.title': {
    en: 'Why Choose Nare Travel',
    hy: 'Ինչու Ընտրել Նարե Թրավել',
    ru: 'Почему Выбрать Nare Travel',
    ar: 'لماذا تختار Nare Travel'
  },
  'home.features.subtitle': {
    en: 'Your trusted partner for Armenian adventures and international tours',
    hy: 'Ձեր վստահելի գործընկերը հայկական արկածների և միջազգային տուրերի համար',
    ru: 'Ваш надежный партнер для армянских приключений и международных туров',
    ar: 'شريكك الموثوق للمغامرات الأرمنية والجولات الدولية'
  },
  'home.features.explore.title': {
    en: 'Expert Local Guides',
    hy: 'Փորձագետ Տեղական Ուղեկցորդներ',
    ru: 'Эксперт Местные Гиды',
    ar: 'مرشدون محليون خبراء'
  },
  'home.features.explore.description': {
    en: 'Native Armenian guides with deep knowledge of history and culture',
    hy: 'Տեղաբնիկ հայ ուղեկցորդներ պատմության և մշակույթի խորը գիտելիքներով',
    ru: 'Местные армянские гиды с глубокими знаниями истории и культуры',
    ar: 'مرشدون أرمن محليون يتمتعون بمعرفة عميقة بالتاريخ والثقافة'
  },
  'home.features.plan.title': {
    en: 'Custom Itineraries',
    hy: 'Անհատական Երթուղիներ',
    ru: 'Индивидуальные Маршруты',
    ar: 'برامج مخصصة'
  },
  'home.features.plan.description': {
    en: 'Tailored tours for every budget and travel style',
    hy: 'Հարմարեցված տուրեր յուրաքանչյուր բյուջեի և ճամփորդության ոճի համար',
    ru: 'Индивидуальные туры для любого бюджета и стиля путешествий',
    ar: 'جولات مصممة خصيصاً لكل ميزانية وأسلوب سفر'
  },
  'home.features.experience.title': {
    en: 'Hassle-Free Service',
    hy: 'Անխնա Ծառայություն',
    ru: 'Удобный Сервис',
    ar: 'خدمة خالية من المتاعب'
  },
  'home.features.experience.description': {
    en: 'Visa assistance, tickets, and 24/7 support included',
    hy: 'Վիզայի օգնություն, տոմսեր և 24/7 աջակցություն ներառված',
    ru: 'Помощь с визой, билетами и поддержка 24/7',
    ar: 'مساعدة في التأشيرة، التذاكر، ودعم على مدار الساعة'
  }
};

// Update existing entries
let updatedCount = 0;
Object.keys(updates).forEach(key => {
  const entry = homeSection.entries.find(e => e.key === key);
  if (entry) {
    entry.en = updates[key].en;
    entry.hy = updates[key].hy;
    entry.ru = updates[key].ru;
    entry.ar = updates[key].ar;
    updatedCount++;
    console.log(`✅ Updated: ${key}`);
  } else {
    console.log(`⚠️  Not found: ${key}`);
  }
});

// Write back to file
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log('');
console.log(`✅ Updated ${updatedCount} feature translation entries`);
console.log('✅ Translations synced to data/translations.json');
console.log('✅ You can now edit these in the admin panel!');
