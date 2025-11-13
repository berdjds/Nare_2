#!/usr/bin/env node

/**
 * One-time script to translate all UI translations to Arabic
 * Run with: node scripts/translate-arabic.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TRANSLATIONS_FILE = path.join(__dirname, '../data/translations.json');
const SETTINGS_FILE = path.join(__dirname, '../data/settings.json');
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Read API key from settings
function getApiKey() {
  try {
    const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    return settings.deepseekApiKey;
  } catch (error) {
    console.error('❌ Error reading API key from settings.json');
    console.error('Please make sure you have configured your DeepSeek API key in Admin Settings');
    process.exit(1);
  }
}

// Translate text using DeepSeek API
async function translateToArabic(text, apiKey, context = '') {
  const systemPrompt = `You are a professional translator specializing in travel and tourism content. 
Translate the provided English text to Arabic (العربية).
${context ? `Context: ${context}` : ''}

Rules:
1. Maintain the tone and style appropriate for travel marketing
2. Keep proper nouns and brand names as they are
3. Preserve formatting (line breaks, etc.)
4. Use culturally appropriate expressions
5. Return ONLY the translated text, no explanations`;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0]?.message?.content?.trim();

    if (!translatedText) {
      throw new Error('No translation received from API');
    }

    return translatedText;
  } catch (error) {
    console.error(`Translation error: ${error.message}`);
    return null;
  }
}

// Delay function to avoid rate limiting
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function
async function main() {
  console.log('🚀 Starting Arabic translation script...\n');

  // Get API key
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('❌ No API key found in settings.json');
    process.exit(1);
  }
  console.log('✅ API key loaded\n');

  // Read translations file
  let translations;
  try {
    translations = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8'));
    console.log(`✅ Loaded translations file (${translations.length} sections)\n`);
  } catch (error) {
    console.error('❌ Error reading translations file:', error.message);
    process.exit(1);
  }

  // Find entries missing Arabic translation or with placeholder
  const missingArabic = [];
  translations.forEach(section => {
    section.entries.forEach(entry => {
      // Check if Arabic is missing or is a placeholder like "[AR] English text"
      if (entry.en && (!entry.ar || entry.ar.startsWith('[AR]'))) {
        missingArabic.push({ section: section.name, entry });
      }
    });
  });

  console.log(`📊 Found ${missingArabic.length} entries missing Arabic translation\n`);

  if (missingArabic.length === 0) {
    console.log('✅ All entries already have Arabic translations!');
    return;
  }

  const confirmed = await new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question(
      `⚠️  This will translate ${missingArabic.length} entries to Arabic.\n` +
      `This may take several minutes and use API credits.\n\n` +
      `Continue? (yes/no): `,
      (answer) => {
        readline.close();
        resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
      }
    );
  });

  if (!confirmed) {
    console.log('\n❌ Translation cancelled by user');
    process.exit(0);
  }

  console.log('\n🔄 Starting translations...\n');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < missingArabic.length; i++) {
    const { section, entry } = missingArabic[i];
    const progress = `[${i + 1}/${missingArabic.length}]`;

    process.stdout.write(`${progress} Translating: ${entry.key}... `);

    const translatedText = await translateToArabic(
      entry.en,
      apiKey,
      `UI translation for ${section} section, key: ${entry.key}`
    );

    if (translatedText) {
      entry.ar = translatedText;
      successCount++;
      console.log('✅');
    } else {
      failCount++;
      console.log('❌ Failed');
    }

    // Small delay to avoid rate limiting (100ms)
    await delay(100);

    // Save progress every 10 translations
    if ((i + 1) % 10 === 0) {
      try {
        fs.writeFileSync(TRANSLATIONS_FILE, JSON.stringify(translations, null, 2));
        console.log(`💾 Progress saved (${i + 1}/${missingArabic.length})\n`);
      } catch (error) {
        console.error('❌ Error saving progress:', error.message);
      }
    }
  }

  // Final save
  try {
    fs.writeFileSync(TRANSLATIONS_FILE, JSON.stringify(translations, null, 2));
    console.log('\n💾 Final translations saved!\n');
  } catch (error) {
    console.error('\n❌ Error saving final translations:', error.message);
    process.exit(1);
  }

  // Summary
  console.log('═══════════════════════════════════════');
  console.log('📊 Translation Summary:');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📝 Total: ${missingArabic.length}`);
  console.log('═══════════════════════════════════════\n');

  if (successCount > 0) {
    console.log('🎉 Arabic translations have been added to data/translations.json');
    console.log('🔄 Restart your dev server to see the changes\n');
  }

  if (failCount > 0) {
    console.log('⚠️  Some translations failed. You may want to:');
    console.log('   1. Check your API key and credits');
    console.log('   2. Run the script again to retry failed translations\n');
  }
}

// Run the script
main().catch(error => {
  console.error('\n❌ Script error:', error.message);
  process.exit(1);
});
