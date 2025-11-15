# 🧪 UAT Environment Deployment Plan

## Overview

**Purpose:** Create a User Acceptance Testing environment for testing new features before production deployment.

---

## 🏗️ Proposed Architecture

### Option 1: Same VPS, Different Subdomain (RECOMMENDED)

**Benefits:**
- ✅ Cost-effective (no new server needed)
- ✅ Same infrastructure as production
- ✅ Easy to manage both environments
- ✅ Can share Traefik reverse proxy

**Setup:**
```
Production: https://berdjds.com (Container: naresima-app)
UAT:        https://uat.berdjds.com (Container: naresima-app-uat)
```

---

## 📋 Implementation Steps

### Step 1: Configure DNS

Add A record in your DNS provider:
- **Type:** A
- **Name:** uat
- **Value:** 213.136.80.87
- **TTL:** 3600

Result: `uat.berdjds.com` → 213.136.80.87

---

### Step 2: Build UAT Docker Image

```bash
# Tag with 'uat' suffix
docker buildx build --platform linux/amd64 --load -t naresima:uat .

# Save image
docker save naresima:uat | gzip > naresima-uat.tar.gz
```

---

### Step 3: Upload to VPS

```bash
scp naresima-uat.tar.gz root@213.136.80.87:/tmp/
# Password: dC7Be3(2u2j)
```

---

### Step 4: Deploy UAT Container

```bash
ssh root@213.136.80.87
# Password: dC7Be3(2u2j)

# Load image
cd /tmp
docker load < naresima-uat.tar.gz

# Create UAT data directories
mkdir -p /root/productionapp/nare-travel-uat/data
mkdir -p /root/productionapp/nare-travel-uat/public/images/uploads
chown -R 1001:1001 /root/productionapp/nare-travel-uat/public/images/uploads
chmod -R 777 /root/productionapp/nare-travel-uat/public/images/uploads

# Start UAT container
docker run -d \
  --name naresima-app-uat \
  --restart always \
  --network web \
  -e NODE_ENV=production \
  -v /root/productionapp/nare-travel-uat/data:/app/data \
  -v /root/productionapp/nare-travel-uat/public/images/uploads:/app/public/images/uploads \
  -l "traefik.enable=true" \
  -l "traefik.http.routers.nare-uat.rule=Host(\`uat.berdjds.com\`)" \
  -l "traefik.http.routers.nare-uat.entrypoints=web" \
  -l "traefik.http.routers.nare-uat.middlewares=redirect-to-https" \
  -l "traefik.http.routers.nare-uat-secure.rule=Host(\`uat.berdjds.com\`)" \
  -l "traefik.http.routers.nare-uat-secure.entrypoints=websecure" \
  -l "traefik.http.routers.nare-uat-secure.tls.certresolver=le" \
  -l "traefik.http.services.nare-uat.loadbalancer.server.port=3000" \
  naresima:uat

# Verify
docker ps | grep uat
docker logs --tail=20 naresima-app-uat

# Restart Traefik to pick up new routes
docker restart traefik
```

---

## 🔄 UAT Update Workflow

### When you want to update UAT:

```bash
# 1. Build new UAT image locally
docker buildx build --platform linux/amd64 --load -t naresima:uat .
docker save naresima:uat | gzip > naresima-uat.tar.gz

# 2. Upload to VPS
scp naresima-uat.tar.gz root@213.136.80.87:/tmp/

# 3. SSH and update
ssh root@213.136.80.87

# Stop and remove old UAT container
docker stop naresima-app-uat
docker rm naresima-app-uat
docker rmi naresima:uat

# Load new image
cd /tmp
docker load < naresima-uat.tar.gz

# Start new container (same command as Step 4)
docker run -d \
  --name naresima-app-uat \
  --restart always \
  --network web \
  -e NODE_ENV=production \
  -v /root/productionapp/nare-travel-uat/data:/app/data \
  -v /root/productionapp/nare-travel-uat/public/images/uploads:/app/public/images/uploads \
  -l "traefik.enable=true" \
  -l "traefik.http.routers.nare-uat.rule=Host(\`uat.berdjds.com\`)" \
  -l "traefik.http.routers.nare-uat.entrypoints=web" \
  -l "traefik.http.routers.nare-uat.middlewares=redirect-to-https" \
  -l "traefik.http.routers.nare-uat-secure.rule=Host(\`uat.berdjds.com\`)" \
  -l "traefik.http.routers.nare-uat-secure.entrypoints=websecure" \
  -l "traefik.http.routers.nare-uat-secure.tls.certresolver=le" \
  -l "traefik.http.services.nare-uat.loadbalancer.server.port=3000" \
  naresima:uat

# Restart Traefik
docker restart traefik

# Cleanup
rm -f /tmp/naresima-uat.tar.gz
```

---

## 📊 Environment Comparison

| Feature | Production | UAT |
|---------|-----------|-----|
| **URL** | https://berdjds.com | https://uat.berdjds.com |
| **Container** | naresima-app | naresima-app-uat |
| **Image** | naresima:latest | naresima:uat |
| **Data Dir** | /root/productionapp/nare-travel/data | /root/productionapp/nare-travel-uat/data |
| **Uploads** | /root/productionapp/nare-travel/public/images/uploads | /root/productionapp/nare-travel-uat/public/images/uploads |
| **Admin Login** | https://berdjds.com/admin | https://uat.berdjds.com/admin |

---

## 🧪 Testing Workflow

1. **Develop Feature**
   - Work on feature branch locally
   - Test at http://localhost:3000

2. **Deploy to UAT**
   - Build and upload UAT image
   - Test at https://uat.berdjds.com
   - Share with stakeholders for approval

3. **Deploy to Production**
   - After UAT approval
   - Build and upload production image
   - Deploy to https://berdjds.com

---

## 🔐 Security Considerations

**UAT Admin Access:**
- Same credentials as production (admin/admin123)
- Consider changing for UAT if needed
- Data is separate from production

**SSL Certificates:**
- Traefik will automatically get Let's Encrypt certificate for uat.berdjds.com
- First request might take 30-60 seconds for cert generation

---

## 📝 Verification Checklist

After UAT deployment:

- [ ] DNS resolves: `nslookup uat.berdjds.com`
- [ ] Site accessible: `curl -I https://uat.berdjds.com`
- [ ] Container running: `docker ps | grep uat`
- [ ] Logs clean: `docker logs naresima-app-uat`
- [ ] Admin panel works: https://uat.berdjds.com/admin
- [ ] Image upload works
- [ ] SSL certificate valid

---

## 🚨 Troubleshooting

### UAT site not accessible:

```bash
ssh root@213.136.80.87

# Check container
docker ps | grep uat
docker logs naresima-app-uat

# Check Traefik
docker logs traefik | grep uat

# Restart if needed
docker restart naresima-app-uat
docker restart traefik
```

### Check both environments:

```bash
# Production
curl -I https://berdjds.com

# UAT
curl -I https://uat.berdjds.com
```

---

## 📋 Automation Script (Optional)

Create `deploy-uat.exp` for automated UAT deployment (similar to full-deploy.exp but for UAT).

---

## 🎯 Next Steps

1. **Now:** Set up DNS for uat.berdjds.com
2. **Then:** I'll create automated deployment script
3. **Finally:** Deploy first UAT version

**Ready to proceed?**
