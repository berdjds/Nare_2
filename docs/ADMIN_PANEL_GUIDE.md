# Admin Control Panel - Complete Guide
## Filarche Travel Website

## 📋 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Managing Content](#managing-content)
5. [Security](#security)
6. [Technical Details](#technical-details)

---

## Overview

The Admin Control Panel is a comprehensive content management system that allows you to manage all dynamic content on the Filarche Travel website without touching code.

**Admin Panel URL**: `http://localhost:3000/admin/login`

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important**: Change these credentials in production!

---

## Features

### 1. Hero Section Management
Manage the homepage hero slider with destination showcases:
- Add/remove/reorder slides
- Set background images for full-screen display
- Set card images for the carousel
- Add titles and descriptions for each destination
- Control slide order with drag functionality

### 2. Tour Packages Management
Manage all tour offerings across three categories:
- **Daily Tours**: Short day trips
- **Cultural Tours**: Heritage and culture experiences
- **Adventure Tours**: Outdoor activities

For each tour you can set:
- Title and description
- Duration and group size
- Location
- Price (in AMD)
- Category
- Featured image

### 3. Team Members Management
Showcase your team on the About page:
- Add team member profiles
- Set name, position, and bio
- Upload profile images
- Control display order

### 4. Contact Information
Manage all contact details displayed in footer and contact page:
- Phone number
- Email address
- Physical address
- WhatsApp number
- Telegram username

### 5. Social Media Links
Update all social media profile links:
- Facebook
- Instagram
- Twitter/X
- LinkedIn
- YouTube

---

## Getting Started

### First Time Setup

1. **Access the Admin Panel**
   ```
   Navigate to: http://localhost:3000/admin/login
   ```

2. **Login with Default Credentials**
   - Username: `admin`
   - Password: `admin123`

3. **Initialize Data (if needed)**
   The system will automatically create default data structures on first use.

### Navigation

The admin dashboard uses a tab-based interface:
- **Hero Slides** - Homepage slider management
- **Tour Packages** - All tour offerings
- **Team Members** - Team profiles
- **Contact Info** - Contact details
- **Social Links** - Social media profiles

---

## Managing Content

### Hero Slides

#### Adding a New Slide
1. Click "Add Slide" button
2. Fill in the fields:
   - **Title**: Destination name (e.g., "Sharm El Sheikh")
   - **Description**: Brief description
   - **Background Image URL**: Path to hero image (e.g., `/images/hero/noravank.webp`)
   - **Card Image URL**: Path to card image (e.g., `/images/destinations/sharm.webp`)
3. Use ⬆️ ⬇️ buttons to reorder slides
4. Click "Save All" to persist changes

#### Editing a Slide
1. Locate the slide you want to edit
2. Modify any field
3. Click "Save All"

#### Deleting a Slide
1. Click the 🗑️ (trash) button on the slide
2. Click "Save All" to confirm deletion

---

### Tour Packages

#### Adding a New Tour
1. Click "Add Tour" button
2. Fill in all details:
   - **Title**: Tour name
   - **Category**: Daily, Cultural, or Adventure
   - **Duration**: e.g., "6 hours", "3 days"
   - **Group Size**: e.g., "1-15", "2-20"
   - **Location**: Province or region
   - **Price**: Amount in AMD (numbers only)
   - **Image URL**: Path to tour image
   - **Description**: Full tour description
3. Click "Save All"

#### Organizing Tours
Tours are automatically filtered by category on the frontend:
- Daily Tours appear on `/armenia-tours/daily`
- Cultural Tours appear on `/armenia-tours/cultural`
- Adventure Tours appear on `/armenia-tours/adventure`

---

### Team Members

#### Adding Team Members
1. Click "Add Member"
2. Enter details:
   - **Name**: Full name
   - **Position**: Job title
   - **Bio**: Short biography
   - **Image URL**: Profile photo path
3. Use ordering buttons to arrange team display
4. Click "Save All"

---

### Contact Information

1. Select the "Contact Info" tab
2. Update any fields:
   - Phone (with country code)
   - Email
   - Address
   - WhatsApp (with country code)
   - Telegram username (with @)
3. Click "Save Contact Info"

**Where it appears:**
- Footer of all pages
- Contact page
- Various call-to-action sections

---

### Social Media Links

1. Select the "Social Links" tab
2. Enter full URLs for each platform:
   ```
   https://facebook.com/yourpage
   https://instagram.com/yourpage
   https://twitter.com/yourpage
   https://linkedin.com/company/yourpage
   https://youtube.com/@yourpage
   ```
3. Leave blank if you don't use a platform
4. Click "Save Social Links"

**Where it appears:**
- Footer social icons
- Contact page

---

## Security

### Authentication
- Simple session-based authentication
- 24-hour session timeout
- HTTP-only cookies for security

### Changing Default Credentials

**IMPORTANT**: You must change default credentials before deployment!

Edit the file: `lib/auth.ts`

```typescript
const ADMIN_CREDENTIALS = {
  username: 'your_new_username',
  password: 'your_secure_password', // Use a strong password!
};
```

### Production Recommendations

For production deployment:

1. **Use Environment Variables**
   ```bash
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_hashed_password
   ```

2. **Implement Proper Authentication**
   - Consider using NextAuth.js
   - Implement password hashing (bcrypt)
   - Add 2FA if handling sensitive data

3. **Use a Real Database**
   - Current system uses JSON files
   - Migrate to PostgreSQL, MongoDB, or similar
   - Add proper backup strategy

4. **Add HTTPS**
   - Essential for production
   - Protects credentials in transit

5. **Rate Limiting**
   - Prevent brute force attacks
   - Limit login attempts

---

## Technical Details

### Architecture

**Frontend:**
- Next.js 16 with App Router
- React Server Components
- TypeScript for type safety
- Tailwind CSS + shadcn/ui components

**Backend:**
- Next.js API Routes
- File-based storage (JSON)
- Server-side authentication

**Data Storage:**
Data is stored in JSON files in the `/data` directory:
```
data/
├── heroSlides.json
├── tourPackages.json
├── teamMembers.json
├── contactInfo.json
└── socialLinks.json
```

### API Endpoints

**Authentication:**
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout

**Content Management:**
- `GET /api/content/[type]` - Get content (public)
- `POST /api/content/[type]` - Update content (admin only)

**Initialization:**
- `POST /api/init-data` - Initialize default data

### File Structure

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx          # Login page
│   └── dashboard/
│       └── page.tsx          # Main dashboard
├── api/
│   ├── admin/
│   │   ├── login/route.ts    # Login endpoint
│   │   └── logout/route.ts   # Logout endpoint
│   ├── content/
│   │   └── [type]/route.ts   # Content CRUD
│   └── init-data/route.ts    # Data initialization

components/
└── admin/
    ├── hero-slides-manager.tsx
    ├── tour-packages-manager.tsx
    ├── team-members-manager.tsx
    ├── contact-info-manager.tsx
    └── social-links-manager.tsx

lib/
├── auth.ts                   # Authentication utilities
└── content-storage.ts        # Data storage layer
```

### Data Types

```typescript
interface HeroSlide {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  cardImage: string;
  order: number;
}

interface TourPackage {
  id: string;
  title: string;
  description: string;
  duration: string;
  groupSize: string;
  location: string;
  price: number;
  image: string;
  category: 'daily' | 'cultural' | 'adventure';
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  order: number;
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  telegram: string;
}

interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
}
```

---

## Troubleshooting

### Cannot Login
- Check that credentials match those in `lib/auth.ts`
- Clear browser cookies and try again
- Check browser console for errors

### Changes Not Appearing
- Click "Save All" or "Save" button
- Refresh the frontend page
- Check browser network tab for failed requests

### Data Not Persisting
- Ensure `/data` directory has write permissions
- Check server console for errors
- Verify file system access

### Images Not Displaying
- Verify image paths are correct (relative to `/public`)
- Images should be in `/public/images/` directories
- Use format: `/images/folder/filename.webp`

---

## Best Practices

### Image Management
1. **Optimize images before upload**
   - Use WebP format for best compression
   - Recommended sizes:
     - Hero backgrounds: 1920x1080px
     - Card images: 600x400px
     - Team photos: 400x400px
     - Tour images: 800x600px

2. **Use descriptive filenames**
   ```
   ✅ Good: /images/tours/garni-temple-tour.webp
   ❌ Bad: /images/img1.jpg
   ```

3. **Organize by category**
   ```
   /images/hero/
   /images/destinations/
   /images/tours/
   /images/team/
   ```

### Content Writing
1. **Keep descriptions concise**
   - Hero slides: 1-2 sentences
   - Tours: 2-3 paragraphs
   - Team bios: 3-4 sentences

2. **Use consistent formatting**
   - Capitalize tour names properly
   - Use consistent duration format ("6 hours", not "6h")
   - Format prices consistently (15000 AMD)

3. **SEO Considerations**
   - Use descriptive titles
   - Include location keywords
   - Add relevant details

---

## Roadmap / Future Enhancements

Potential improvements for future versions:

1. **Image Upload System**
   - Direct image upload (vs manual URL entry)
   - Image management interface
   - Automatic optimization

2. **Rich Text Editor**
   - WYSIWYG editor for descriptions
   - Formatting options
   - Link insertion

3. **Multi-language Support**
   - Manage translations through UI
   - Language switcher in admin
   - Preview in different languages

4. **Analytics Dashboard**
   - View booking statistics
   - Popular tours tracking
   - User engagement metrics

5. **Booking Management**
   - View/manage tour bookings
   - Customer database
   - Email notifications

6. **User Roles**
   - Multiple admin accounts
   - Editor role (no delete permissions)
   - Viewer role (read-only)

7. **Content Scheduling**
   - Schedule content publication
   - Seasonal tour management
   - Auto-archive old tours

8. **Backup & Restore**
   - One-click backup
   - Restore from backup
   - Version history

---

## Support

For technical support or questions:
- Check the troubleshooting section above
- Review the technical documentation
- Consult the developer team

---

**Version**: 1.0.0  
**Last Updated**: November 1, 2025  
**Status**: Production Ready
