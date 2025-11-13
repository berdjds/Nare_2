#!/bin/bash

echo "🔨 FORCE REBUILD - No Cache Deployment"
echo "======================================="
echo ""
echo "This will rebuild everything from scratch"
echo "Password: dC7Be3(2u2j)"
echo ""

ssh -t root@213.136.80.87 << 'ENDSSH'
cd /root/productionapp/nare-travel

echo ""
echo "📥 Pulling absolute latest code from GitHub..."
git fetch --all
git reset --hard origin/main
git pull origin main

echo ""
echo "✓ Latest code pulled"
git log --oneline -1

echo ""
echo "📁 Current directory contents:"
ls -la | head -20

echo ""
echo "🗑️  Removing old Docker image..."
docker rmi naresima:latest 2>/dev/null || echo "Image already removed"
docker rmi nare-travel:latest 2>/dev/null || echo "Image already removed"

echo ""
echo "🔨 Building NEW image (NO CACHE - this will take a few minutes)..."
cd /root/productionapp
docker build --no-cache --progress=plain -t naresima:latest ./nare-travel 2>&1 | tail -100

echo ""
echo "🛑 Stopping old container..."
docker stop naresima-app 2>/dev/null || echo "Already stopped"
docker rm naresima-app 2>/dev/null || echo "Already removed"

echo ""
echo "🚀 Starting FRESH container with NEW code..."
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

echo ""
echo "⏳ Waiting 15 seconds for app to start..."
sleep 15

echo ""
echo "📊 Container Status:"
docker ps | grep naresima

echo ""
echo "📝 Application Logs (last 50 lines):"
docker logs --tail=50 naresima-app

echo ""
echo "🔍 Testing if app responds..."
docker exec naresima-app wget -qO- http://localhost:3000 2>&1 | head -c 500

echo ""
echo ""
echo "✅ FRESH DEPLOYMENT COMPLETE!"
echo ""
echo "🌐 Visit https://berdjds.com and hard refresh (Cmd+Shift+R)"
echo ""

read -p "Press ENTER to exit..."
exit
ENDSSH
