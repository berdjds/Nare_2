# Admin Panel - Frontend Integration

## ✅ What's Connected to Admin Panel

This document shows which parts of the frontend now display dynamic content from the admin panel.

---

## 🔗 Connected Components

### 1. Hero Slider (Homepage) ✅

**Component**: `components/hero-slider/index.tsx`  
**API Endpoint**: `GET /api/content/heroSlides`  
**What's Dynamic**:
- Slide images (background & card)
- Slide titles
- Slide descriptions
- Slide order

**How it works**:
- Fetches slides from admin API on component mount
- Falls back to default data if no admin data exists
- Automatically sorts by order field
- Displays up to 6 slides in carousel

**Admin Panel Section**: Hero Slides tab

---

### 2. Footer - Contact Information ✅

**Component**: `components/footer.tsx`  
**API Endpoint**: `GET /api/content/contactInfo`  
**What's Dynamic**:
- Phone number
- Email address
- Physical address

**How it works**:
- Fetches contact info from admin API
- Updates footer contact section
- Falls back to defaults if API fails
- Auto-formats phone links

**Admin Panel Section**: Contact Info tab

---

### 3. Footer - Social Media Links ✅

**Component**: `components/footer.tsx`  
**API Endpoint**: `GET /api/content/socialLinks`  
**What's Dynamic**:
- Facebook link
- Instagram link
- Twitter link
- LinkedIn link
- YouTube link

**How it works**:
- Fetches social links from admin API
- Only displays platforms with URLs set
- Uses appropriate icons for each platform
- Falls back to default links if not set

**Admin Panel Section**: Social Links tab

---

## ⏳ Not Yet Connected (Future Updates)

These components still use hardcoded/static data:

### Tour Packages
- **Files**: `app/armenia-tours/*/page.tsx`
- **Status**: Static data
- **Next Step**: Update to fetch from `/api/content/tourPackages`

### Team Members
- **Files**: `app/about/page.tsx` (if exists)
- **Status**: Static data  
- **Next Step**: Update to fetch from `/api/content/teamMembers`

### Services Pages
- **Files**: `app/services/*/page.tsx`
- **Status**: Static content
- **Next Step**: Consider adding to admin panel

---

## 🔄 How Data Flows

```
Admin Panel
    ↓
Save Button
    ↓
POST /api/content/[type]
    ↓
JSON File Storage (/data/*.json)
    ↓
GET /api/content/[type]
    ↓
Frontend Components
    ↓
User Sees Changes
```

---

## 🚀 Testing the Integration

### Test Hero Slides

1. Go to admin panel: `http://localhost:3000/admin/login`
2. Navigate to "Hero Slides" tab
3. Add a new slide with:
   - Title: "Test Destination"
   - Background Image: `/images/hero/garni.webp`
   - Card Image: `/images/destinations/dubai.webp`
   - Description: "This is a test"
4. Click "Save All"
5. Visit homepage: `http://localhost:3000`
6. **Expected**: New slide appears in carousel

### Test Contact Info

1. Go to admin panel
2. Navigate to "Contact Info" tab
3. Change phone number to: "+374 11 222 333"
4. Change email to: "test@example.com"
5. Click "Save Contact Info"
6. Scroll to footer on any page
7. **Expected**: New phone and email displayed

### Test Social Links

1. Go to admin panel
2. Navigate to "Social Links" tab
3. Add YouTube URL: "https://youtube.com/@yourcompany"
4. Click "Save Social Links"
5. Scroll to footer on any page
6. **Expected**: YouTube icon appears with link

---

## 💡 Important Notes

### Cache Considerations
- **Browser Cache**: Hard refresh (Cmd/Ctrl + Shift + R) may be needed
- **Next.js Cache**: Changes appear immediately in development
- **Production**: May need to clear Next.js cache

### Fallback Behavior
All components have fallback data if:
- API is unavailable
- No admin data exists
- Network error occurs

This ensures the site always displays something.

### Error Handling
- All API calls have try/catch blocks
- Errors logged to console (check browser DevTools)
- User experience not affected by API failures

---

## 🔧 For Developers

### Adding New Dynamic Content

To connect another component to admin panel:

1. **Create admin manager component** (if not exists)
2. **Add state hooks** in frontend component:
   ```typescript
   const [data, setData] = useState(defaultData);
   ```

3. **Fetch data in useEffect**:
   ```typescript
   useEffect(() => {
     fetch('/api/content/yourType')
       .then(res => res.json())
       .then(setData)
       .catch(console.error);
   }, []);
   ```

4. **Use dynamic data** in JSX:
   ```typescript
   {data.map(item => <Component key={item.id} {...item} />)}
   ```

### Data Structure Example

**Hero Slide**:
```typescript
{
  id: "1699123456",
  title: "Dubai",
  description: "Modern luxury destination",
  backgroundImage: "/images/hero/dubai.webp",
  cardImage: "/images/destinations/dubai.webp",
  order: 0
}
```

**Contact Info**:
```typescript
{
  phone: "+374 XX XXX XXX",
  email: "info@example.com",
  address: "Yerevan, Armenia",
  whatsapp: "+374 XX XXX XXX",
  telegram: "@username"
}
```

**Social Links**:
```typescript
{
  facebook: "https://facebook.com/page",
  instagram: "https://instagram.com/page",
  twitter: "https://twitter.com/page",
  linkedin: "https://linkedin.com/company/page",
  youtube: "https://youtube.com/@page"
}
```

---

## 📊 Integration Status

| Component | Status | Admin Tab | API Endpoint |
|-----------|--------|-----------|--------------|
| Hero Slider | ✅ Connected | Hero Slides | /api/content/heroSlides |
| Footer Contact | ✅ Connected | Contact Info | /api/content/contactInfo |
| Footer Social | ✅ Connected | Social Links | /api/content/socialLinks |
| Tour Packages | ⏳ Pending | Tour Packages | /api/content/tourPackages |
| Team Members | ⏳ Pending | Team Members | /api/content/teamMembers |

---

## 🎯 Next Steps

To complete the integration:

1. **Update Tour Pages** - Connect daily/cultural/adventure tours to admin data
2. **Update About Page** - Connect team members to admin data
3. **Add Image Upload** - Replace URL inputs with file uploads
4. **Add Rich Text Editor** - Better formatting for descriptions
5. **Add Preview Mode** - Preview changes before publishing

---

## 🆘 Troubleshooting

**Changes not appearing?**
- Hard refresh the page (Cmd/Ctrl + Shift + R)
- Check browser console for errors
- Verify data was saved (check `/data` folder)
- Check Network tab in DevTools

**API errors?**
- Ensure dev server is running
- Check `/data` folder permissions
- Look for errors in terminal

**Images not loading?**
- Verify image paths start with `/images/`
- Check files exist in `/public/images/`
- Use correct file extensions (.webp, .jpg, .png)

---

**Last Updated**: November 1, 2025  
**Status**: ✅ Core Integration Complete
