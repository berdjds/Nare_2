# 🎯 Development Rules & Standards

**MANDATORY RULES - ALL developers MUST follow these standards**

---

## 📋 Table of Contents

1. [Translation Standards](#-translation-standards)
2. [Page Creation Standards](#-page-creation-standards)
3. [Banner Integration Rules](#-banner-integration-rules)
4. [Admin Panel Integration](#-admin-panel-integration)
5. [Code Quality Standards](#-code-quality-standards)

---

## 🌍 Translation Standards

### **RULE 1: Use Unified Translation Service**

**❌ NEVER DO THIS:**
```typescript
// DON'T write custom translation code
const translateSomething = async () => {
  const response = await fetch('/api/ai/translate', { ... });
  const data = await response.json();
  // Custom logic...
}
```

**✅ ALWAYS DO THIS:**
```typescript
// USE the unified translation hook
import { useTranslation } from '@/hooks/use-translation';

function MyComponent() {
  const { translating, translateParallel } = useTranslation();

  const handleTranslate = async () => {
    const fields = {
      title: formData.title.en,
      content: formData.content.en,
    };

    const results = await translateParallel(fields, ['hy', 'ru', 'ar']);
    // Apply results...
  };
}
```

### **RULE 2: Parallel Translation is Mandatory**

**❌ NEVER translate sequentially:**
```typescript
// DON'T do this - too slow!
for (const lang of ['hy', 'ru', 'ar']) {
  await translateToLanguage(lang);
}
```

**✅ ALWAYS translate in parallel:**
```typescript
// DO this - 3x faster!
await translateParallel(fields, ['hy', 'ru', 'ar']);
```

### **RULE 3: MultiLangText Type is Mandatory**

**All translatable content MUST use this type:**

```typescript
interface MultiLangText {
  en: string;
  hy: string;
  ru: string;
  ar: string;
}

// Example usage
interface MyContent {
  title: MultiLangText;
  description: MultiLangText;
}
```

### **Translation Checklist:**

When adding translation to ANY component:

- [ ] Import `useTranslation` hook from `@/hooks/use-translation`
- [ ] Use `translateParallel()` for multiple languages
- [ ] Define fields with `MultiLangText` type
- [ ] Show `translating` state in UI (loading spinner/disabled button)
- [ ] Handle errors gracefully (hook does this automatically)

---

## 📄 Page Creation Standards

### **RULE 4: Every New Page MUST Have These Elements**

When creating a new page (e.g., `/app/new-page/page.tsx`):

#### **1. Page Banner Integration (MANDATORY)**

**✅ ALWAYS include page banner:**

```typescript
import { PageBanner } from '@/components/page-banner';

export default function NewPage() {
  return (
    <>
      {/* Page banner - managed in Admin > Page Banners */}
      <PageBanner pageId="new-page" />
      
      {/* Page content */}
      <div className="container">
        {/* ... */}
      </div>
    </>
  );
}
```

**Where to set it up:**
- Admin Dashboard → Page Banners → Create new banner
- Set `pageId` to match your page route (e.g., "new-page")
- Contributors can edit banner text without touching code

#### **2. Static Text Translation (MANDATORY)**

**ALL static text must be translatable:**

**❌ DON'T hardcode text:**
```typescript
<h1>Welcome to Our Site</h1>
<p>This is some content</p>
```

**✅ DO use translation keys:**
```typescript
import { useLanguage } from '@/hooks/use-language';

function MyPage() {
  const { t } = useLanguage();
  
  return (
    <>
      <h1>{t('newPage.title')}</h1>
      <p>{t('newPage.description')}</p>
    </>
  );
}
```

#### **3. Add Translations to Dictionary (MANDATORY)**

**Step 1:** Go to `data/translations.json`

**Step 2:** Add new section for your page:

```json
{
  "name": "newPage",
  "entries": [
    {
      "key": "newPage.title",
      "en": "Welcome to Our Site",
      "hy": "Բարի գալուստ մեր կայք",
      "ru": "Добро пожаловать на наш сайт",
      "ar": "مرحبا بكم في موقعنا",
      "section": "newPage"
    },
    {
      "key": "newPage.description",
      "en": "This is some content",
      "hy": "Սա որոշ բովանդակություն է",
      "ru": "Это некоторый контент",
      "ar": "هذا بعض المحتوى",
      "section": "newPage"
    }
  ]
}
```

**Step 3:** Contributors can edit via:
- Admin Dashboard → Translations → Find your section
- AI translate if needed

### **New Page Checklist:**

- [ ] Include `<PageBanner pageId="your-page" />`
- [ ] Use `useLanguage()` hook for all text
- [ ] Add translation keys to `data/translations.json`
- [ ] Test all 4 languages (en, hy, ru, ar)
- [ ] Set up page banner in admin panel
- [ ] Ensure RTL support for Arabic

---

## 🎨 Banner Integration Rules

### **RULE 5: Banner Types and Usage**

#### **1. Hot News Banners** (Below Navbar)

**Use for:** Urgent announcements, promotions, limited-time offers

```typescript
// Already integrated in layout.tsx
// Contributors manage via: Admin > Hot News
// Multiple banners can be active simultaneously
```

**Access:** All users see active banners

#### **2. Page Banners** (Top of specific pages)

**Use for:** Page-specific announcements, hero sections

```typescript
import { PageBanner } from '@/components/page-banner';

<PageBanner pageId="about" />
```

**Access:** Contributors manage via Admin → Page Banners

### **Banner Management Access:**

| Banner Type | Component | Admin Section | Access Level |
|------------|-----------|---------------|--------------|
| Hot News | `<UrgencyBanner />` | Hot News | Contributor ✏️ |
| Page Banners | `<PageBanner />` | Page Banners | Contributor ✏️ |

---

## 🔧 Admin Panel Integration

### **RULE 6: Admin Translation Dictionary**

**When adding new translatable content, you MUST:**

#### **1. Define Section in translations.json**

```json
{
  "name": "yourSection",
  "entries": [
    {
      "key": "yourSection.keyName",
      "en": "English text",
      "hy": "Հայերեն տեքստ",
      "ru": "Русский текст",
      "ar": "نص عربي",
      "section": "yourSection"
    }
  ]
}
```

#### **2. Section Naming Convention**

- Use **camelCase** for section names
- Match page/feature name: `aboutPage`, `contactForm`, `pricingTable`
- Be descriptive: `tourPackageCard`, `heroSection`, `footerLinks`

#### **3. Key Naming Convention**

```
{section}.{element}.{property}

Examples:
- aboutPage.hero.title
- contactForm.submit.button
- pricingTable.header.title
```

### **Admin Integration Checklist:**

- [ ] Add section to `data/translations.json`
- [ ] Use descriptive section name (camelCase)
- [ ] Follow key naming convention
- [ ] Test in Admin → Translations panel
- [ ] Verify AI translate works for section
- [ ] Document new keys in code comments

---

## 💻 Code Quality Standards

### **RULE 7: Authentication Standards**

**ALL admin API routes MUST use this pattern:**

```typescript
export async function POST(request: NextRequest) {
  // Check authentication
  const adminSession = request.cookies.get('admin_session')?.value;
  if (adminSession !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your code...
}
```

**❌ DON'T use:**
- `admin_token` cookie (deprecated)
- `validateAdminSession()` function (deprecated)
- Any other auth method

### **RULE 8: API Route Standards**

**File Structure:**
```
/app/api/
  ├── your-resource/
  │   ├── route.ts          # GET (list), POST (create)
  │   └── [id]/
  │       └── route.ts      # GET, PUT, DELETE (single item)
```

**Naming:**
- Use **kebab-case** for folders: `hot-news`, `page-banners`
- Use **camelCase** for functions: `getHotNews`, `createBanner`

### **RULE 9: Component Standards**

**File Naming:**
```
/components/
  ├── admin/
  │   └── your-manager.tsx     # Admin components
  └── your-component.tsx       # Public components
```

**Component Structure:**
```typescript
"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
// ... other imports

interface YourProps {
  // Props with types
}

export default function YourComponent({ }: YourProps) {
  // State
  const { t } = useLanguage();
  const { translating, translateParallel } = useTranslation();
  
  // Effects
  useEffect(() => {
    // Load data
  }, []);
  
  // Handlers
  const handleSomething = async () => {
    // Logic
  };
  
  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

---

## 🚀 Quick Reference Checklist

### **Adding a New Feature:**

- [ ] Use unified translation service (`useTranslation` hook)
- [ ] Add translation keys to `data/translations.json`
- [ ] Include page banner if creating new page
- [ ] Use `admin_session` cookie for authentication
- [ ] Follow naming conventions (kebab-case, camelCase)
- [ ] Add JSDoc comments for complex functions
- [ ] Test all 4 languages
- [ ] Test RTL (Arabic)
- [ ] Update this document if adding new patterns

### **Adding a New Page:**

- [ ] Create page in `/app/your-page/page.tsx`
- [ ] Add `<PageBanner pageId="your-page" />`
- [ ] Use `useLanguage()` for all text
- [ ] Add section to `data/translations.json`
- [ ] Set up page banner in admin panel
- [ ] Test navigation and layout
- [ ] Add to navbar menu if needed
- [ ] Test mobile responsiveness

### **Adding a New Admin Feature:**

- [ ] Create manager component in `/components/admin/`
- [ ] Add API routes in `/app/api/`
- [ ] Use `admin_session` authentication
- [ ] Add tab to admin dashboard
- [ ] Test contributor access
- [ ] Add success/error toast notifications
- [ ] Test CRUD operations
- [ ] Add loading states

---

## 📚 Reference Documents

- **Translation Guide:** `TRANSLATION_GUIDE.md`
- **Hot News Guide:** `BANNER_MANAGER_GUIDE.md`
- **TypeScript Types:** Check `/lib/*.ts` for interfaces

---

## 🔍 Code Review Checklist

Before submitting code, ensure:

- [ ] ✅ No hardcoded text (all text is translatable)
- [ ] ✅ Using `useTranslation()` hook (not custom translation)
- [ ] ✅ Using `admin_session` cookie (not `admin_token`)
- [ ] ✅ Page banner included (if new page)
- [ ] ✅ Translations added to dictionary
- [ ] ✅ Toast notifications for user feedback
- [ ] ✅ Loading states implemented
- [ ] ✅ Error handling in place
- [ ] ✅ Type-safe (no `any` types without reason)
- [ ] ✅ Tested in all 4 languages
- [ ] ✅ Mobile responsive
- [ ] ✅ Follows naming conventions

---

## ⚠️ Common Mistakes to Avoid

### **❌ DON'T:**

1. Write custom translation code (use the hook!)
2. Hardcode text in components
3. Use `admin_token` cookie
4. Skip page banners on new pages
5. Forget to add translations to dictionary
6. Translate languages sequentially (use parallel!)
7. Use `any` type without good reason
8. Skip loading/error states
9. Forget RTL support for Arabic
10. Skip mobile testing

### **✅ DO:**

1. Use `useTranslation()` hook
2. Use `useLanguage()` for text display
3. Use `admin_session` cookie
4. Include `<PageBanner />` on all pages
5. Add all text to `translations.json`
6. Use `translateParallel()` for speed
7. Define proper TypeScript types
8. Show loading spinners
9. Test `dir="rtl"` for Arabic
10. Test on mobile devices

---

## 🎯 Summary

**Three Golden Rules:**

1. **🌍 Translation:** Use `useTranslation()` hook, always parallel, add to dictionary
2. **📄 New Pages:** Include banner, translate all text, add to dictionary
3. **🔐 Authentication:** Use `admin_session` cookie, never `admin_token`

**Follow these rules = Clean, maintainable, scalable code!** 🚀

---

## 📞 Questions?

If you're unsure about any rule:

1. Check reference documents
2. Look at existing similar code
3. Ask team lead
4. **When in doubt, follow the checklist!**

---

**Last Updated:** November 8, 2025
**Version:** 1.0
**Maintained by:** Development Team
