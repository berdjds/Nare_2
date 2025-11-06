# 🔄 Admin Panel Translation Refresh Guide

## ✅ Keys Are in the Database!

The translation keys ARE in `data/translations.json` - they just need the admin panel to refresh.

---

## 🔧 **Solutions to Try:**

### **Solution 1: Hard Refresh Browser** (Try This First)
```
1. Go to /admin/translations
2. Press: Cmd + Shift + R (Mac)
   OR: Ctrl + Shift + F5 (Windows)
3. This clears the cache and reloads
```

### **Solution 2: Clear Browser Cache**
```
1. In Chrome: Dev Tools (F12)
2. Right-click the refresh button
3. Click "Empty Cache and Hard Reload"
```

### **Solution 3: Restart Dev Server**
```bash
# Stop the server (Ctrl + C)
# Then restart:
npm run dev
```

### **Solution 4: Force API Reload**
```
1. Go to: http://localhost:3000/api/content/translations
2. You should see ALL keys including new DMC ones
3. Then go back to /admin/translations
```

---

## 🔍 **How to Find the Keys:**

Once refreshed, in `/admin/translations`:

### **Search Method 1: By Section**
1. Filter: Select "home" section
2. Scroll through the list
3. Look for keys starting with:
   - `home.trustBadges.*`
   - `home.urgencyBanner.*`
   - `home.whatsapp.*`
   - `home.dmc.*`

### **Search Method 2: By Keyword**
Use the search box and search for:
- `"B2B"` → Will find "Direct B2B Contact"
- `"Partner"` → Will find "Partner With Us"
- `"DMC"` → Will find all DMC-related keys
- `"MICE"` → Will find "MICE Services"
- `"WhatsApp"` → Will find WhatsApp keys
- `"Limited Time"` → Will find urgency banner

### **Search Method 3: By Key Name**
Search for the exact key:
- `home.dmc.cta.directContact`
- `home.dmc.cta.title`
- `home.trustBadges.rating`

---

## 📋 **All New Keys in Database:**

These keys ARE in `data/translations.json` (verified):

```
home.trustBadges.rating
home.trustBadges.ratingSubtext
home.trustBadges.travelers
home.trustBadges.travelersSubtext
home.trustBadges.licensed
home.trustBadges.licensedSubtext
home.trustBadges.experience
home.trustBadges.experienceSubtext
home.trustBadges.support
home.trustBadges.supportSubtext
home.trustBadges.cancellation
home.trustBadges.cancellationSubtext

home.urgencyBanner.title
home.urgencyBanner.message

home.whatsapp.tooltip
home.whatsapp.message

home.dmc.badge
home.dmc.title
home.dmc.subtitle
home.dmc.stats.partners
home.dmc.stats.guests
home.dmc.stats.satisfaction
home.dmc.stats.support
home.dmc.services.mice.title
home.dmc.services.mice.description
home.dmc.services.dmcService.title
home.dmc.services.dmcService.description
home.dmc.services.groups.title
home.dmc.services.groups.description
home.dmc.services.corporate.title
home.dmc.services.corporate.description
home.dmc.services.quality.title
home.dmc.services.quality.description
home.dmc.services.support.title
home.dmc.services.support.description
home.dmc.cta.title
home.dmc.cta.subtitle
home.dmc.cta.viewServices
home.dmc.cta.requestQuote
home.dmc.cta.directContact  ← THIS ONE!
```

---

## 🎯 **Quick Test:**

### **Verify Keys Exist:**
Run this in your terminal:
```bash
grep "directContact" data/translations.json
```

You should see:
```json
"key": "home.dmc.cta.directContact",
"en": "Direct B2B Contact",
"hy": "Ուղղակի B2B Կապ",
"ru": "Прямой B2B Контакт",
"ar": "اتصال B2B مباشر"
```

---

## 💡 **If Still Not Showing:**

### **Check Admin Panel API:**
1. Open: `http://localhost:3000/api/content/translations`
2. Search for: "directContact"
3. If you see it here but not in admin UI → Clear browser cache
4. If you don't see it here → Restart dev server

---

## 🔧 **Nuclear Option (If Nothing Works):**

```bash
# 1. Stop server
Ctrl + C

# 2. Clear Next.js cache
rm -rf .next

# 3. Restart
npm run dev

# 4. Hard refresh browser
Cmd + Shift + R
```

---

## ✅ **Expected Result:**

After refresh, you should be able to:
1. Go to `/admin/translations`
2. Filter by "home" section
3. Search for "B2B" or "DMC"
4. See ALL 40 new keys
5. Edit "Direct B2B Contact" and all others
6. Save changes

---

**Status:** Keys are in database, just need UI refresh! 🔄
