import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BANNER_FILE = path.join(DATA_DIR, 'banner.json');

export interface BannerConfig {
  isActive: boolean;
  title: {
    en: string;
    hy: string;
    ru: string;
    ar: string;
  };
  message: {
    en: string;
    hy: string;
    ru: string;
    ar: string;
  };
  backgroundColor: string;
  textColor: string;
  icon: string;
}

// Default banner configuration
const defaultBanner: BannerConfig = {
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

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read banner configuration
export async function readBannerConfig(): Promise<BannerConfig> {
  await ensureDataDir();
  
  try {
    const data = await fs.readFile(BANNER_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with defaults
    await writeBannerConfig(defaultBanner);
    return defaultBanner;
  }
}

// Write banner configuration
export async function writeBannerConfig(config: BannerConfig): Promise<void> {
  await ensureDataDir();
  const data = JSON.stringify(config, null, 2);
  await fs.writeFile(BANNER_FILE, data, 'utf-8');
}
