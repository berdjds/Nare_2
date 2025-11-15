# 🧪 UAT Quick Start Guide

## Prerequisites

1. ✅ DNS configured: `uat.berdjds.com` → `213.136.80.87`
2. ✅ VPS access: `root@213.136.80.87` (Password: `dC7Be3(2u2j)`)

---

## 🚀 Deploy UAT (One Command)

```bash
./deploy-uat.exp
```

**That's it!** The script will:
1. Build UAT Docker image
2. Remove old UAT version from VPS
3. Upload new image
4. Deploy UAT container
5. Restart Traefik

**Time:** ~3-5 minutes

---

## 🌐 Access UAT

- **Website:** https://uat.berdjds.com
- **Admin Panel:** https://uat.berdjds.com/admin
- **Credentials:** admin / admin123

---

## 📊 Check UAT Status

```bash
ssh root@213.136.80.87
# Password: dC7Be3(2u2j)

# Check container
docker ps | grep uat

# Check logs
docker logs --tail=50 naresima-app-uat

# Test URL
curl -I https://uat.berdjds.com
```

---

## 🔄 Update UAT

Just run the deployment script again:

```bash
./deploy-uat.exp
```

---

## 🗑️ Remove UAT

```bash
ssh root@213.136.80.87
docker stop naresima-app-uat
docker rm naresima-app-uat
docker rmi naresima:uat
```

---

## 📋 Environment Comparison

| | Production | UAT |
|---|---|---|
| **URL** | https://berdjds.com | https://uat.berdjds.com |
| **Deploy Script** | `./full-deploy.exp` | `./deploy-uat.exp` |
| **Container** | naresima-app | naresima-app-uat |
| **Data** | Separate | Separate |

---

## 🐛 Troubleshooting

### UAT not accessible?

```bash
ssh root@213.136.80.87
docker logs naresima-app-uat
docker restart naresima-app-uat
docker restart traefik
```

### DNS not resolving?

```bash
nslookup uat.berdjds.com
# Should return: 213.136.80.87
```

Wait 5-10 minutes for DNS propagation if just configured.

---

## ✅ First-Time Setup

**Before first deployment:**

1. **Configure DNS:**
   - Go to your domain registrar
   - Add A record: `uat` → `213.136.80.87`
   - Wait 5-10 minutes for DNS propagation

2. **Verify DNS:**
   ```bash
   nslookup uat.berdjds.com
   ```

3. **Deploy UAT:**
   ```bash
   ./deploy-uat.exp
   ```

4. **Test:**
   - Visit https://uat.berdjds.com
   - Login to admin panel
   - Test image upload

---

## 🎯 Typical Workflow

```
Development (localhost:3000)
         ↓
    Test Locally
         ↓
Deploy to UAT (./deploy-uat.exp)
         ↓
  Test on uat.berdjds.com
         ↓
    Get Approval
         ↓
Deploy to Production (./full-deploy.exp)
         ↓
    Live on berdjds.com
```

---

## 📝 Notes

- UAT uses separate data from production
- Image uploads go to separate directory
- Both environments run on same VPS
- SSL certificates are automatic (Let's Encrypt)
- First access might be slow (generating SSL cert)

---

**Ready to deploy UAT? Just run:** `./deploy-uat.exp`
