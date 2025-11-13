# 🐳 Docker Deployment to VPS

## Current VPS Setup
- **IP**: 213.136.80.87
- **User**: root
- **Docker Location**: /root/productionapp
- **Reverse Proxy**: Traefik (with auto SSL)

---

## 🚀 Quick Deployment Steps

### Option A: Deploy to Existing Domain (nare.am)

```bash
# 1. SSH to VPS
ssh root@213.136.80.87
# Password: dC7Be3(2u2j)

# 2. Navigate to app directory
cd /root/productionapp

# 3. Create app directory
mkdir -p nare-travel
cd nare-travel

# 4. Clone repository
git clone https://github.com/berdjds/Nare_2.git .

# 5. Build Docker image locally
docker build -t nare-travel:latest .

# 6. Add to docker-compose.yml (back to /root/productionapp)
cd /root/productionapp
nano docker-compose.yml
```

Add this configuration:

```yaml
  nare-travel:
    image: nare-travel:latest
    container_name: nare-travel
    restart: always
    networks:
      - web
    environment:
      - NODE_ENV=production
    volumes:
      - ./nare-travel/data:/app/data
      - ./nare-travel/public/images/uploads:/app/public/images/uploads
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.naretravel.rule=Host(`nare.am`) || Host(`www.nare.am`)"
      - "traefik.http.routers.naretravel.entrypoints=web"
      - "traefik.http.routers.naretravel.middlewares=redirect-to-https"
      - "traefik.http.routers.naretravel-secure.rule=Host(`nare.am`) || Host(`www.nare.am`)"
      - "traefik.http.routers.naretravel-secure.entrypoints=websecure"
      - "traefik.http.routers.naretravel-secure.tls.certresolver=le"
      - "traefik.http.services.naretravel.loadbalancer.server.port=3000"
```

```bash
# 7. Start the container
docker compose up -d nare-travel

# 8. Check if running
docker ps | grep nare-travel

# 9. View logs
docker compose logs -f nare-travel
```

---

## 🔄 Update/Redeploy Process

When you make changes and push to GitHub:

```bash
# SSH to VPS
ssh root@213.136.80.87

# Navigate to app
cd /root/productionapp/nare-travel

# Pull latest changes
git pull origin main

# Rebuild image
cd /root/productionapp
docker build -t nare-travel:latest ./nare-travel

# Restart container
docker compose restart nare-travel

# Or rebuild and restart in one command
docker compose up -d --build nare-travel
```

---

## 📁 Important: Data Persistence

The volumes ensure your data persists across container restarts:

```bash
# Create data directories if they don't exist
mkdir -p /root/productionapp/nare-travel/data
mkdir -p /root/productionapp/nare-travel/public/images/uploads

# Set permissions
chmod 755 /root/productionapp/nare-travel/data
chmod 755 /root/productionapp/nare-travel/public/images/uploads
```

---

## 🌐 DNS Configuration

Make sure your DNS is pointing to the VPS:

**For nare.am:**
- Type: A
- Name: @
- Value: 213.136.80.87
- TTL: 3600

**For www.nare.am:**
- Type: A (or CNAME to nare.am)
- Name: www
- Value: 213.136.80.87
- TTL: 3600

---

## 🔍 Troubleshooting

### Check container status
```bash
docker ps | grep nare
docker compose ps
```

### View logs
```bash
docker compose logs -f nare-travel
docker logs nare-travel
```

### Restart container
```bash
docker compose restart nare-travel
```

### Rebuild from scratch
```bash
docker compose down nare-travel
docker rmi nare-travel:latest
docker build -t nare-travel:latest ./nare-travel
docker compose up -d nare-travel
```

### Check if port 3000 is accessible
```bash
docker exec -it nare-travel sh
wget -O- http://localhost:3000
```

### Check Traefik routing
```bash
docker logs traefik | grep nare
```

---

## ✅ Verification Checklist

After deployment:
- [ ] Container is running: `docker ps | grep nare`
- [ ] No errors in logs: `docker compose logs nare-travel`
- [ ] Website accessible: https://nare.am
- [ ] SSL certificate active (may take 1-2 minutes)
- [ ] Admin panel accessible: https://nare.am/admin
- [ ] Image upload works
- [ ] Settings save works
- [ ] All features working

---

## 🎯 One-Command Deploy Script

Save this as `deploy-nare.sh` on your VPS:

```bash
#!/bin/bash
cd /root/productionapp/nare-travel
git pull origin main
cd /root/productionapp
docker build -t nare-travel:latest ./nare-travel
docker compose up -d nare-travel
docker compose logs --tail=50 nare-travel
```

Then run:
```bash
chmod +x deploy-nare.sh
./deploy-nare.sh
```
