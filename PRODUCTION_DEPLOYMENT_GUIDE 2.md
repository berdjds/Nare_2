# 🚀 Production Deployment Guide - Nare Travel Website

Complete guide for deploying the updated Nare website to production server at **berdjds.com**

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Build & Push Docker Image](#build--push-docker-image)
3. [Database Backup](#database-backup)
4. [Deploy to Production](#deploy-to-production)
5. [Data Migration](#data-migration)
6. [Verification](#verification)
7. [Rollback Procedure](#rollback-procedure)

---

## 🔍 Pre-Deployment Checklist

### ✅ Local Environment

- [ ] All changes committed to git
- [ ] Dev server tested locally
- [ ] Translations working in all 4 languages
- [ ] All images optimized and uploaded
- [ ] No console errors in browser
- [ ] Mobile responsiveness checked

### ✅ Production Server Access

```bash
# Server Details
IP: 213.136.80.87
User: root
Domain: berdjds.com
Container: nare_app
Current Image: ghcr.io/berdjds/nare:v6
```

---

## 🏗️ Build & Push Docker Image

### Step 1: Prepare Deployment Script

```bash
# Make deploy script executable
cd "/Users/bds/Documents/Programing/Lab/repeat/Nare_2-6 2"
chmod +x deploy.sh
```

### Step 2: Login to GitHub Container Registry

```bash
# Login with your GitHub token
echo $GITHUB_TOKEN | docker login ghcr.io -u berdjds --password-stdin
```

> 💡 **Note:** If you don't have `GITHUB_TOKEN` set, create a Personal Access Token with `write:packages` permission from GitHub Settings → Developer settings → Personal access tokens

### Step 3: Build and Push

```bash
# Run deployment script
./deploy.sh

# When prompted, enter version number (e.g., v7, v8, or press Enter for auto-version)
# Confirm with 'yes'
```

**What the script does:**
1. ✅ Builds optimized production Docker image
2. ✅ Tags with version number and 'latest'
3. ✅ Pushes to GitHub Container Registry
4. ✅ Displays next steps

---

## 💾 Database Backup

### Step 1: SSH into Production Server

```bash
ssh root@213.136.80.87
cd /root/productionapp
```

### Step 2: Backup Current Database

```bash
# Create backup directory
mkdir -p backups/$(date +%Y%m%d)

# Backup MySQL database
docker exec mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} --all-databases > \
  backups/$(date +%Y%m%d)/nare_backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup was created
ls -lh backups/$(date +%Y%m%d)/
```

### Step 3: Backup Uploaded Images

```bash
# Backup current container's data volumes
docker cp nare-app:/app/public/images ./backups/$(date +%Y%m%d)/images_backup

# Or backup entire public folder
docker cp nare-app:/app/public ./backups/$(date +%Y%m%d)/public_backup
```

---

## 🚀 Deploy to Production

### Step 1: Update docker-compose.yml

```bash
# On production server
cd /root/productionapp

# Edit docker-compose.yml
nano docker-compose.yml
```

**Update the nare_app service:**

```yaml
  nare_app:
    image: ghcr.io/berdjds/nare:v7  # ⬅️ Change this to new version
    container_name: nare-app
    restart: always
    networks:
      - web
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.nare.rule=Host(`berdjds.com`)"
      - "traefik.http.routers.nare.entrypoints=web"
      - "traefik.http.routers.nare.middlewares=redirect-to-https"
      - "traefik.http.routers.nare-secure.rule=Host(`berdjds.com`)"
      - "traefik.http.routers.nare-secure.entrypoints=websecure"
      - "traefik.http.routers.nare-secure.tls.certresolver=le"
      - "traefik.http.middlewares.nare-rate.ratelimit.average=100"  # ⬅️ Increased from 10
      - "traefik.http.middlewares.nare-rate.ratelimit.burst=200"   # ⬅️ Increased from 20
    expose:
      - "3000"
    # Optional: Add volume for persistent data
    volumes:
      - nare_data:/app/data
      - nare_uploads:/app/public/uploads
```

> 💡 **Note:** I've increased rate limits from 10/20 to 100/200 for better performance

### Step 2: Add Volumes (if not exists)

Add to the bottom of docker-compose.yml:

```yaml
volumes:
  mysql_data:
  wordpress_site1_data:
  wordpress_site2_data:
  nare_data:        # ⬅️ Add this
  nare_uploads:     # ⬅️ Add this

networks:
  web:
    external: true
```

### Step 3: Pull New Image

```bash
# Pull the new Docker image
docker compose pull nare_app
```

### Step 4: Stop Old Container

```bash
# Stop the old container
docker compose stop nare_app

# Optional: Remove old container
docker compose rm -f nare_app
```

### Step 5: Start New Container

```bash
# Start the new container
docker compose up -d nare_app

# Check if it's running
docker ps | grep nare
```

### Step 6: Monitor Logs

```bash
# Watch logs in real-time
docker compose logs -f nare_app

# Press Ctrl+C to exit log view
```

**Look for:**
- ✅ "Ready in X ms" or "Server listening on port 3000"
- ✅ No error messages
- ✅ Container stays running (doesn't restart repeatedly)

---

## 📤 Data Migration

### Option A: Fresh Start (Recommended for Major Updates)

```bash
# The app will initialize with default data from:
# - scripts/init-data.js (runs automatically)
# - Default translations from lib/translations.ts
# - Default images from public/ folder
```

**Then:**
1. Login to admin panel: `https://berdjds.com/admin`
2. Re-upload tour packages
3. Re-upload custom images
4. Configure settings

### Option B: Migrate Existing Data

If you have JSON data files from old version:

```bash
# Copy data files from backup to new container
docker cp ./backups/YYYYMMDD/data/tours.json nare-app:/app/data/tours.json
docker cp ./backups/YYYYMMDD/data/packages.json nare-app:/app/data/packages.json
docker cp ./backups/YYYYMMDD/data/images.json nare-app:/app/data/images.json

# Copy uploaded images
docker cp ./backups/YYYYMMDD/public/uploads nare-app:/app/public/

# Restart container to load new data
docker compose restart nare_app
```

### Option C: Database Migration (If Using MySQL)

```bash
# If old version used MySQL and new version also uses it:

# Import old database
docker exec -i mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} nare_db < \
  ./backups/YYYYMMDD/nare_backup.sql
```

---

## ✅ Verification

### Step 1: Check Container Health

```bash
# Check if container is running
docker ps | grep nare

# Check resource usage
docker stats nare-app --no-stream

# Check logs for errors
docker compose logs nare_app | grep -i error
```

### Step 2: Test Website

```bash
# Test from server
curl -I https://berdjds.com

# Should return: HTTP/2 200
```

### Step 3: Browser Testing

Visit: **https://berdjds.com**

**Check:**
- [ ] Homepage loads correctly
- [ ] Services section shows properly
- [ ] No translation keys showing (should show actual text)
- [ ] Tagline badge is solid orange (not gradient)
- [ ] All images load
- [ ] Language switching works (EN, HY, RU, AR)
- [ ] Mobile responsive
- [ ] All pages accessible
- [ ] Contact form works
- [ ] Admin panel accessible

### Step 4: Performance Check

```bash
# Check response time
time curl -s https://berdjds.com > /dev/null

# Should be < 2 seconds
```

### Step 5: SSL Certificate

```bash
# Verify SSL certificate
curl -vI https://berdjds.com 2>&1 | grep -i ssl

# Should show valid Let's Encrypt certificate
```

---

## 🔄 Rollback Procedure

If something goes wrong:

### Quick Rollback

```bash
# SSH into server
ssh root@213.136.80.87
cd /root/productionapp

# Edit docker-compose.yml
nano docker-compose.yml

# Change image back to: ghcr.io/berdjds/nare:v6
# Save and exit (Ctrl+X, Y, Enter)

# Pull old image (if needed)
docker pull ghcr.io/berdjds/nare:v6

# Restart with old version
docker compose up -d nare_app

# Verify
docker compose logs -f nare_app
```

### Restore Database

```bash
# If database was affected
docker exec -i mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} nare_db < \
  ./backups/YYYYMMDD/nare_backup_YYYYMMDD_HHMMSS.sql
```

### Restore Images

```bash
# Restore uploaded images
docker cp ./backups/YYYYMMDD/public_backup nare-app:/app/public

# Restart
docker compose restart nare_app
```

---

## 📝 Post-Deployment Checklist

- [ ] Website loads successfully
- [ ] All translations working
- [ ] Services section displays correctly
- [ ] Colors are correct (no green, solid orange badge)
- [ ] Images load properly
- [ ] Language switching works
- [ ] Mobile responsive
- [ ] Admin panel accessible
- [ ] SSL certificate valid
- [ ] No errors in browser console
- [ ] No errors in server logs
- [ ] Performance acceptable (< 2s load time)

---

## 🆘 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs nare_app

# Check if port 3000 is free
netstat -tulpn | grep 3000

# Check if image was pulled
docker images | grep nare
```

### Website Shows 502/504 Error

```bash
# Check if container is running
docker ps | grep nare

# Check Traefik logs
docker compose logs traefik | grep nare

# Restart container
docker compose restart nare_app
```

### Images Not Loading

```bash
# Check if images exist
docker exec nare-app ls -la /app/public/images

# Check permissions
docker exec nare-app ls -la /app/public

# Copy images if needed
docker cp ./public/images nare-app:/app/public/
```

### Translation Keys Showing

```bash
# Check if translations.json exists
docker exec nare-app cat /app/data/translations.json

# Restart container to reload
docker compose restart nare_app

# Hard refresh browser: Ctrl+Shift+R
```

---

## 📞 Support

**If you encounter issues:**

1. Check logs: `docker compose logs -f nare_app`
2. Check container status: `docker ps | grep nare`
3. Test locally first
4. Rollback if critical issues
5. Contact system administrator

---

## ✅ Summary

This deployment includes:

- ✅ Complete Services section redesign
- ✅ Fixed translations (all 4 languages)
- ✅ Removed colorful gradients (cleaner design)
- ✅ Corporate colors only (orange, blue, purple)
- ✅ Improved rate limits for better performance
- ✅ Modern card-based layout
- ✅ RTL support for Arabic
- ✅ Responsive design
- ✅ Optimized Docker image
- ✅ Production-ready configuration

**Deployment Time Estimate:** 15-30 minutes

---

**Last Updated:** November 10, 2025  
**Version:** v7  
**Author:** Cascade AI
