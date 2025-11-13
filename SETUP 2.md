# 🚀 Nare Travel - Setup Instructions

## 📋 **Prerequisites:**
- Node.js 18+ installed
- Git installed
- GitHub account

---

## 🛠️ **First Time Setup:**

### **Step 1: Clone Repository**
```bash
git clone https://github.com/berdjds/Nare_2.git
cd Nare_2
git checkout 1-AI
```

### **Step 2: Install Dependencies**
```bash
npm install
```

**Note:** This automatically creates data files with defaults!

### **Step 3: Configure Admin Access**

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Change these in production!**

Edit `lib/auth.ts` to change default credentials.

### **Step 4: Configure DeepSeek API (Optional)**

If you want AI translation features:

1. Get API key from: https://platform.deepseek.com/
2. Start the dev server (see below)
3. Login to admin panel: `http://localhost:3000/admin`
4. Go to Settings tab
5. Enter your DeepSeek API key
6. Save

**Note:** API key is stored in `data/settings.json` (not in git for security)

### **Step 5: Run Development Server**
```bash
npm run dev
```

Open: http://localhost:3000

---

## 🔧 **Configuration Files:**

### **Not in Git (Must Configure on Each Device):**
- `data/settings.json` - Admin settings including API keys
- `data/translations.json` - Will be created automatically
- `data/banner.json` - Will be created automatically

### **In Git (Shared):**
- All code files
- Images
- Default configurations

---

## 🌐 **Multi-Language Support:**

### **Flag Icons Issue:**
If flag emojis don't show on your device:

**Option 1: Use Unicode Flags (Default)**
- Works on most modern devices
- May show as letter codes on older systems

**Option 2: Install Emoji Font**
- Install "Noto Color Emoji" font
- Or "Apple Color Emoji" on Mac

**Option 3: Browser Extension**
- Install emoji support extension for your browser

---

## 🔐 **Security Notes:**

### **Important:**
1. ✅ `data/settings.json` is in `.gitignore` (API keys not pushed)
2. ✅ Change default admin password in production
3. ✅ Each device needs its own API key configuration
4. ✅ Don't commit sensitive data to git

### **For Production:**
- Use environment variables for API keys
- Use proper authentication (NextAuth.js)
- Enable HTTPS
- Set secure session cookies

---

## 📦 **Data Files Structure:**

```
data/
├── .gitkeep              # Keeps folder in git
├── settings.json         # Admin settings (not in git)
├── translations.json     # UI translations (auto-created)
├── banner.json          # Banner config (auto-created)
└── *.json               # Other content files
```

---

## 🎛️ **Admin Panel Access:**

### **URL:**
```
http://localhost:3000/admin
```

### **Default Login:**
- Username: `admin`
- Password: `admin123`

### **Features:**
- Manage translations
- Configure banner
- Edit content
- Set API keys
- Manage users

---

## 🚨 **Common Issues:**

### **Issue 1: "Unauthorized" when saving API key**
**Cause:** Not logged in or session expired  
**Fix:** 
1. Logout and login again
2. Check if cookies are enabled
3. Clear browser cache

### **Issue 2: Flag emojis show as "EN", "HY", etc.**
**Cause:** Device doesn't support emoji flags  
**Fix:**
1. Update your OS/browser
2. Install emoji font pack
3. Use Chrome/Firefox (better emoji support)

### **Issue 3: Translations not showing**
**Cause:** Server needs restart  
**Fix:**
```bash
# Stop server: Ctrl + C
# Clear cache
rm -rf .next
# Restart
npm run dev
```

### **Issue 4: API key not saved after server restart**
**Cause:** `data/settings.json` deleted or not created  
**Fix:**
1. Go to `/admin/settings`
2. Re-enter API key
3. Check `data/` folder permissions

---

## 🔄 **Updating from Git:**

```bash
# Pull latest changes
git pull origin 1-AI

# Install new dependencies (if any)
npm install

# Clear cache
rm -rf .next

# Restart server
npm run dev
```

**Note:** Your `data/settings.json` will not be overwritten (it's in .gitignore)

---

## 🌍 **Language Flags:**

Current language flags:
- 🇬🇧 English (EN)
- 🇦🇲 Armenian (HY) - Հայերեն
- 🇷🇺 Russian (RU) - Русский  
- 🇦🇪 Arabic (AR) - العربية

If these show as letters on your device, your system doesn't support emoji flags.

---

## 📝 **First Login Checklist:**

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Create data folder
- [ ] Start dev server (`npm run dev`)
- [ ] Login to admin (`/admin`)
- [ ] Configure DeepSeek API (if needed)
- [ ] Test translation switching
- [ ] Verify flags display correctly

---

## 💡 **Tips:**

1. **Development:** Use `npm run dev` for hot reload
2. **Production:** Use `npm run build` then `npm start`
3. **API Keys:** Set on each device, don't share in git
4. **Backup:** Regularly backup your `data/` folder
5. **Updates:** Pull from git regularly for new features

---

## 🆘 **Need Help?**

If you encounter issues:
1. Check this SETUP.md file
2. Check browser console for errors (F12)
3. Check server console for errors
4. Restart dev server with cache clear

---

**Status:** ✅ Setup guide complete!

*Last updated: November 6, 2025*
