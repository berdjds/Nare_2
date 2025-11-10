# ⚡ Quick Deployment Guide

**Fast track to deploy Nare website to berdjds.com**

---

## 🚀 Steps (15 minutes)

### 1️⃣ Build & Push Docker Image (5 min)

```bash
# From your local machine
cd "/Users/bds/Documents/Programing/Lab/repeat/Nare_2-6 2"

# Login to GitHub Container Registry (first time only)
echo $GITHUB_TOKEN | docker login ghcr.io -u berdjds --password-stdin

# Build and push
./deploy.sh
# Enter version: v7 (or press Enter for auto-version)
# Confirm: yes
```

**Wait for:**
- ✅ "Docker image built successfully!"
- ✅ "Docker image pushed successfully!"

---

### 2️⃣ Deploy to Production (10 min)

```bash
# SSH into production server
ssh root@213.136.80.87

# Navigate to app directory
cd /root/productionapp

# Backup current database (IMPORTANT!)
docker exec mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} --all-databases > \
  backup_$(date +%Y%m%d_%H%M%S).sql

# Edit docker-compose.yml
nano docker-compose.yml
```

**In nano editor:**
1. Find the `nare_app` section (around line 145)
2. Change: `image: ghcr.io/berdjds/nare:v6`
3. To: `image: ghcr.io/berdjds/nare:v7` (or your version)
4. Also update rate limits:
   - Change: `"traefik.http.middlewares.nare-rate.ratelimit.average=10"`
   - To: `"traefik.http.middlewares.nare-rate.ratelimit.average=100"`
   - Change: `"traefik.http.middlewares.nare-rate.ratelimit.burst=20"`
   - To: `"traefik.http.middlewares.nare-rate.ratelimit.burst=200"`
5. Save: `Ctrl+X`, then `Y`, then `Enter`

```bash
# Pull new image
docker compose pull nare_app

# Restart container
docker compose up -d nare_app

# Watch logs
docker compose logs -f nare_app
```

**Look for:** 
- ✅ "Ready in X ms" or "Server listening"
- ✅ No error messages

---

### 3️⃣ Verify (2 min)

```bash
# Test from server
curl -I https://berdjds.com
# Should show: HTTP/2 200

# Exit SSH
exit
```

**Open in browser:**
https://berdjds.com

**Check:**
- [ ] Homepage loads
- [ ] Services section shows (not translation keys)
- [ ] Tagline badge is solid orange
- [ ] Switch languages (EN/HY/RU/AR)
- [ ] No errors in browser console

---

## ✅ Done!

If everything works:
- ✅ New design is live
- ✅ Translations working
- ✅ Colors fixed
- ✅ Performance improved

---

## 🔄 Rollback (if needed)

```bash
ssh root@213.136.80.87
cd /root/productionapp
nano docker-compose.yml
# Change: image: ghcr.io/berdjds/nare:v7
# Back to: image: ghcr.io/berdjds/nare:v6
# Save and exit
docker compose up -d nare_app
```

---

## 📋 What Changed

- ✨ Services section redesigned from scratch
- 🎨 Removed colorful gradients (cleaner look)
- 🌍 All translations working (15 new keys added)
- 🟠 Corporate colors only (orange, blue, purple)
- ⚡ Better rate limits (10→100 avg, 20→200 burst)
- 📱 Mobile responsive
- ♿ RTL support for Arabic

---

**Need help?** See `PRODUCTION_DEPLOYMENT_GUIDE.md` for detailed instructions.
