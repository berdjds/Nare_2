import { NextResponse } from 'next/server';
import { readTranslations } from '@/lib/translations-storage';
import { translations as fallbackTranslations } from '@/lib/translations';

// GET /api/translations - Public endpoint for frontend
export async function GET() {
  try {
    // Try to read from JSON file first (admin-managed)
    const sections = await readTranslations();
    
    // Convert sections back to nested object format
    const result: any = {
      en: {},
      hy: {},
      ru: {},
      ar: {}
    };
    
    sections.forEach(section => {
      section.entries.forEach(entry => {
        const keys = entry.key.split('.');
        
        // Set for each language
        ['en', 'hy', 'ru', 'ar'].forEach(lang => {
          let current = result[lang];
          
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
              current[keys[i]] = {};
            }
            current = current[keys[i]];
          }
          
          current[keys[keys.length - 1]] = (entry as any)[lang] || '';
        });
      });
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error loading translations from JSON, using fallback:', error);
    // Fallback to hardcoded translations if JSON read fails
    return NextResponse.json(fallbackTranslations);
  }
}

// Cache headers
export const revalidate = 0; // Don't cache, always fetch fresh
