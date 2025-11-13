# Admin Panel - Quick Start Guide

## 🚀 Getting Started in 3 Minutes

### Step 1: Access the Admin Panel
Open your browser and navigate to:
```
http://localhost:3000/admin/login
```

### Step 2: Login
Use the default credentials:
- **Username**: `admin`
- **Password**: `admin123`

### Step 3: Start Managing Content
You'll see 5 tabs for different content types:
- **Hero Slides** - Homepage slider
- **Tour Packages** - All tours
- **Team Members** - Your team
- **Contact Info** - Contact details
- **Social Links** - Social media

---

## 📝 Common Tasks

### Add a Hero Slide
1. Click "Hero Slides" tab
2. Click "Add Slide"
3. Fill in:
   - Title: "Sharm El Sheikh"
   - Background Image: `/images/hero/noravank.webp`
   - Card Image: `/images/destinations/sharm.webp`
   - Description: "Beautiful beaches and crystal clear water"
4. Click "Save All"

### Add a Tour Package
1. Click "Tour Packages" tab
2. Click "Add Tour"
3. Fill in all fields:
   - Title, Category, Duration, etc.
   - Price in AMD (numbers only)
4. Click "Save All"

### Update Contact Info
1. Click "Contact Info" tab
2. Update phone, email, address
3. Click "Save Contact Info"

### Update Social Links
1. Click "Social Links" tab
2. Enter full URLs for each platform
3. Click "Save Social Links"

---

## 📁 Where to Put Images

Images should be in the `/public/images/` directory:

```
public/images/
├── hero/          - Hero slider backgrounds
├── destinations/  - Destination card images
├── tours/         - Tour package images
└── team/         - Team member photos
```

**Image URLs in admin panel**:
- Use paths starting with `/images/`
- Example: `/images/tours/garni-temple.webp`

---

## ⚠️ Important Notes

1. **Always click Save!** Changes aren't saved automatically
2. **Use correct image paths** - Start with `/images/`
3. **Keep descriptions concise** - Better for user experience
4. **Test on frontend** - View changes on the actual website

---

## 🔒 Security

**⚠️ CHANGE DEFAULT PASSWORD BEFORE PRODUCTION!**

Edit `/lib/auth.ts`:
```typescript
const ADMIN_CREDENTIALS = {
  username: 'your_new_username',
  password: 'your_secure_password',
};
```

---

## 🆘 Troubleshooting

**Can't login?**
- Check credentials in `/lib/auth.ts`
- Clear browser cookies

**Changes not showing?**
- Did you click "Save"?
- Refresh the frontend page
- Check browser console for errors

**Images not displaying?**
- Verify path starts with `/images/`
- Check file exists in `/public/images/`
- Use WebP format for best results

---

## 📖 Full Documentation

For detailed information, see:
- [Complete Admin Panel Guide](./ADMIN_PANEL_GUIDE.md)

---

**Need Help?** Check the full guide or contact your developer.
