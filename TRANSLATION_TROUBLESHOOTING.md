# 🔧 Translation Troubleshooting Guide

## ❌ Issue: "All translations failed"

If you see: **"✅ Successful: 0, ❌ Failed: 76"** - here's how to fix it!

---

## ✅ Solution: Configure DeepSeek API Key

### **Step 1: Get DeepSeek API Key** (5 minutes)

1. **Visit:** https://platform.deepseek.com
2. **Sign up** for free account
3. **Go to:** API Keys section
4. **Click:** "Create API Key"
5. **Copy** the key (starts with `sk-`)

### **Step 2: Add to Admin Panel** (1 minute)

1. **Login** to admin: `http://localhost:3000/admin/login`
2. **Click:** "Settings" tab (⚙️ icon)
3. **Paste** your DeepSeek API key
4. **Enable:** "AI Translation Enabled" toggle
5. **Click:** "Save Settings"
6. ✅ **Done!**

### **Step 3: Try Translation Again**

1. **Go back** to "Translations" tab
2. **Click:** "AI Translate Missing (76)"
3. **Wait** for completion
4. ✅ **Should work now!**

---

## 🎯 Quick Checklist

Before using AI translation, make sure:
- [ ] DeepSeek API key is configured in Settings
- [ ] "AI Translation Enabled" is turned ON
- [ ] Settings are saved
- [ ] API key starts with "sk-" (correct format)

---

## 🔍 Common Issues

### **Issue: Still failing after adding API key**

**Possible causes:**
1. **Invalid API key** - Double-check you copied it correctly
2. **API key not active** - May need to verify email on DeepSeek
3. **No credits** - Free tier has limits, check your account
4. **Network issue** - Check internet connection

**Fix:**
```
1. Go to https://platform.deepseek.com
2. Check API key status
3. Verify it's active
4. Check credit balance
5. Try generating a new key if needed
```

---

### **Issue: Some translations work, some fail**

**This is normal!**
- Network hiccups
- Rate limiting
- Just retry the failed ones

**Fix:**
```
1. Click "AI Translate Missing" again
2. It will only translate the ones that failed
3. Keep clicking until all complete
```

---

### **Issue: "Failed to save translations"**

**Cause:** Server can't save the file

**Fix:**
```
1. Check file permissions
2. Make sure data/ folder exists
3. Restart dev server: npm run dev
```

---

## 💡 Best Practice

### **First Time Setup:**
```
1. Configure API key in Settings ✓
2. Test with single translation first
   - Go to Translations
   - Edit any entry
   - Click "AI Translate" for one field
   - If it works, API is configured correctly!
3. Then use bulk translate for everything
```

### **Cost Management:**
```
DeepSeek is very cheap, but if you want to be careful:
- Test with 10 translations first
- Check your DeepSeek usage dashboard
- Then do bulk translate
```

---

## ✅ Expected Behavior

### **When Working Correctly:**

**Confirmation Dialog:**
```
Found 76 missing translations.

This will use AI to translate all missing text.

⚠️ Make sure you have configured your DeepSeek API key in Settings first!

Continue?
```

**During Translation:**
```
[⚡ Translating 1/76...]
[⚡ Translating 23/76...]
[⚡ Translating 76/76...]
```

**Success:**
```
Bulk translation complete!

✅ Successful: 76
❌ Failed: 0
```

---

## 🎯 Quick Fix Summary

**Your issue:**
- All 76 translations failed
- Error: "Translation failed"

**Root cause:**
- DeepSeek API key not configured

**Solution:**
1. Get API key from DeepSeek
2. Add to Settings tab
3. Enable AI translation
4. Save
5. Try again

**Should take:** 5-6 minutes total

---

## 📞 If Still Not Working

1. **Check browser console** (F12) for errors
2. **Check Settings tab** - is API key saved?
3. **Try single translation** first (Edit → AI Translate)
4. **Restart dev server**: 
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

---

## 🎉 After It Works

Once configured correctly:
- ✅ Bulk translate: Works perfectly
- ✅ Individual translate: Works perfectly
- ✅ Future translations: Automatic
- ✅ Cost: Pennies for entire website

**Your translations will complete in ~20 minutes!** 🚀

---

**Status:** Configuration Required  
**Priority:** High (blocks translation feature)  
**Time to Fix:** 5-6 minutes  
**Difficulty:** Easy
