import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const HOT_NEWS_FILE = path.join(DATA_DIR, 'hot-news.json');

export interface HotNewsBanner {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read all hot news banners
export async function readHotNewsBanners(): Promise<HotNewsBanner[]> {
  await ensureDataDir();
  
  try {
    const data = await fs.readFile(HOT_NEWS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Write all hot news banners
export async function writeHotNewsBanners(banners: HotNewsBanner[]): Promise<void> {
  await ensureDataDir();
  const data = JSON.stringify(banners, null, 2);
  await fs.writeFile(HOT_NEWS_FILE, data, 'utf-8');
}

// Get active banners only
export async function getActiveHotNewsBanners(): Promise<HotNewsBanner[]> {
  const banners = await readHotNewsBanners();
  return banners.filter(banner => banner.isActive);
}

// Create a new banner
export async function createHotNewsBanner(bannerData: Omit<HotNewsBanner, 'id' | 'createdAt' | 'updatedAt'>): Promise<HotNewsBanner> {
  const banners = await readHotNewsBanners();
  
  const newBanner: HotNewsBanner = {
    ...bannerData,
    id: `hot-news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  banners.push(newBanner);
  await writeHotNewsBanners(banners);
  
  return newBanner;
}

// Update a banner
export async function updateHotNewsBanner(id: string, bannerData: Partial<HotNewsBanner>): Promise<HotNewsBanner | null> {
  const banners = await readHotNewsBanners();
  const index = banners.findIndex(b => b.id === id);
  
  if (index === -1) return null;
  
  banners[index] = {
    ...banners[index],
    ...bannerData,
    id: banners[index].id, // Preserve ID
    createdAt: banners[index].createdAt, // Preserve created date
    updatedAt: new Date().toISOString(),
  };
  
  await writeHotNewsBanners(banners);
  return banners[index];
}

// Delete a banner
export async function deleteHotNewsBanner(id: string): Promise<boolean> {
  const banners = await readHotNewsBanners();
  const filtered = banners.filter(b => b.id !== id);
  
  if (filtered.length === banners.length) return false;
  
  await writeHotNewsBanners(filtered);
  return true;
}

// Generate unique ID
function generateId(): string {
  return `hot-news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
