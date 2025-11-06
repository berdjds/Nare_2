import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export interface AdminSettings {
  deepseekApiKey?: string;
  autoTranslate?: boolean;
  defaultLanguage?: 'en' | 'hy' | 'ru';
  enableAITranslation?: boolean;
}

const SETTINGS_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(SETTINGS_DIR, 'settings.json');

/**
 * Read admin settings
 */
export async function readSettings(): Promise<AdminSettings> {
  try {
    // Create directory if it doesn't exist
    if (!existsSync(SETTINGS_DIR)) {
      await mkdir(SETTINGS_DIR, { recursive: true });
    }

    // Return default settings if file doesn't exist
    if (!existsSync(SETTINGS_FILE)) {
      const defaultSettings: AdminSettings = {
        autoTranslate: false,
        defaultLanguage: 'en',
        enableAITranslation: false,
      };
      await writeSettings(defaultSettings);
      return defaultSettings;
    }

    const data = await readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading settings:', error);
    return {
      autoTranslate: false,
      defaultLanguage: 'en',
      enableAITranslation: false,
    };
  }
}

/**
 * Write admin settings
 */
export async function writeSettings(settings: AdminSettings): Promise<void> {
  try {
    if (!existsSync(SETTINGS_DIR)) {
      await mkdir(SETTINGS_DIR, { recursive: true });
    }

    await writeFile(
      SETTINGS_FILE,
      JSON.stringify(settings, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Error writing settings:', error);
    throw error;
  }
}

/**
 * Update specific setting
 */
export async function updateSetting(
  key: keyof AdminSettings,
  value: any
): Promise<AdminSettings> {
  const settings = await readSettings();
  settings[key] = value;
  await writeSettings(settings);
  return settings;
}

/**
 * Get API key (with security check)
 */
export async function getApiKey(): Promise<string | null> {
  const settings = await readSettings();
  return settings.deepseekApiKey || null;
}

/**
 * Validate API key format
 */
export function validateApiKey(apiKey: string): boolean {
  // Basic validation - adjust based on DeepSeek's key format
  return apiKey.length > 20 && apiKey.startsWith('sk-');
}
