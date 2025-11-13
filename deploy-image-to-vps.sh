#!/bin/bash

echo "🚀 Deploying Nare Travel Docker Image to VPS"
echo "============================================="
echo ""
echo "This will:"
echo "1. Upload Docker image to VPS (192MB)"
echo "2. Load image on VPS"
echo "3. Stop old container"
echo "4. Start new container with all updates"
echo ""
echo "Password: dC7Be3(2u2j)"
echo ""
read -p "Press ENTER to start deployment..."

echo ""
echo "📤 Uploading Docker image to VPS (this may take 2-3 minutes)..."
scp naresima-latest.tar.gz root@213.136.80.87:/tmp/

echo ""
echo "✓ Upload complete!"
echo ""
echo "🐳 Loading image and deploying on VPS..."

ssh -t root@213.136.80.87 << 'ENDSSH'
cd /tmp

echo ""
echo "📦 Loading Docker image..."
docker load < naresima-latest.tar.gz

echo ""
echo "🛑 Stopping old container..."
docker stop naresima-app 2>/dev/null || echo "Container not running"
docker rm naresima-app 2>/dev/null || echo "Container removed"

echo ""
echo "🚀 Starting new container..."
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
echo "⏳ Waiting 10 seconds for container to start..."
sleep 10

echo ""
echo "📊 Container Status:"
docker ps | grep naresima

echo ""
echo "📝 Container Logs:"
docker logs --tail=40 naresima-app

echo ""
echo "🧹 Cleaning up..."
rm -f /tmp/naresima-latest.tar.gz

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🌐 Visit https://berdjds.com"
echo "   (Hard refresh with Cmd+Shift+R to see changes)"
echo ""
echo "🎯 Test these features:"
echo "   - Images load fast (no delay)"
echo "   - Smooth page transitions"  
echo "   - TikTok/TripAdvisor icons in footer"
echo "   - Contact page shows office info"
echo "   - Navbar Home button and highlighting"
echo "   - Animated numbers on homepage"
echo ""

read -p "Press ENTER to exit..."
exit
ENDSSH

echo ""
echo "🎉 All done!"
echo ""
