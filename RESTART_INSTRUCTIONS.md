# 🔄 Frontend Not Showing Translations - Fix Instructions

## ⚠️ **Problem:**
- Admin panel shows updated translations ✅
- Frontend still shows English ❌
- Language switch doesn't work

## 🎯 **Solution:**

### **STEP 1: Stop Dev Server**
```bash
# In your terminal where server is running:
# Press Ctrl + C
```

### **STEP 2: Clear Next.js Cache**
```bash
rm -rf .next
```

### **STEP 3: Restart Dev Server**
```bash
npm run dev
```

### **STEP 4: Hard Refresh Browser**
```
Press: Cmd + Shift + R (Mac)
Or: Ctrl + Shift + F5 (Windows)
```

### **STEP 5: Test**
1. Go to homepage
2. Click Armenian flag (Հայերեն)
3. Check "Why Choose Nare Travel" section
4. Should now show Armenian text!

---

## 🔍 **Why This Happens:**

The translation system was updated to load from API:
- **Old:** Hardcoded in `lib/translations.ts`
- **New:** Dynamic from `/api/translations` endpoint

The code changes require:
1. ✅ Server restart (to compile new code)
2. ✅ Browser cache clear (to load new JavaScript)

---

## ✅ **After Restart, You Should See:**

### **Armenian (Հայերեն):**
- "Ինչու Ընտրել Նարե Թրավել" (Why Choose Nare Travel)
- "Փորձագետ Տեղական Ուղեկցորդներ" (Expert Local Guides)
- "Անհատական Երթուղիներ" (Custom Itineraries)
- "Անխնա Ծառայություն" (Hassle-Free Service)

### **Russian (Русский):**
- "Почему Выбрать Nare Travel"
- "Эксперт Местные Гиды"
- etc.

---

## 🧪 **Verify API is Working:**

Test the API endpoint:
```bash
curl http://localhost:3000/api/translations | grep -i "expert"
```

Should show: "Expert Local Guides"

---

## 📝 **Checklist:**

- [ ] Stop dev server (Ctrl + C)
- [ ] Clear cache (`rm -rf .next`)
- [ ] Restart (`npm run dev`)
- [ ] Hard refresh browser (Cmd + Shift + R)
- [ ] Switch to Armenian language
- [ ] Check if text changes

---

**Status:** Restart required to apply translation system changes!
