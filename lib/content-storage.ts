// Content storage interface
// This uses JSON files for simplicity. In production, use a database.

import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export interface HeroSlide {
  id: string;
  title: string;          // English (default)
  titleHy?: string;       // Armenian translation
  titleRu?: string;       // Russian translation
  titleAr?: string;       // Arabic translation
  description: string;     // English (default)
  descriptionHy?: string;  // Armenian translation
  descriptionRu?: string;  // Russian translation
  descriptionAr?: string;  // Arabic translation
  backgroundImage: string;
  cardImage: string;
  order: number;
  isActive?: boolean;     // For activating/deactivating slides
  // Call-to-Action Buttons (customizable per slide)
  button1Text?: string;    // Primary button text (English)
  button1TextHy?: string;  // Armenian translation
  button1TextRu?: string;  // Russian translation
  button1TextAr?: string;  // Arabic translation
  button1Link?: string;    // Primary button link/URL
  button1Enabled?: boolean; // Whether to show button 1
  button2Text?: string;    // Secondary button text (English)
  button2TextHy?: string;  // Armenian translation
  button2TextRu?: string;  // Russian translation
  button2TextAr?: string;  // Arabic translation
  button2Link?: string;    // Secondary button link/URL
  button2Enabled?: boolean; // Whether to show button 2
}

export interface TourPackage {
  id: string;
  title: string;          // English (default)
  titleHy?: string;       // Armenian translation
  titleRu?: string;       // Russian translation
  titleAr?: string;       // Arabic translation
  description: string;     // English (default)
  descriptionHy?: string;  // Armenian translation
  descriptionRu?: string;  // Russian translation
  descriptionAr?: string;  // Arabic translation
  duration: string;
  groupSize: string;
  location: string;
  price: number;
  image: string;
  category: 'daily' | 'cultural' | 'adventure';
  isActive?: boolean;     // For activating/deactivating tours
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;        // English (default)
  positionHy?: string;     // Armenian translation
  positionRu?: string;     // Russian translation
  positionAr?: string;     // Arabic translation
  bio: string;             // English (default)
  bioHy?: string;          // Armenian translation
  bioRu?: string;          // Russian translation
  bioAr?: string;          // Arabic translation
  image: string;
  order: number;
  isActive?: boolean;     // For activating/deactivating members
}

export interface ContactInfo {
  phone: string;
  phone2?: string;          // Secondary phone number
  email: string;
  address: string;
  addressHy?: string;       // Armenian translation
  addressRu?: string;       // Russian translation
  addressAr?: string;       // Arabic translation
  addressUrl?: string;      // Google Maps link (for clickable address)
  mapEmbedUrl?: string;     // Google Maps embed URL (for iframe)
  whatsapp: string;
  telegram: string;
  officeHours?: {
    weekdays?: string;      // e.g., "Monday - Friday: 9:30 AM - 5:30 PM"
    weekdaysHy?: string;    // Armenian translation
    weekdaysRu?: string;    // Russian translation
    weekdaysAr?: string;    // Arabic translation
    saturday?: string;      // e.g., "Saturday: 9:30 AM - 2:30 PM"
    saturdayHy?: string;    // Armenian translation
    saturdayRu?: string;    // Russian translation
    saturdayAr?: string;    // Arabic translation
    sunday?: string;        // e.g., "Sunday: Closed"
    sundayHy?: string;      // Armenian translation
    sundayRu?: string;      // Russian translation
    sundayAr?: string;      // Arabic translation
    support?: string;       // e.g., "Customer support available 24/7"
    supportHy?: string;     // Armenian translation
    supportRu?: string;     // Russian translation
    supportAr?: string;     // Arabic translation
  };
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
}

export interface PageBanner {
  id: string;
  pageId: string;            // e.g., 'about', 'contact', 'services', etc.
  title: string;             // English (default)
  titleHy?: string;          // Armenian translation
  titleRu?: string;          // Russian translation
  titleAr?: string;          // Arabic translation
  subtitle: string;          // English (default)
  subtitleHy?: string;       // Armenian translation
  subtitleRu?: string;       // Russian translation
  subtitleAr?: string;       // Arabic translation
  backgroundImage: string;
  isActive?: boolean;
}

export interface OutgoingPackage {
  id: string;
  title: string;           // English (default)
  titleHy?: string;        // Armenian translation
  titleRu?: string;        // Russian translation
  titleAr?: string;        // Arabic translation
  description: string;     // English (default)
  descriptionHy?: string;  // Armenian translation
  descriptionRu?: string;  // Russian translation
  descriptionAr?: string;  // Arabic translation
  duration: string;
  groupSize: string;
  destination: string;
  price: number;
  image: string;
  isActive?: boolean;      // For activating/deactivating packages
  order?: number;          // For custom ordering
}

export interface AirTicket {
  id: string;
  title: string;           // English (default)
  titleHy?: string;        // Armenian translation
  titleRu?: string;        // Russian translation
  titleAr?: string;        // Arabic translation
  description: string;     // English (default)
  descriptionHy?: string;  // Armenian translation
  descriptionRu?: string;  // Russian translation
  descriptionAr?: string;  // Arabic translation
  route: string;           // e.g., "Yerevan - Dubai"
  airline: string;         // e.g., "Emirates"
  ticketType: string;      // e.g., "One-way", "Round-trip"
  price: number;
  image: string;
  isActive?: boolean;      // For activating/deactivating tickets
  order?: number;          // For custom ordering
}

export interface SiteContent {
  heroSlides: HeroSlide[];
  tourPackages: TourPackage[];
  teamMembers: TeamMember[];
  outgoingPackages: OutgoingPackage[];
  airTickets: AirTicket[];
  pageBanners: PageBanner[];
  contactInfo: ContactInfo;
  socialLinks: SocialLinks;
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Get content file path
function getContentPath(type: keyof SiteContent): string {
  return path.join(DATA_DIR, `${type}.json`);
}

// Read content
export async function readContent<T>(type: keyof SiteContent): Promise<T[]> {
  try {
    await ensureDataDir();
    const filePath = getContentPath(type);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return empty array if file doesn't exist
    return [];
  }
}

// Write content
export async function writeContent<T>(type: keyof SiteContent, content: T[]): Promise<void> {
  await ensureDataDir();
  const filePath = getContentPath(type);
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
}

// Read single content object (for contactInfo and socialLinks)
export async function readSingleContent<T>(type: keyof SiteContent): Promise<T | null> {
  try {
    await ensureDataDir();
    const filePath = getContentPath(type);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// Write single content object
export async function writeSingleContent<T>(type: keyof SiteContent, content: T): Promise<void> {
  await ensureDataDir();
  const filePath = getContentPath(type);
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
}

// Initialize with default data if not exists
export async function initializeDefaultContent(): Promise<void> {
  await ensureDataDir();
  
  // Check if data already exists
  const contactPath = getContentPath('contactInfo');
  try {
    await fs.access(contactPath);
    return; // Data already exists
  } catch {
    // Initialize with defaults
  }

  const defaultContactInfo: ContactInfo = {
    phone: '+374 XX XXX XXX',
    email: 'info@filarche.com',
    address: 'Yerevan, Armenia',
    whatsapp: '+374 XX XXX XXX',
    telegram: '@filarche',
  };

  const defaultSocialLinks: SocialLinks = {
    facebook: 'https://facebook.com/filarche',
    instagram: 'https://instagram.com/filarche',
    twitter: 'https://twitter.com/filarche',
    linkedin: 'https://linkedin.com/company/filarche',
    youtube: 'https://youtube.com/@filarche',
  };

  await writeSingleContent('contactInfo', defaultContactInfo);
  await writeSingleContent('socialLinks', defaultSocialLinks);
  await writeContent('heroSlides', []);
  await writeContent('tourPackages', []);
  await writeContent('teamMembers', []);
}
