# 🔄 Arabic Translation Script

## One-Time Script to Translate All UI Translations to Arabic

This script will automatically translate all missing Arabic translations in your UI translations file using AI.

---

## 📋 What It Does

1. **Reads** `data/translations.json`
2. **Finds** all entries with English text but no Arabic translation
3. **Uses** DeepSeek AI to translate each entry to Arabic
4. **Saves** translations back to the file
5. **Shows** progress and summary

---

## 🚀 How to Run

### **Step 1: Make sure your API key is configured**
```bash
# API key should already be in: data/settings.json
# If not, add it via Admin → Settings
```

### **Step 2: Run the script**
```bash
node scripts/translate-arabic.js
```

### **Step 3: Confirm when prompted**
```
⚠️  This will translate X entries to Arabic.
This may take several minutes and use API credits.

Continue? (yes/no): yes
```

### **Step 4: Wait for completion**
```
🔄 Starting translations...

[1/150] Translating: nav.home... ✅
[2/150] Translating: nav.services... ✅
[3/150] Translating: nav.about... ✅
...
💾 Progress saved (10/150)
...
```

### **Step 5: Check results**
```
═══════════════════════════════════════
📊 Translation Summary:
═══════════════════════════════════════
✅ Successful: 148
❌ Failed: 2
📝 Total: 150
═══════════════════════════════════════

🎉 Arabic translations have been added!
```

---

## ⏱️ Estimated Time

| Entries | Time |
|---------|------|
| 50 entries | ~1-2 minutes |
| 100 entries | ~2-3 minutes |
| 200 entries | ~4-5 minutes |
| 340 entries | ~6-8 minutes |

**Note:** Includes 100ms delay between translations to avoid rate limiting

---

## 💡 Features

### **Smart Translation:**
- ✅ Only translates missing Arabic entries
- ✅ Skips entries that already have Arabic
- ✅ Uses context (section name + key) for better accuracy
- ✅ Travel/tourism specialized translations

### **Safe Execution:**
- ✅ Asks for confirmation before starting
- ✅ Saves progress every 10 translations
- ✅ Handles errors gracefully
- ✅ Can be re-run safely (won't duplicate)

### **Progress Tracking:**
- ✅ Shows progress: [X/Total]
- ✅ Shows success/fail for each entry
- ✅ Saves periodically
- ✅ Final summary at end

---

## 📊 Example Output

```bash
$ node scripts/translate-arabic.js

🚀 Starting Arabic translation script...

✅ API key loaded

✅ Loaded translations file (13 sections)

📊 Found 150 entries missing Arabic translation

⚠️  This will translate 150 entries to Arabic.
This may take several minutes and use API credits.

Continue? (yes/no): yes

🔄 Starting translations...

[1/150] Translating: nav.home... ✅
[2/150] Translating: nav.services... ✅
[3/150] Translating: nav.armeniaTours... ✅
[4/150] Translating: nav.dailyTours... ✅
[5/150] Translating: nav.culturalTours... ✅
[6/150] Translating: nav.adventureTours... ✅
[7/150] Translating: nav.b2b... ✅
[8/150] Translating: nav.about... ✅
[9/150] Translating: nav.contact... ✅
[10/150] Translating: cta.bookNow... ✅
💾 Progress saved (10/150)

[11/150] Translating: cta.learnMore... ✅
[12/150] Translating: cta.contact... ✅
...
[148/150] Translating: common.filter... ✅
[149/150] Translating: common.more... ✅
[150/150] Translating: common.less... ✅

💾 Final translations saved!

═══════════════════════════════════════
📊 Translation Summary:
═══════════════════════════════════════
✅ Successful: 148
❌ Failed: 2
📝 Total: 150
═══════════════════════════════════════

🎉 Arabic translations have been added to data/translations.json
🔄 Restart your dev server to see the changes
```

---

## 🔧 Troubleshooting

### **Error: "No API key found"**
```bash
# Solution: Configure API key in admin panel
1. Go to Admin Dashboard
2. Click Settings tab
3. Add DeepSeek API key
4. Save
5. Run script again
```

### **Error: "API Error: 401"**
```bash
# Solution: API key is invalid
1. Check your DeepSeek API key
2. Get a new key from https://platform.deepseek.com/
3. Update in Admin → Settings
4. Run script again
```

### **Some translations failed**
```bash
# Solution: Run script again
# The script will only translate missing entries
# Failed entries will be retried
node scripts/translate-arabic.js
```

### **Script interrupted**
```bash
# No problem! Progress is saved every 10 entries
# Just run the script again
# It will continue from where it left off
node scripts/translate-arabic.js
```

---

## 💾 File Location

**Script:** `scripts/translate-arabic.js`  
**Translations:** `data/translations.json`  
**Settings:** `data/settings.json`

---

## 🎯 What Gets Translated

The script translates all UI text including:

### **Navigation:**
- Home, Services, Tours, About, Contact
- All menu items

### **Buttons:**
- Book Now, Learn More, Contact Us
- View Details, Submit, Cancel

### **Forms:**
- Input labels, placeholders, validation messages
- Success/error messages

### **Footer:**
- Contact info labels
- Social media labels
- Quick links

### **Common UI:**
- Loading, Error, Success messages
- Save, Cancel, Edit, Delete buttons
- Search, Filter, More, Less

### **All Sections:**
```
- navigation
- cta (Call to Action)
- booking
- footer
- common
- services
- tours
- about
- contact
- hero
- features
- testimonials
- faq
```

---

## 📈 After Running

### **Verify Translations:**
```bash
# Check how many have Arabic
grep -c '"ar":' data/translations.json

# Should show: 340 (or total number of entries)
```

### **Test in Admin:**
```bash
# 1. Start dev server
npm run dev

# 2. Go to Admin → Translations
# 3. Check Arabic (AR): should be 100%
# 4. Check individual entries - should show Arabic text
```

### **Test on Frontend:**
```bash
# 1. Open website
# 2. Click language selector
# 3. Choose العربية 🇦🇪
# 4. All UI should be in Arabic
```

---

## 🔄 Re-running the Script

**Safe to run multiple times!**

The script:
- ✅ Only translates missing entries
- ✅ Skips entries that already have Arabic
- ✅ Won't duplicate or overwrite existing translations
- ✅ Can be used to retry failed translations

---

## 💰 API Cost Estimate

**DeepSeek Pricing:** ~$0.14 per million tokens

| Entries | Approx. Tokens | Cost |
|---------|----------------|------|
| 50 | ~10,000 | $0.0014 |
| 100 | ~20,000 | $0.0028 |
| 200 | ~40,000 | $0.0056 |
| 340 | ~68,000 | $0.0095 |

**Very affordable!** Complete UI translation costs less than $0.01

---

## ✨ Result

After running this script:

- ✅ All UI translations have Arabic
- ✅ Arabic (AR): 100% complete
- ✅ Ready to use in production
- ✅ Users can switch to Arabic language
- ✅ Full Arabic UI experience

---

## 🎉 Success!

Your UI translations are now complete in all 4 languages:
- 🇬🇧 English
- 🇦🇲 Armenian
- 🇷🇺 Russian
- 🇦🇪 **Arabic** ← Translated by this script!

**Ready for production!** 🚀
