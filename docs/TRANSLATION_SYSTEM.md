# Translation System - Admin Panel Integration

## 🌍 Overview

The website supports multiple languages through the translation system. The admin panel content now **works seamlessly** with translations.

---

## 🔄 How It Works

### **Dynamic Content from Admin Panel**

When you add content through the admin panel:
1. You enter **actual text** (title, description, etc.)
2. This text is **stored as-is** in the database
3. The frontend **displays your text directly**
4. No translation keys needed!

### **Static Content with Translations**

For static parts of the website (navigation, buttons, etc.):
1. Translation keys are defined in translation files
2. System looks up the key based on current language
3. Displays translated text

---

## 📝 Admin Panel Content (No Translation Keys)

### What You Enter in Admin:

**Hero Slide Example:**
```
Title: "Beautiful Yerevan"
Description: "Explore the pink city with its rich history"
```

**What Displays:**
- English users see: "Beautiful Yerevan"
- Armenian users see: "Beautiful Yerevan"
- All users see exactly what you entered

### Multi-Language Strategy for Admin Content:

**Option 1: Single Language (Current)**
- Enter content in your primary language (e.g., English)
- All users see the same content
- Simple and straightforward

**Option 2: Future Enhancement - Multi-Language Fields**
Could add:
```
Title (English): "Beautiful Yerevan"
Title (Armenian): "Գեղեցիկ Երևան"
Title (Russian): "Красивый Ереван"
```

---

## 🎯 Current Implementation

### Hero Slider Logic

```typescript
// Displays admin-entered title, OR falls back to translation
{destinations[currentIndex].title || 
  (destinations[currentIndex].key ? 
    t(`home.destinations.${destinations[currentIndex].key}.title`) : 
    'Destination')}
```

**Priority:**
1. **First**: Use `title` from admin panel (if exists)
2. **Second**: Use translation key (if `key` field exists)
3. **Third**: Use fallback "Destination"

### Example Scenarios

**Scenario 1: Admin Panel Content**
```json
{
  "id": "1",
  "title": "Dubai Adventures",
  "description": "Luxury and excitement await",
  "backgroundImage": "/images/uploads/dubai-123.webp",
  "cardImage": "/images/uploads/dubai-card-456.webp"
}
```
✅ **Displays**: "Dubai Adventures" (direct text)

**Scenario 2: Legacy Translation Content**
```json
{
  "id": "2",
  "key": "sharm",
  "backgroundImage": "/images/hero/beach.webp",
  "cardImage": "/images/destinations/beach.webp"
}
```
✅ **Displays**: Translation from `home.destinations.sharm.title`

**Scenario 3: Missing Both**
```json
{
  "id": "3",
  "backgroundImage": "/images/hero/mountain.webp",
  "cardImage": "/images/destinations/mountain.webp"
}
```
✅ **Displays**: "Destination" (fallback)

---

## 🔧 Translation Files

### Location
```
locales/
├── en/
│   └── common.json
├── hy/
│   └── common.json
└── ru/
    └── common.json
```

### Static Content Example

**en/common.json:**
```json
{
  "menu": {
    "services": "Services",
    "tours": "Armenia Tours",
    "about": "About",
    "contact": "Contact"
  },
  "home": {
    "hero": {
      "explore": "Explore"
    }
  }
}
```

**hy/common.json:**
```json
{
  "menu": {
    "services": "Ծառայություններ",
    "tours": "Հայաստանի Տուրեր",
    "about": "Մեր Մասին",
    "contact": "Կապ"
  },
  "home": {
    "hero": {
      "explore": "Ուսումնասիրել"
    }
  }
}
```

---

## 🌐 Adding Multi-Language Support to Admin Content

If you want admin content in multiple languages, here's how to add it:

### Step 1: Update Data Structure

**lib/content-storage.ts:**
```typescript
export interface HeroSlide {
  id: string;
  title: string;           // English title
  titleHy?: string;        // Armenian title
  titleRu?: string;        // Russian title
  description: string;     // English description
  descriptionHy?: string;  // Armenian description
  descriptionRu?: string;  // Russian description
  backgroundImage: string;
  cardImage: string;
  order: number;
}
```

### Step 2: Update Admin UI

**components/admin/hero-slides-manager.tsx:**
```tsx
<Tabs>
  <TabsList>
    <TabsTrigger value="en">English</TabsTrigger>
    <TabsTrigger value="hy">Armenian</TabsTrigger>
    <TabsTrigger value="ru">Russian</TabsTrigger>
  </TabsList>
  
  <TabsContent value="en">
    <Input 
      value={slide.title}
      onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
      placeholder="Title in English"
    />
  </TabsContent>
  
  <TabsContent value="hy">
    <Input 
      value={slide.titleHy}
      onChange={(e) => updateSlide(slide.id, 'titleHy', e.target.value)}
      placeholder="Title in Armenian"
    />
  </TabsContent>
  
  <TabsContent value="ru">
    <Input 
      value={slide.titleRu}
      onChange={(e) => updateSlide(slide.id, 'titleRu', e.target.value)}
      placeholder="Title in Russian"
    />
  </TabsContent>
</Tabs>
```

### Step 3: Update Frontend Display

**components/hero-slider/index.tsx:**
```tsx
const getLocalizedField = (item: HeroSlide, field: string) => {
  const lang = currentLanguage; // from useLanguage hook
  
  if (lang === 'hy' && item[`${field}Hy`]) return item[`${field}Hy`];
  if (lang === 'ru' && item[`${field}Ru`]) return item[`${field}Ru`];
  return item[field]; // default to English
};

// Display:
{getLocalizedField(destinations[currentIndex], 'title')}
```

---

## 📊 Current Status

### What's Translated:
✅ **Navigation menu** (Services, Tours, About, Contact)  
✅ **Footer content** (static text)  
✅ **Button labels** ("Explore", "Learn More", etc.)  
✅ **Form labels** (Contact form fields)  

### What Uses Direct Admin Input:
✅ **Hero slide titles & descriptions**  
✅ **Tour package details**  
✅ **Team member bios**  
✅ **Contact information**  
✅ **Social media links**  

---

## 💡 Recommendations

### For Now (Simplest):
Keep admin content in **one language** (English):
- Simple to manage
- No duplicate entry needed
- Works perfectly for international audience

### For Multi-Language Sites:
Add translation fields to admin panel:
- More work to enter content
- Better localization
- Each language has custom content

### Hybrid Approach:
- **Navigation/UI**: Use translation system
- **Dynamic content**: Single language (English)
- Best of both worlds

---

## 🔍 How to Check Current Language

```typescript
import { useLanguage } from '@/hooks/use-language';

const MyComponent = () => {
  const { language, t } = useLanguage();
  
  // Check current language
  console.log(language); // 'en', 'hy', or 'ru'
  
  // Translate a key
  const text = t('menu.services');
  
  return <div>{text}</div>;
};
```

---

## 🎨 Language Switcher

Users can change language using the language selector in the header:
- 🇬🇧 English
- 🇦🇲 Armenian (Հայերեն)
- 🇷🇺 Russian (Русский)

Changes apply immediately across:
- Navigation
- Buttons
- Forms
- Static content

**Note**: Admin panel content displays as entered (no automatic translation)

---

## ✅ Summary

### Current Behavior:

| Content Type | Translation Method | Example |
|--------------|-------------------|---------|
| Menu items | Translation files | "Services" → "Ծառայություններ" |
| Hero titles (admin) | Direct display | "Dubai" → "Dubai" |
| Buttons | Translation files | "Explore" → "Ուսումնասիրել" |
| Tour packages (admin) | Direct display | Shows entered text |
| Footer text | Translation files | Translated per language |

### Key Points:
1. ✅ Admin content displays **exactly as entered**
2. ✅ UI elements use **translation system**
3. ✅ **Flexible**: Can add multi-language later
4. ✅ **Simple**: No translation keys for admin content
5. ✅ **Works now**: No translation errors

---

**Status**: ✅ **Working Correctly**  
**Translation Errors**: ✅ **Fixed**  
**Admin Content**: ✅ **Displays Direct Text**

The "undefined.title" errors are now resolved. Admin content displays exactly what you enter, while UI elements remain translated!
