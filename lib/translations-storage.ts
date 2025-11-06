// Translations storage utilities
import { promises as fs } from 'fs';
import path from 'path';
import { translations } from './translations';

const DATA_DIR = path.join(process.cwd(), 'data');
const TRANSLATIONS_FILE = path.join(DATA_DIR, 'translations.json');

export interface TranslationEntry {
  key: string;
  en: string;
  hy: string;
  ru: string;
  section: string;
}

export interface TranslationSection {
  name: string;
  entries: TranslationEntry[];
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Flatten nested translation object into array of entries
function flattenTranslations(obj: any, prefix: string = '', section: string = ''): TranslationEntry[] {
  const entries: TranslationEntry[] = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // If it's a nested object, recurse
      const currentSection = section || key;
      entries.push(...flattenTranslations(value, fullKey, currentSection));
    } else if (typeof value === 'string') {
      // If it's a string value, create an entry
      // Get corresponding HY and RU values
      const hyValue = getNestedValue(translations.hy, fullKey) || '';
      const ruValue = getNestedValue(translations.ru, fullKey) || '';
      
      entries.push({
        key: fullKey,
        en: value,
        hy: hyValue,
        ru: ruValue,
        section: section || fullKey.split('.')[0]
      });
    }
  }
  
  return entries;
}

// Get nested value from object using dot notation
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || '';
}

// Convert flat entries back to nested object structure
function unflattenTranslations(entries: TranslationEntry[], lang: 'en' | 'hy' | 'ru'): any {
  const result: any = {};
  
  entries.forEach(entry => {
    const keys = entry.key.split('.');
    let current = result;
    
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = entry[lang];
      } else {
        current[key] = current[key] || {};
        current = current[key];
      }
    });
  });
  
  return result;
}

// Group entries by section
function groupBySection(entries: TranslationEntry[]): TranslationSection[] {
  const sections: { [key: string]: TranslationEntry[] } = {};
  
  entries.forEach(entry => {
    if (!sections[entry.section]) {
      sections[entry.section] = [];
    }
    sections[entry.section].push(entry);
  });
  
  return Object.keys(sections).map(name => ({
    name,
    entries: sections[name].sort((a, b) => a.key.localeCompare(b.key))
  })).sort((a, b) => a.name.localeCompare(b.name));
}

// Read translations from JSON file or initialize from translations.ts
export async function readTranslations(): Promise<TranslationSection[]> {
  await ensureDataDir();
  
  try {
    const data = await fs.readFile(TRANSLATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, initialize from translations.ts
    const entries = flattenTranslations(translations.en);
    const sections = groupBySection(entries);
    
    // Save initial translations
    await writeTranslations(sections);
    
    return sections;
  }
}

// Write translations to JSON file
export async function writeTranslations(sections: TranslationSection[]): Promise<void> {
  await ensureDataDir();
  
  const data = JSON.stringify(sections, null, 2);
  await fs.writeFile(TRANSLATIONS_FILE, data, 'utf-8');
}

// Export translations to format compatible with translations.ts
export function exportToTranslationsFormat(sections: TranslationSection[]): {
  en: any;
  hy: any;
  ru: any;
} {
  const allEntries = sections.flatMap(s => s.entries);
  
  return {
    en: unflattenTranslations(allEntries, 'en'),
    hy: unflattenTranslations(allEntries, 'hy'),
    ru: unflattenTranslations(allEntries, 'ru'),
  };
}
