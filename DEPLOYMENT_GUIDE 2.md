# 🚀 VPS Deployment Guide

## Issues Found & Solutions

### 1. **Image Upload Failing** ❌
**Problem**: Upload directory doesn't exist on VPS
**Solution**: Create directory with proper permissions

### 2. **DeepSeek API Update Failing** ❌
**Problem**: Settings file/directory doesn't exist
**Solution**: Create data directory with proper permissions

### 3. **Language Flags Not Appearing** ❌
**Problem**: Arabic flag (ar.svg) is missing
**Solution**: Create ar.svg flag file

---

## Pre-Deployment Steps (Run Locally)

### Step 1: Create Missing Arabic Flag
```bash
cat > public/flags/ar.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <path fill="#EE1C25" d="M32 5H4c-.205 0-.407.015-.604.045l-.004 1.955h29.216l-.004-1.955C32.407 5.015 32.205 5 32 5z"/>
  <path fill="#EEE" d="M4 9l-.004 9h28.008l-.004-9z"/>
  <path fill="#141414" d="M32.604 26.955C32.407 26.985 32.205 27 32 27H4c-.205 0-.407-.015-.604-.045l-.004-1.955h29.216z"/>
  <path fill="#007A3D" d="M4.604 5.045C2.131 5.293 0 7.235 0 9.6v16.8c0 2.365 2.131 4.307 4.604 4.555"/>
</svg>
EOF
```

### Step 2: Check Current Data Files
```bash
ls -la data/
```

### Step 3: Commit Changes to Git
```bash
git add .
git status
git commit -m "feat: Add TikTok/TripAdvisor social links, office section editing, navbar improvements, animated numbers"
git push origin main
```

---

## VPS Deployment Steps

### Step 1: SSH into VPS
```bash
ssh your-user@your-vps-ip
cd /path/to/your/app
```

### Step 2: Pull Latest Changes
```bash
git pull origin main
```

### Step 3: Install Dependencies
```bash
npm install
# or
pnpm install
```

### Step 4: Create Required Directories with Permissions
```bash
# Create uploads directory
mkdir -p public/images/uploads
chmod 755 public/images/uploads

# Create data directory
mkdir -p data
chmod 755 data

# Ensure flags directory exists
mkdir -p public/flags
chmod 755 public/flags
```

### Step 5: Initialize Default Data Files
```bash
# Create default settings if not exists
cat > data/settings.json << 'EOF'
{
  "autoTranslate": false,
  "defaultLanguage": "en",
  "enableAITranslation": false
}
EOF

# Set proper permissions
chmod 644 data/settings.json
```

### Step 6: Set Ownership (Important!)
```bash
# Replace 'www-data' with your web server user (nginx/apache)
sudo chown -R www-data:www-data data/
sudo chown -R www-data:www-data public/images/uploads/
sudo chown -R www-data:www-data public/flags/

# Or if using pm2/node user:
# sudo chown -R $USER:$USER data/
# sudo chown -R $USER:$USER public/images/uploads/
```

### Step 7: Build Application
```bash
npm run build
# or
pnpm build
```

### Step 8: Restart Application
```bash
# If using PM2:
pm2 restart nare-travel

# If using systemd:
sudo systemctl restart nare-travel

# If using Docker:
docker-compose down && docker-compose up -d
```

---

## Verification Steps

### 1. Check Upload Works
1. Go to Admin Panel → Articles → Create New
2. Try uploading an image
3. Should see success message

### 2. Check Settings Update
1. Go to Admin Panel → Settings
2. Try updating DeepSeek API key
3. Should save successfully

### 3. Check Flags Appear
1. Go to website header
2. Click language switcher
3. All flags (🇬🇧 🇦🇲 🇷🇺 🇦🇪) should appear

---

## Troubleshooting

### Upload Still Failing?
```bash
# Check directory exists
ls -la public/images/uploads/

# Check permissions
stat -c "%a %U:%G" public/images/uploads/

# Check logs
pm2 logs nare-travel --lines 50
# or
journalctl -u nare-travel -n 50
```

### Settings Not Saving?
```bash
# Check data directory permissions
ls -la data/

# Try manual write test
echo '{"test": true}' > data/test.json

# Check process user
ps aux | grep node
```

### Flags Not Appearing?
```bash
# Check flags directory
ls -la public/flags/

# Verify ar.svg exists
cat public/flags/ar.svg

# Check file permissions
chmod 644 public/flags/*.svg
```

---

## Important Notes

### ⚠️ Data Files in .gitignore
The `data/*.json` files are in `.gitignore` for security reasons. This means:
- **First deployment**: Create data directory and files manually on VPS
- **Updates**: Data files won't be overwritten by git pull
- **Backups**: Backup data directory separately!

### 📁 Directory Structure
```
your-app/
├── data/                    # Created on VPS, not in git
│   ├── settings.json
│   ├── contactInfo.json
│   └── socialLinks.json
├── public/
│   ├── images/
│   │   └── uploads/        # Created on VPS, writable
│   └── flags/              # In git, with ar.svg added
│       ├── en.svg
│       ├── hy.svg
│       ├── ru.svg
│       └── ar.svg          # NEW
```

### 🔒 Permissions Checklist
- [ ] `data/` directory: 755
- [ ] `data/*.json` files: 644
- [ ] `public/images/uploads/`: 755
- [ ] `public/flags/`: 755
- [ ] Owner matches web server user

---

## Quick Fix Script

Save this as `vps-setup.sh` and run on VPS:

```bash
#!/bin/bash

echo "🚀 Setting up VPS directories and permissions..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Create directories
echo "📁 Creating directories..."
mkdir -p data
mkdir -p public/images/uploads
mkdir -p public/flags

# Set permissions
echo "🔒 Setting permissions..."
chmod 755 data
chmod 755 public/images/uploads
chmod 755 public/flags

# Create default settings if not exists
if [ ! -f "data/settings.json" ]; then
    echo "⚙️ Creating default settings..."
    cat > data/settings.json << 'SETTINGS'
{
  "autoTranslate": false,
  "defaultLanguage": "en",
  "enableAITranslation": false
}
SETTINGS
    chmod 644 data/settings.json
fi

# Create Arabic flag if not exists
if [ ! -f "public/flags/ar.svg" ]; then
    echo "🇦🇪 Creating Arabic flag..."
    cat > public/flags/ar.svg << 'FLAG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <path fill="#EE1C25" d="M32 5H4c-.205 0-.407.015-.604.045l-.004 1.955h29.216l-.004-1.955C32.407 5.015 32.205 5 32 5z"/>
  <path fill="#EEE" d="M4 9l-.004 9h28.008l-.004-9z"/>
  <path fill="#141414" d="M32.604 26.955C32.407 26.985 32.205 27 32 27H4c-.205 0-.407-.015-.604-.045l-.004-1.955h29.216z"/>
  <path fill="#007A3D" d="M4.604 5.045C2.131 5.293 0 7.235 0 9.6v16.8c0 2.365 2.131 4.307 4.604 4.555"/>
</svg>
FLAG
    chmod 644 public/flags/ar.svg
fi

# Set ownership (uncomment and modify for your setup)
# WEB_USER="www-data"
# sudo chown -R $WEB_USER:$WEB_USER data/
# sudo chown -R $WEB_USER:$WEB_USER public/images/uploads/

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Run: npm run build"
echo "2. Run: pm2 restart your-app-name"
echo "3. Test uploads in admin panel"
echo ""
