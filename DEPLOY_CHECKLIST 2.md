# 📋 VPS Deployment Checklist

## Local Machine (Before Push)

### ✅ 1. Verify Changes
```bash
git status
git diff
```

### ✅ 2. Add All Files
```bash
git add .
git status  # verify ar.svg is included
```

### ✅ 3. Commit Changes
```bash
git commit -m "feat: Add social platforms (TikTok/TripAdvisor), office section editing, navbar improvements, animated stats, fix flags"
```

### ✅ 4. Push to Repository
```bash
git push origin main
```

---

## VPS Server

### ✅ 1. SSH to Server
```bash
ssh your-user@your-vps-ip
cd /path/to/nare-travel-app
```

### ✅ 2. Pull Latest Code
```bash
git pull origin main
```

### ✅ 3. Run Setup Script
```bash
chmod +x vps-setup.sh
./vps-setup.sh
```

### ✅ 4. Set Ownership (Choose one)
```bash
# Option A: For Nginx/Apache
sudo chown -R www-data:www-data data/ public/images/uploads/

# Option B: For PM2/Node
sudo chown -R $USER:$USER data/ public/images/uploads/
```

### ✅ 5. Install Dependencies
```bash
npm install
# or
pnpm install
```

### ✅ 6. Build Application
```bash
npm run build
# or
pnpm build
```

### ✅ 7. Restart Application
```bash
# PM2
pm2 restart nare-travel

# Or systemd
sudo systemctl restart nare-travel

# Or Docker
docker-compose restart
```

---

## Testing (After Deployment)

### ✅ 1. Test Image Upload
- [ ] Go to Admin Panel
- [ ] Create new Article/Hero Slide
- [ ] Upload an image
- [ ] Verify success message

### ✅ 2. Test Settings Update
- [ ] Go to Settings page
- [ ] Update DeepSeek API key
- [ ] Click Save
- [ ] Verify no errors

### ✅ 3. Test Language Flags
- [ ] Go to website
- [ ] Click language switcher
- [ ] Verify all 4 flags appear (🇬🇧 🇦🇲 🇷🇺 🇦🇪)

### ✅ 4. Test New Features
- [ ] Check TikTok icon in footer
- [ ] Check TripAdvisor icon in footer
- [ ] Edit office section in Contact Info admin
- [ ] View changes on Contact page
- [ ] Check navbar active page highlighting
- [ ] Verify B2B numbers animate on scroll

---

## Common Issues & Fixes

### Problem: Upload Still Fails
```bash
# Check directory exists and has correct permissions
ls -la public/images/uploads/
# Should show: drwxr-xr-x www-data www-data

# If wrong, fix:
sudo chown -R www-data:www-data public/images/uploads/
chmod 755 public/images/uploads/
```

### Problem: Settings Won't Save
```bash
# Check data directory
ls -la data/
# Should show: drwxr-xr-x with your web user

# Test write permission
touch data/test.txt
# If fails, fix permissions:
sudo chown -R www-data:www-data data/
```

### Problem: Flags Don't Show
```bash
# Verify files exist
ls public/flags/
# Should show: ar.svg en.svg hy.svg ru.svg

# Check browser console for 404 errors
# Rebuild if needed:
npm run build
pm2 restart nare-travel
```

### Problem: Changes Don't Appear
```bash
# Clear Next.js cache
rm -rf .next
npm run build
pm2 restart nare-travel

# Check if process is actually running
pm2 status
```

---

## Rollback Plan

If deployment fails:
```bash
# 1. Check current commit
git log --oneline -5

# 2. Rollback to previous commit
git reset --hard HEAD~1

# 3. Rebuild
npm run build
pm2 restart nare-travel

# 4. Re-pull when ready
git pull origin main
```

---

## Support Commands

```bash
# View logs
pm2 logs nare-travel --lines 100

# Check disk space
df -h

# Check memory
free -h

# Check process
ps aux | grep node

# Check ports
netstat -tulpn | grep :3000
```
