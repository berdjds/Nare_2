# 📦 Manual Deployment Guide - Step by Step

## What We Have:
- ✅ Docker image built locally: `naresima:latest` (191MB)
- ✅ Image saved as: `naresima-latest.tar.gz`
- ✅ Platform: linux/amd64 (correct for VPS)

## VPS Credentials:
- **IP**: 213.136.80.87
- **User**: root
- **Password**: dC7Be3(2u2j)

---

## Step 1: Upload Image to VPS

```bash
# From your Mac terminal in this directory:
cd "/Users/bds/Documents/Programing/Lab/repeat/Nare_2-6 2"

# Upload the image (takes ~1 minute)
scp naresima-latest.tar.gz root@213.136.80.87:/tmp/
# Enter password: dC7Be3(2u2j)
```

**Expected**: File transfers, shows 191MB progress bar

---

## Step 2: SSH into VPS

```bash
ssh root@213.136.80.87
# Enter password: dC7Be3(2u2j)
```

---

## Step 3: Load the Docker Image

```bash
# Once connected to VPS:
cd /tmp

# Load the image
docker load < naresima-latest.tar.gz

# Verify it loaded
docker images | grep naresima
```

**Expected**: Should show `naresima   latest   [IMAGE_ID]   ...`

---

## Step 4: Stop Old Container

```bash
# Stop and remove old container
docker stop naresima-app 2>/dev/null
docker rm naresima-app 2>/dev/null

# Verify it's gone
docker ps -a | grep naresima
```

**Expected**: Should show nothing or "Exited" status

---

## Step 5: Start New Container with Traefik Labels

```bash
docker run -d \
  --name naresima-app \
  --restart always \
  --network web \
  -e NODE_ENV=production \
  -v /root/productionapp/nare-travel/data:/app/data \
  -v /root/productionapp/nare-travel/public/images/uploads:/app/public/images/uploads \
  -l "traefik.enable=true" \
  -l "traefik.http.routers.nare.rule=Host(\`berdjds.com\`) || Host(\`www.berdjds.com\`)" \
  -l "traefik.http.routers.nare.entrypoints=web" \
  -l "traefik.http.routers.nare.middlewares=redirect-to-https" \
  -l "traefik.http.routers.nare-secure.rule=Host(\`berdjds.com\`) || Host(\`www.berdjds.com\`)" \
  -l "traefik.http.routers.nare-secure.entrypoints=websecure" \
  -l "traefik.http.routers.nare-secure.tls.certresolver=le" \
  -l "traefik.http.services.nare.loadbalancer.server.port=3000" \
  naresima:latest
```

**Expected**: Long container ID printed

---

## Step 6: Verify Container is Running

```bash
# Check status
docker ps | grep naresima

# Should show:
# naresima-app   naresima:latest   Up X seconds   3000/tcp
```

---

## Step 7: Check Logs

```bash
docker logs naresima-app --tail=30
```

**Expected**: Should see:
```
▲ Next.js 16.0.1
- Local:        http://localhost:3000
✓ Ready in XXms
```

---

## Step 8: Test Locally on VPS

```bash
# Test if app responds
docker exec naresima-app wget -qO- http://localhost:3000 | head -c 500
```

**Expected**: Should see HTML output starting with `<!DOCTYPE html>`

---

## Step 9: Check Traefik Routing

```bash
# Check if Traefik sees the container
docker logs traefik --tail=50 | grep -i nare

# Check Traefik dashboard (if accessible)
curl -s http://localhost:8080/api/http/routers | grep -i berdjds
```

**Expected**: Should see router configuration for berdjds.com

---

## Step 10: Test from Outside

```bash
# Exit VPS
exit

# From your Mac, test the website:
curl -I https://berdjds.com
```

**Expected**: Should see `HTTP/2 200`

---

## Step 11: Clear Browser Cache & Test

1. Open https://berdjds.com
2. Hard refresh: **Cmd + Shift + R**
3. Check for new features:
   - Scroll to footer → Look for TikTok & TripAdvisor icons
   - Visit /contact → Look for "Our Office" section
   - Check images load quickly
   - Check navbar has "Home" button

---

## Troubleshooting:

### If container exits immediately:
```bash
docker logs naresima-app
# Check for errors
```

### If site shows 404:
```bash
# Check Traefik is running
docker ps | grep traefik

# Restart Traefik to pick up new labels
docker restart traefik
```

### If showing old version:
```bash
# Force rebuild from scratch
cd /root/productionapp/nare-travel
git pull
docker build --no-cache -t naresima:latest .
docker restart naresima-app
```

---

## Cleanup:

```bash
# Remove uploaded tar file
rm /tmp/naresima-latest.tar.gz

# Remove old/dangling images
docker image prune -f
```

---

## Current Status:

According to my last deployment:
- ✅ Image uploaded successfully
- ✅ Container started: `naresima-app`
- ✅ Logs show: "Ready in 46ms"
- ✅ Website responds with HTTP 200

**BUT**: You mentioned it's not correct - please follow the steps above to verify each part manually.

The most likely issues:
1. Traefik not routing to the new container
2. Browser cache showing old version
3. Container running but not properly connected to web network
