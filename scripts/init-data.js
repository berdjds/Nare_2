#!/usr/bin/env node

/**
 * Initialize data files for new installations
 * Run this after cloning the repository
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✓ Created data directory');
}

// Default settings
const defaultSettings = {
  deepseekApiKey: '',
  autoTranslate: false,
  defaultLanguage: 'en',
  enableAITranslation: false
};

// Default banner config
const defaultBanner = {
  isActive: true,
  title: {
    en: 'Limited Time Offer!',
    hy: 'Սահմանափակ Ժամանակ Առաջարկ!',
    ru: 'Ограниченное Предложение!',
    ar: 'عرض لفترة محدودة!'
  },
  message: {
    en: 'Book by December 31st and save 15% on all Armenia tours',
    hy: 'Ամրագրեք մինչև դեկտեմբերի 31-ը և խնայեք 15% բոլոր Հայաստանի տուրերի վրա',
    ru: 'Забронируйте до 31 декабря и сэкономьте 15% на все туры по Армении',
    ar: 'احجز قبل 31 ديسمبر ووفر 15٪ على جميع جولات أرمينيا'
  },
  backgroundColor: 'from-orange-500 to-red-500',
  textColor: 'text-white',
  icon: 'Zap'
};

const files = [
  { name: 'settings.json', data: defaultSettings },
  { name: 'banner.json', data: defaultBanner },
  { name: 'heroSlides.json', data: [] },
  { name: 'tourPackages.json', data: [] },
  { name: 'outgoingPackages.json', data: [] },
  { name: 'airTickets.json', data: [] },
  { name: 'teamMembers.json', data: [] },
  { name: 'pageBanners.json', data: {} },
  { name: 'socialLinks.json', data: [] },
  { name: 'contactInfo.json', data: {} },
  { name: 'translations.json', data: [] }
];

console.log('\n📦 Initializing data files...\n');

let created = 0;
let skipped = 0;

files.forEach(file => {
  const filePath = path.join(dataDir, file.name);
  
  if (fs.existsSync(filePath)) {
    console.log(`⊘ ${file.name} already exists (skipped)`);
    skipped++;
  } else {
    fs.writeFileSync(filePath, JSON.stringify(file.data, null, 2));
    console.log(`✓ Created ${file.name}`);
    created++;
  }
});

console.log(`\n✅ Done! Created ${created} files, skipped ${skipped} existing files.\n`);

if (created > 0) {
  console.log('📝 Next steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Go to: http://localhost:3000/admin');
  console.log('   3. Login with: admin / admin123');
  console.log('   4. Configure your DeepSeek API key in Settings\n');
}
