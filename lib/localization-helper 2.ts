/**
 * Helper functions for localized content from admin panel
 */

import { HeroSlide, TourPackage, TeamMember, OutgoingPackage } from './content-storage';

export type Language = 'en' | 'hy' | 'ru' | 'ar';

/**
 * Check if language is RTL (Right-to-Left)
 */
export function isRTL(language: Language): boolean {
  return language === 'ar';
}

/**
 * Get localized field from an object
 */
export function getLocalizedField<T extends Record<string, any>>(
  item: T,
  baseField: string,
  language: Language
): string {
  // Return English by default
  if (language === 'en') {
    return item[baseField] || '';
  }

  // Try to get language-specific field
  // For Arabic, use 'Ar' suffix
  const langSuffix = language === 'hy' ? 'Hy' : language === 'ru' ? 'Ru' : 'Ar';
  const langField = `${baseField}${langSuffix}`;
  
  // Return language-specific if exists, otherwise fallback to English
  return item[langField] || item[baseField] || '';
}

/**
 * Get localized hero slide
 */
export function getLocalizedHeroSlide(slide: HeroSlide, language: Language) {
  return {
    ...slide,
    title: getLocalizedField(slide, 'title', language),
    description: getLocalizedField(slide, 'description', language),
  };
}

/**
 * Get localized tour package
 */
export function getLocalizedTourPackage(tour: TourPackage, language: Language) {
  return {
    ...tour,
    title: getLocalizedField(tour, 'title', language),
    description: getLocalizedField(tour, 'description', language),
  };
}

/**
 * Get localized team member
 */
export function getLocalizedTeamMember(member: TeamMember, language: Language) {
  return {
    ...member,
    position: getLocalizedField(member, 'position', language),
    bio: getLocalizedField(member, 'bio', language),
  };
}

/**
 * Get localized outgoing package
 */
export function getLocalizedOutgoingPackage(pkg: OutgoingPackage, language: Language) {
  return {
    ...pkg,
    title: getLocalizedField(pkg, 'title', language),
    description: getLocalizedField(pkg, 'description', language),
  };
}

/**
 * Get localized air ticket
 */
export function getLocalizedAirTicket(ticket: any, language: Language) {
  return {
    ...ticket,
    title: getLocalizedField(ticket, 'title', language),
    description: getLocalizedField(ticket, 'description', language),
  };
}

/**
 * Get localized contact info address
 */
export function getLocalizedAddress(contactInfo: any, language: Language): string {
  return getLocalizedField(contactInfo, 'address', language);
}

/**
 * Get localized office hours field
 */
export function getLocalizedOfficeHours(officeHours: any, field: string, language: Language): string {
  if (!officeHours) return '';
  
  if (language === 'en') {
    return officeHours[field] || '';
  }
  
  const langSuffix = language === 'hy' ? 'Hy' : 'Ru';
  const localizedField = `${field}${langSuffix}`;
  
  return officeHours[localizedField] || officeHours[field] || '';
}

/**
 * Get localized office title
 */
export function getLocalizedOfficeTitle(contactInfo: any, language: Language): string {
  return getLocalizedField(contactInfo, 'officeTitle', language);
}

/**
 * Get localized office description
 */
export function getLocalizedOfficeDescription(contactInfo: any, language: Language): string {
  return getLocalizedField(contactInfo, 'officeDescription', language);
}

/**
 * Get localized page banner
 */
export function getLocalizedPageBanner(banner: any, language: Language) {
  return {
    ...banner,
    title: getLocalizedField(banner, 'title', language),
    subtitle: getLocalizedField(banner, 'subtitle', language),
  };
}

/**
 * Check if translation exists for a language
 */
export function hasTranslation<T extends Record<string, any>>(
  item: T,
  baseField: string,
  language: 'hy' | 'ru'
): boolean {
  const langField = `${baseField}${language.charAt(0).toUpperCase() + language.slice(1)}`;
  return !!item[langField];
}

/**
 * Get translation completion percentage
 */
export function getTranslationProgress<T extends Record<string, any>>(
  item: T,
  fields: string[],
  language: 'hy' | 'ru'
): number {
  const totalFields = fields.length;
  const translatedFields = fields.filter(field => hasTranslation(item, field, language)).length;
  
  return Math.round((translatedFields / totalFields) * 100);
}
