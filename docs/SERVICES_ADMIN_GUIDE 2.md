# Services Section - Admin Management Guide

## Overview
The Services section is now fully manageable through the admin panel. This guide explains how to update content, manage translations, and customize the appearance.

## Content Structure

### Section Header
The header consists of four main elements:

1. **Tagline Badge** - Small text in a colored badge
2. **Main Title** - Large heading
3. **Subtitle** - Medium-sized description
4. **Description** - Detailed paragraph

### Service Cards
Each service card contains:
- **Icon Badge** - Circular colored badge with icon
- **Image** - Background photo
- **Title** - Service name
- **Description** - Brief explanation
- **Link** - Destination URL
- **Order** - Display position
- **Status** - Enabled/Disabled

---

## How to Update Content

### Via Admin Panel (Recommended)

#### 1. Navigate to Services Management
```
Admin Dashboard → Content → Services Section
```

#### 2. Edit Section Header
- Update the tagline, title, subtitle, and description
- Available for all 4 languages (English, Armenian, Russian, Arabic)
- Changes reflect immediately on the website

#### 3. Manage Service Cards
- Click on any service card to edit
- Toggle "Enable/Disable" switch to show/hide
- Change display order by dragging or setting number
- Update translations for all languages

### Via Translation Files (Advanced)

**File Location:** `/lib/translations.ts`

```typescript
services: {
  tagline: "What We Offer",
  title: "Our Services",
  subtitle: "Experience excellence in travel with our dedicated services",
  description: "From exploring Armenia's ancient wonders...",
  daily: {
    title: "Daily Tours",
    description: "Discover Armenia's most beautiful destinations with expert local guides"
  },
  // ... other services
}
```

---

## Language Support

### Supported Languages
- 🇬🇧 **English** (en)
- 🇦🇲 **Armenian** (hy)
- 🇷🇺 **Russian** (ru)
- 🇦🇪 **Arabic** (ar)

### RTL Support
Arabic automatically displays with:
- Right-to-left text direction
- Mirrored layout
- Flipped icons and arrows

### Adding New Language

1. Add language code to `languages` array
2. Add translations for all fields:
   ```typescript
   {
     services: {
       tagline: { ..., fr: "Ce Que Nous Offrons" },
       title: { ..., fr: "Nos Services" },
       // ... rest of fields
     }
   }
   ```
3. Component automatically supports new language

---

## Service Card Configuration

### Available Icons
- `MapPin` - Location/Tours
- `Globe` - International/Worldwide
- `Briefcase` - Business/Corporate
- `Users` - Groups/Teams
- `Route` - Journeys/Paths
- `HeadphonesIcon` - Support/Service

### Color Options
Use Tailwind CSS classes:
- `bg-primary` - Brand primary color (orange)
- `bg-secondary` - Brand secondary color (green)
- `bg-blue-500` - Blue
- `bg-purple-500` - Purple
- `bg-red-500` - Red
- `bg-indigo-500` - Indigo

### Image Management
Images are stored in `/public/images/` and referenced by key:
- `tourGarni` - Armenian temple
- `destinationDubai` - Dubai cityscape
- `serviceMice` - Business meeting

To add new image:
1. Upload to `/public/images/services/`
2. Add key to `useImages` hook
3. Reference in service configuration

---

## Best Practices

### Content Writing

#### Tagline
- **Length:** 2-5 words
- **Style:** Action-oriented
- **Examples:**
  - ✅ "What We Offer"
  - ✅ "Our Expertise"
  - ❌ "These are all the services that we provide to our customers"

#### Title
- **Length:** 2-5 words
- **Style:** Clear and direct
- **Examples:**
  - ✅ "Our Services"
  - ✅ "What We Do"
  - ❌ "Here's Everything We Can Do For You"

#### Subtitle
- **Length:** 8-15 words
- **Style:** Benefit-focused
- **Examples:**
  - ✅ "Experience excellence in travel with our dedicated services"
  - ✅ "Creating unforgettable journeys since 2014"
  - ❌ "We are a travel company that provides services"

#### Description
- **Length:** 200-300 characters
- **Style:** Informative and inspiring
- **Structure:**
  - What you offer
  - Your unique value
  - Call to emotion
- **Example:**
  ```
  From exploring Armenia's ancient wonders to planning your dream 
  international getaway, we provide comprehensive travel solutions 
  tailored to your needs. With over a decade of expertise, we turn 
  your travel aspirations into unforgettable experiences.
  ```

#### Service Descriptions
- **Length:** 80-120 characters
- **Style:** Feature + Benefit
- **Examples:**
  - ✅ "Discover Armenia's most beautiful destinations with expert local guides"
  - ✅ "Explore worldwide destinations with our curated travel packages"
  - ❌ "Tours" or "We do tours in Armenia"

### SEO Optimization

#### Keywords to Include
- Service names (Daily Tours, International Travel, etc.)
- Location names (Armenia, worldwide, etc.)
- Key features (expert guides, curated packages, etc.)
- Benefits (unforgettable, comprehensive, tailored, etc.)

#### Meta Information
Update these in your SEO settings:
- **Meta Title:** "Our Services - [Company Name]"
- **Meta Description:** Use the section description
- **Keywords:** travel services, Armenia tours, international packages, business travel, MICE services

---

## Troubleshooting

### Translation Not Showing
**Problem:** Key showing instead of translated text (e.g., "home.services.tagline")

**Solutions:**
1. Check translation exists for current language
2. Verify translation key is correct
3. Clear browser cache and reload
4. Check fallback is working: `t('key') || 'Fallback Text'`

### Icons Not Displaying
**Problem:** Icon badge is empty

**Solutions:**
1. Verify icon name matches available icons
2. Check import statement includes icon: `import { MapPin, Globe, Briefcase } from 'lucide-react'`
3. Add new icon to imports if using custom icon

### RTL Layout Issues
**Problem:** Arabic layout not mirroring correctly

**Solutions:**
1. Ensure `dir={isArabic ? 'rtl' : 'ltr'}` is set
2. Check icon rotation: `${isArabic ? 'rotate-180' : ''}`
3. Verify positioning: `${isArabic ? 'right-4' : 'left-4'}`

### Service Not Appearing
**Problem:** Service card not visible

**Solutions:**
1. Check `enabled: true` in configuration
2. Verify image path is correct
3. Check if order number is valid
4. Ensure translations exist for current language

---

## API Endpoints (For Developers)

### Get Services Content
```http
GET /api/admin/services-content
Authorization: Bearer {admin-token}

Response:
{
  "success": true,
  "data": {
    "tagline": { "en": "...", "hy": "...", "ru": "...", "ar": "..." },
    "title": { ... },
    "services": { ... }
  }
}
```

### Update Section Header
```http
PUT /api/admin/services-content/header
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "tagline": { "en": "What We Offer", ... },
  "title": { "en": "Our Services", ... },
  "subtitle": { ... },
  "description": { ... }
}

Response:
{
  "success": true,
  "message": "Header updated successfully"
}
```

### Update Individual Service
```http
PATCH /api/admin/services-content/service/{serviceKey}
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "title": { "en": "Daily Tours", ... },
  "description": { ... },
  "enabled": true,
  "order": 1,
  "icon": "MapPin",
  "color": "bg-primary"
}

Response:
{
  "success": true,
  "message": "Service updated successfully"
}
```

### Reorder Services
```http
POST /api/admin/services-content/reorder
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "order": ["daily", "international", "business"]
}

Response:
{
  "success": true,
  "message": "Services reordered successfully"
}
```

---

## Change History

### Version 2.0 (Current)
- ✅ Added tagline badge with gradient background
- ✅ Improved typography hierarchy
- ✅ Added description paragraph
- ✅ Enhanced service descriptions
- ✅ Added decorative line separator
- ✅ Implemented gradient text effect on title
- ✅ Added premium hover animations
- ✅ Full RTL support for Arabic

### Version 1.0
- Basic services grid
- Simple card layout
- Basic translations

---

## Support

For technical support or questions about managing services content:
- Email: dev@naretravel.com
- Documentation: https://docs.naretravel.com
- Admin Panel: https://naretravel.com/admin

---

## Quick Reference

### Optimal Character Counts
| Field | Min | Optimal | Max |
|-------|-----|---------|-----|
| Tagline | 10 | 20-30 | 50 |
| Title | 10 | 20-40 | 100 |
| Subtitle | 50 | 100-150 | 200 |
| Description | 150 | 200-300 | 500 |
| Service Title | 10 | 20-40 | 100 |
| Service Desc | 60 | 80-120 | 200 |

### Required Fields
- ✅ Tagline (all languages)
- ✅ Title (all languages)
- ✅ Subtitle (all languages)
- ✅ Description (all languages)
- ✅ Service Title (all languages)
- ✅ Service Description (all languages)
- ✅ Icon
- ✅ Color
- ✅ Link URL
- ✅ Order number

### Optional Fields
- Image key (uses default if not specified)
- Custom CSS classes
- Additional metadata
