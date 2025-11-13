# 🎯 Development Rules & Standards

**MANDATORY RULES - ALL developers MUST follow these standards**

> **⚠️ These rules are NOT suggestions - they are requirements for code to be merged**

---

## 📋 Table of Contents

### Core Standards
1. [Translation Standards](#-translation-standards)
2. [Page Creation Standards](#-page-creation-standards)
3. [Banner Integration Rules](#-banner-integration-rules)
4. [Admin Panel Integration](#-admin-panel-integration)

### Code Quality
5. [Code Quality Standards](#-code-quality-standards)
6. [TypeScript Best Practices](#-typescript-best-practices)
7. [React & Next.js Best Practices](#-react--nextjs-best-practices)
8. [Performance Optimization](#-performance-optimization)

### Security & Testing
9. [Security Best Practices](#-security-best-practices)
10. [Error Handling Standards](#-error-handling-standards)
11. [Testing Requirements](#-testing-requirements)

### Development Workflow
12. [Git Workflow Standards](#-git-workflow-standards)
13. [Documentation Requirements](#-documentation-requirements)
14. [Accessibility Standards](#-accessibility-standards)

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

## 📘 TypeScript Best Practices

### **RULE 10: Type Safety is Mandatory**

**❌ NEVER use `any` type without justification:**

```typescript
// DON'T - defeats the purpose of TypeScript
const data: any = await fetchData();
const result: any = processData(data);
```

**✅ ALWAYS use proper types:**

```typescript
// DO - type-safe
interface Article {
  id: string;
  title: MultiLangText;
  content: MultiLangText;
}

const data: Article = await fetchData();
const result: ProcessedArticle = processData(data);
```

### **RULE 11: Define Interfaces for All Data Structures**

```typescript
// ✅ Always define interfaces
interface FormData {
  title: MultiLangText;
  content: MultiLangText;
  category: ArticleCategory;
  tags: string[];
  author: string;
  status: 'draft' | 'published';
}

// ✅ Use union types for limited values
type ArticleCategory = 'news' | 'events' | 'culture' | 'food-drinks' | 'destinations';

// ✅ Use enums for status/state
enum LoadingState {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}
```

### **RULE 12: Use Type Guards**

```typescript
// ✅ Create type guards for runtime checking
function isArticle(obj: unknown): obj is Article {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj
  );
}

// Usage
if (isArticle(data)) {
  // TypeScript knows data is Article here
  console.log(data.title.en);
}
```

### **TypeScript Checklist:**

- [ ] No `any` types (use `unknown` if truly needed)
- [ ] All function parameters typed
- [ ] All function return types typed
- [ ] Interfaces defined for all data structures
- [ ] Use union types for limited value sets
- [ ] Use type guards for runtime checks
- [ ] Enable strict mode in tsconfig.json

---

## ⚛️ React & Next.js Best Practices

### **RULE 13: Component Structure**

**✅ Always follow this structure:**

```typescript
"use client"; // If client component

// 1. Imports (grouped logically)
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface MyComponentProps {
  initialData?: string;
  onSave?: (data: string) => void;
}

// 3. Component
export default function MyComponent({ initialData, onSave }: MyComponentProps) {
  // 3a. Hooks (in order: state, context, custom hooks)
  const [data, setData] = useState(initialData || '');
  const { translating, translateParallel } = useTranslation();
  
  // 3b. Effects
  useEffect(() => {
    // Load data
  }, []);
  
  // 3c. Event handlers
  const handleSave = async () => {
    await onSave?.(data);
  };
  
  // 3d. Render helpers (if needed)
  const renderContent = () => {
    // Complex render logic
  };
  
  // 3e. Return JSX
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

### **RULE 14: Server vs Client Components**

**✅ Use Server Components by default:**

```typescript
// Server Component (default in Next.js 15)
// No "use client" directive
export default async function Page() {
  const data = await fetch('...');
  return <div>{data}</div>;
}
```

**✅ Only use Client Components when needed:**

```typescript
// Client Component - only when you need:
// - useState, useEffect, or other hooks
// - Event handlers (onClick, onChange, etc.)
// - Browser-only APIs
"use client";

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### **RULE 15: Hooks Best Practices**

**❌ DON'T violate Rules of Hooks:**

```typescript
// DON'T - conditional hooks
if (someCondition) {
  const [state, setState] = useState(0); // ❌ WRONG
}

// DON'T - hooks in loops
for (let i = 0; i < 10; i++) {
  useEffect(() => {}); // ❌ WRONG
}
```

**✅ DO follow Rules of Hooks:**

```typescript
// ✅ Hooks at top level only
const [state, setState] = useState(0);
const [data, setData] = useState(null);

// ✅ Conditional logic inside hooks
useEffect(() => {
  if (someCondition) {
    // Conditional logic here
  }
}, [someCondition]);
```

### **RULE 16: Avoid Prop Drilling**

**❌ DON'T pass props through many levels:**

```typescript
// DON'T - prop drilling
<Parent>
  <Child user={user}>
    <GrandChild user={user}>
      <GreatGrandChild user={user} /> // ❌
    </GrandChild>
  </Child>
</Parent>
```

**✅ DO use Context or hooks:**

```typescript
// ✅ Use context for shared state
const UserContext = createContext<User | null>(null);

// Provider at top level
<UserContext.Provider value={user}>
  <Child>
    <GrandChild>
      <GreatGrandChild /> // ✅ Accesses via useContext
    </GrandChild>
  </Child>
</UserContext.Provider>
```

### **React/Next.js Checklist:**

- [ ] Server Components by default
- [ ] "use client" only when needed
- [ ] Hooks at top level
- [ ] Proper dependency arrays in useEffect
- [ ] No prop drilling (use context)
- [ ] Key prop in lists
- [ ] Memoization for expensive operations (useMemo, useCallback)

---

## ⚡ Performance Optimization

### **RULE 17: Optimize Images**

**✅ Always use Next.js Image component:**

```typescript
import Image from 'next/image';

// ✅ DO this
<Image
  src="/images/hero.jpg"
  alt="Hero image"
  width={1200}
  height={630}
  priority // For LCP images
  placeholder="blur" // Optional blur-up
/>

// ❌ DON'T use regular img tag
<img src="/images/hero.jpg" alt="Hero" /> // ❌
```

### **RULE 18: Code Splitting**

**✅ Use dynamic imports for large components:**

```typescript
import dynamic from 'next/dynamic';

// ✅ Lazy load heavy components
const HeavyComponent = dynamic(() => import('@/components/heavy-component'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable SSR if needed
});
```

### **RULE 19: Memoization**

**✅ Use React.memo for expensive components:**

```typescript
import { memo } from 'react';

// ✅ Memoize component that re-renders frequently
const ExpensiveComponent = memo(function ExpensiveComponent({ data }: Props) {
  // Expensive rendering logic
  return <div>{/* ... */}</div>;
});

// ✅ Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return performExpensiveCalculation(data);
}, [data]);

// ✅ Use useCallback for stable function references
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

### **RULE 20: Database Queries**

**✅ Minimize API calls:**

```typescript
// ❌ DON'T make sequential calls
const users = await fetch('/api/users');
const posts = await fetch('/api/posts');
const comments = await fetch('/api/comments');

// ✅ DO parallel fetches
const [users, posts, comments] = await Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments'),
]);
```

### **Performance Checklist:**

- [ ] Use Next.js Image for all images
- [ ] Dynamic imports for heavy components
- [ ] Memo expensive components
- [ ] useMemo for expensive calculations
- [ ] useCallback for stable callbacks
- [ ] Parallel API calls with Promise.all
- [ ] Bundle analysis (npm run build)
- [ ] Lighthouse score > 90

---

## 🔐 Security Best Practices

### **RULE 21: Input Validation**

**✅ ALWAYS validate and sanitize inputs:**

```typescript
import { z } from 'zod';

// ✅ Define validation schema
const articleSchema = z.object({
  title: z.object({
    en: z.string().min(1).max(200),
    hy: z.string().max(200),
    ru: z.string().max(200),
    ar: z.string().max(200),
  }),
  content: z.object({
    en: z.string().min(10),
    hy: z.string(),
    ru: z.string(),
    ar: z.string(),
  }),
  category: z.enum(['news', 'events', 'culture', 'food-drinks', 'destinations']),
});

// ✅ Validate before processing
try {
  const validData = articleSchema.parse(requestData);
  // Process valid data
} catch (error) {
  return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
}
```

### **RULE 22: Authentication & Authorization**

**✅ ALWAYS check authentication:**

```typescript
// ✅ Check on every protected route
export async function POST(request: NextRequest) {
  // 1. Check authentication
  const adminSession = request.cookies.get('admin_session')?.value;
  if (adminSession !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 2. Check authorization (if needed)
  const user = getCurrentUser();
  if (!canAccessResource(user, resourceId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // 3. Process request
}
```

### **RULE 23: Prevent XSS**

**✅ Never use dangerouslySetInnerHTML without sanitization:**

```typescript
import DOMPurify from 'isomorphic-dompurify';

// ❌ DON'T - XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ DO - sanitize first
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userContent) 
}} />

// ✅ BETTER - avoid dangerouslySetInnerHTML entirely
<div>{userContent}</div>
```

### **RULE 24: API Keys & Secrets**

**✅ NEVER commit secrets:**

```typescript
// ❌ DON'T hardcode API keys
const apiKey = 'sk-1234567890abcdef'; // ❌ NEVER

// ✅ DO use environment variables
const apiKey = process.env.DEEPSEEK_API_KEY;

// ✅ DO validate env vars exist
if (!apiKey) {
  throw new Error('DEEPSEEK_API_KEY environment variable is required');
}
```

### **Security Checklist:**

- [ ] Input validation on all user data
- [ ] Authentication on all protected routes
- [ ] Authorization checks where needed
- [ ] Sanitize HTML if using dangerouslySetInnerHTML
- [ ] Use environment variables for secrets
- [ ] HTTPS in production
- [ ] CSRF protection (Next.js default)
- [ ] Rate limiting on API routes

---

## 🚨 Error Handling Standards

### **RULE 25: Graceful Error Handling**

**✅ Always handle errors:**

```typescript
// ✅ Try-catch in async functions
const saveArticle = async () => {
  setSaving(true);
  try {
    const response = await fetch('/api/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save');
    }
    
    toast.success('Article saved successfully!');
    return await response.json();
  } catch (error: any) {
    console.error('Error saving article:', error);
    toast.error(error.message || 'Failed to save article');
    throw error; // Re-throw if caller needs to handle
  } finally {
    setSaving(false);
  }
};
```

### **RULE 26: User-Friendly Error Messages**

**❌ DON'T show technical errors to users:**

```typescript
// ❌ DON'T
toast.error('TypeError: Cannot read property "id" of undefined');
```

**✅ DO show helpful messages:**

```typescript
// ✅ DO
toast.error('Unable to load article. Please try again.');
console.error('Technical details:', error); // Log for debugging
```

### **RULE 27: Error Boundaries**

**✅ Use Error Boundaries for components:**

```typescript
// error.tsx in route folder
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-20 text-center">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### **Error Handling Checklist:**

- [ ] Try-catch in all async operations
- [ ] User-friendly error messages
- [ ] Log technical details for debugging
- [ ] Error boundaries in routes
- [ ] Fallback UI for errors
- [ ] Toast notifications for user feedback
- [ ] Never expose sensitive info in errors

---

## 🧪 Testing Requirements

### **RULE 28: Test Critical Functions**

**✅ Write tests for:**

- API routes
- Translation functions
- Data validation
- Authentication logic
- Business logic

```typescript
// Example test
describe('translateParallel', () => {
  it('should translate to all languages in parallel', async () => {
    const fields = { title: 'Hello', content: 'World' };
    const results = await translateParallel(fields, ['hy', 'ru', 'ar']);
    
    expect(results.hy).toBeDefined();
    expect(results.ru).toBeDefined();
    expect(results.ar).toBeDefined();
  });
});
```

### **Testing Checklist:**

- [ ] Unit tests for utility functions
- [ ] Integration tests for API routes
- [ ] E2E tests for critical user flows
- [ ] Test error cases
- [ ] Test edge cases
- [ ] Test all 4 languages
- [ ] Test mobile breakpoints

---

## 🔄 Git Workflow Standards

### **RULE 29: Commit Message Format**

**✅ Use conventional commits:**

```bash
# Format: <type>(<scope>): <subject>

# Types:
feat: Add new feature
fix: Bug fix
docs: Documentation only
style: Formatting, missing semicolons, etc.
refactor: Code change that neither fixes a bug nor adds a feature
perf: Performance improvement
test: Adding tests
chore: Maintain

# Examples:
git commit -m "feat(translations): Add unified translation service"
git commit -m "fix(auth): Use admin_session cookie instead of admin_token"
git commit -m "docs: Add development rules guide"
git commit -m "perf(images): Optimize image loading with Next.js Image"
```

### **RULE 30: Branch Naming**

```bash
# Format: <type>/<short-description>

# Examples:
git checkout -b feat/unified-translation
git checkout -b fix/hero-slides-auth
git checkout -b docs/api-documentation
git checkout -b refactor/simplify-banner-logic
```

### **RULE 31: Pull Request Requirements**

**Before creating PR:**

- [ ] Code follows all development rules
- [ ] All tests pass
- [ ] No console.log statements (use proper logging)
- [ ] TypeScript compiles with no errors
- [ ] ESLint passes with no errors
- [ ] Tested in all 4 languages
- [ ] Tested on mobile
- [ ] Updated documentation if needed

### **Git Workflow Checklist:**

- [ ] Conventional commit messages
- [ ] Descriptive branch names
- [ ] Pull requests reviewed before merge
- [ ] No force push to main
- [ ] Keep commits atomic (one change per commit)
- [ ] Squash WIP commits before merge

---

## 📝 Documentation Requirements

### **RULE 32: Code Comments**

**✅ Comment complex logic:**

```typescript
/**
 * Translates article content to multiple languages in parallel
 * @param content - Article content with English text
 * @param options - Translation options with progress callbacks
 * @returns Updated content with all translations
 */
export async function translateArticleContent(
  content: ArticleContent,
  options?: TranslationOptions
): Promise<ArticleContent> {
  // Determine which languages need translation
  const missingLangs = getMissingLanguages(content);
  
  // Early return if nothing to translate
  if (missingLangs.length === 0) {
    return content;
  }
  
  // Translate all languages in parallel for performance
  const results = await translateFieldsParallel(/* ... */);
  
  // Merge translations back into content
  return mergeTranslations(content, results);
}
```

### **RULE 33: README Files**

**✅ Create README for complex features:**

```markdown
# Feature Name

## Overview
Brief description of the feature

## Usage
Code examples showing how to use

## API Reference
Function signatures and parameters

## Examples
Real-world usage examples

## Testing
How to test this feature
```

### **Documentation Checklist:**

- [ ] JSDoc comments on public functions
- [ ] README for complex features
- [ ] Update main docs when adding features
- [ ] Code comments explain "why" not "what"
- [ ] Examples in documentation
- [ ] Keep docs up to date

---

## ♿ Accessibility Standards

### **RULE 34: Semantic HTML**

**✅ Use proper HTML elements:**

```typescript
// ✅ DO
<button onClick={handleClick}>Submit</button>
<nav>...</nav>
<main>...</main>
<article>...</article>

// ❌ DON'T
<div onClick={handleClick}>Submit</div> // ❌ Not accessible
```

### **RULE 35: ARIA Labels**

**✅ Add ARIA labels where needed:**

```typescript
<button 
  onClick={handleClose} 
  aria-label="Close dialog"
>
  <X className="w-4 h-4" />
</button>

<input 
  type="text"
  aria-label="Search articles"
  placeholder="Search..."
/>
```

### **RULE 36: Keyboard Navigation**

**✅ Ensure keyboard accessibility:**

```typescript
// ✅ Keyboard event handlers
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</div>
```

### **RULE 37: Focus Management**

**✅ Manage focus in modals/dialogs:**

```typescript
useEffect(() => {
  if (isOpen) {
    // Focus first element in dialog
    dialogRef.current?.focus();
  }
}, [isOpen]);
```

### **Accessibility Checklist:**

- [ ] Semantic HTML elements
- [ ] ARIA labels on icon buttons
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast ratio > 4.5:1
- [ ] Alt text on images
- [ ] Form labels associated with inputs
- [ ] Screen reader tested

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
11. Violate Rules of Hooks
12. Prop drilling through many levels
13. Use `<img>` instead of Next.js `<Image>`
14. Commit secrets or API keys
15. Show technical errors to users
16. Skip input validation
17. Force push to main branch
18. Merge without code review
19. Skip accessibility features
20. Leave console.log in production code

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
11. Follow React Hooks rules
12. Use Context for shared state
13. Use Next.js Image component
14. Use environment variables
15. Show user-friendly errors
16. Validate all inputs
17. Use feature branches
18. Request code review
19. Add ARIA labels
20. Remove debug logs before commit

---

## 🎯 Summary

**Three Golden Rules:**

1. **🌍 Translation:** Use `useTranslation()` hook, always parallel, add to dictionary
2. **📄 New Pages:** Include banner, translate all text, add to dictionary
3. **🔐 Authentication:** Use `admin_session` cookie, never `admin_token`

**Quality Pillars:**

- **Type Safety:** No `any` types, proper interfaces, type guards
- **Performance:** Parallel operations, memoization, optimized images
- **Security:** Input validation, authentication checks, no secrets in code
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation
- **Error Handling:** Try-catch, user-friendly messages, error boundaries

**Follow these rules = Production-ready, enterprise-grade code!** 🚀

---

## 🎓 Learning Resources

### **Internal Documentation:**
- `DEVELOPMENT_RULES.md` - This file (comprehensive rules)
- `TRANSLATION_GUIDE.md` - Deep dive into translation system
- `BANNER_MANAGER_GUIDE.md` - Banner usage guide
- `.vscode/nare-rules.code-snippets` - Code snippet templates

### **External Resources:**
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Best Practices](https://react.dev/learn)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🔍 Code Quality Metrics

### **Before Merge Checklist:**

#### **Functionality:**
- [ ] ✅ Feature works as expected
- [ ] ✅ No console errors
- [ ] ✅ All edge cases handled
- [ ] ✅ Tested in all 4 languages
- [ ] ✅ Works on mobile (responsive)
- [ ] ✅ Works on different browsers

#### **Code Quality:**
- [ ] ✅ Follows all development rules
- [ ] ✅ TypeScript strict mode passes
- [ ] ✅ ESLint passes with no warnings
- [ ] ✅ No `any` types used
- [ ] ✅ Proper error handling
- [ ] ✅ Loading states implemented

#### **Performance:**
- [ ] ✅ No unnecessary re-renders
- [ ] ✅ Images optimized
- [ ] ✅ Bundle size acceptable
- [ ] ✅ Lighthouse score > 90
- [ ] ✅ Parallel operations where possible

#### **Security:**
- [ ] ✅ Input validation present
- [ ] ✅ Authentication checks in place
- [ ] ✅ No secrets in code
- [ ] ✅ XSS prevention
- [ ] ✅ CSRF protection

#### **Accessibility:**
- [ ] ✅ Keyboard navigation works
- [ ] ✅ Screen reader compatible
- [ ] ✅ ARIA labels present
- [ ] ✅ Color contrast sufficient
- [ ] ✅ Focus indicators visible

#### **Documentation:**
- [ ] ✅ Code comments where needed
- [ ] ✅ JSDoc on public functions
- [ ] ✅ README updated if needed
- [ ] ✅ Translation keys documented

---

## 📞 Questions & Support

### **If you're unsure about any rule:**

1. **Check this document** - Most answers are here
2. **Check reference docs** - Translation guide, banner guide, etc.
3. **Look at existing code** - Find similar implementations
4. **Use code snippets** - Type snippet prefix in VS Code
5. **Ask team lead** - When truly stuck
6. **When in doubt, follow the checklist!** - Checklists don't lie

### **How to Propose Rule Changes:**

These rules are living documents and can be improved:

1. **Discuss with team** - Get consensus
2. **Create branch** - `docs/update-dev-rules`
3. **Update this file** - Make your changes
4. **Submit PR** - With clear explanation
5. **Get approval** - Team lead reviews
6. **Merge and announce** - Notify all developers

### **Rule Violations:**

If you see code that violates these rules:

1. **Don't merge it** - Reject in code review
2. **Explain the issue** - Reference specific rule
3. **Suggest fix** - Point to correct pattern
4. **Help if needed** - Pair programming
5. **Update rules** - If rule is unclear

---

## 📊 Project Standards Overview

| Category | Standard | Tool/Method |
|----------|----------|-------------|
| **Language** | TypeScript (Strict) | tsconfig.json |
| **Framework** | Next.js 15 | App Router |
| **Styling** | Tailwind CSS | JIT Mode |
| **UI Components** | shadcn/ui | Radix UI |
| **State** | React Hooks + Context | useState, useContext |
| **Forms** | Controlled Components | React Hook Form (if complex) |
| **Validation** | Zod | Schema validation |
| **Translation** | Custom Service | useTranslation hook |
| **Icons** | Lucide React | Tree-shakeable |
| **Images** | Next.js Image | Automatic optimization |
| **Auth** | Cookie-based | admin_session cookie |
| **API** | Next.js API Routes | RESTful |
| **Database** | JSON Files | In /data folder |
| **Git** | Conventional Commits | Feature branches |
| **Code Quality** | ESLint + Prettier | Auto-fix on save |
| **Accessibility** | WCAG 2.1 AA | Manual + automated tests |

---

## 🎯 Quality Gates

### **Level 1: Code Compiles**
- TypeScript compiles with no errors
- ESLint passes
- No syntax errors

### **Level 2: Functionality Works**
- Feature works as designed
- All use cases covered
- Edge cases handled

### **Level 3: Quality Standards**
- Follows all development rules
- Proper types defined
- Error handling in place
- Loading states implemented

### **Level 4: Production Ready**
- Security validated
- Performance optimized
- Accessibility tested
- All languages work
- Mobile responsive

### **Level 5: Excellence**
- Documentation complete
- Tests written
- Code reviewed
- Metrics tracked

**All code must reach Level 4 minimum before merge.**

---

**Last Updated:** November 8, 2025  
**Version:** 2.0 (Enhanced with Quality Standards)  
**Maintained by:** Development Team  
**Review Cycle:** Monthly

---

## 📜 Version History

### **v2.0 - November 8, 2025**
- ✅ Added comprehensive TypeScript best practices
- ✅ Added React & Next.js best practices
- ✅ Added performance optimization rules
- ✅ Added security best practices
- ✅ Added error handling standards
- ✅ Added testing requirements
- ✅ Added Git workflow standards
- ✅ Added documentation requirements
- ✅ Added accessibility standards
- ✅ Added quality gates
- ✅ Added code quality metrics
- ✅ Enhanced checklists

### **v1.0 - November 8, 2025**
- ✅ Initial release
- ✅ Translation standards
- ✅ Page creation standards
- ✅ Banner integration rules
- ✅ Admin panel integration
- ✅ Basic code quality standards

---

**🎉 These are MANDATORY standards for production-quality code. Follow them consistently!**
