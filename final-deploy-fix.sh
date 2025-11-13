#!/bin/bash

echo "🔧 Final Fix - Starting Nare Container"
echo "======================================"
echo ""
echo "Password: dC7Be3(2u2j)"
echo ""

ssh -t root@213.136.80.87 << 'ENDSSH'
cd /root/productionapp

echo ""
echo "🔍 Finding Nare service in docker-compose.yml..."
grep -B 2 "berdjds.com" docker-compose.yml | grep -v "traefik" | grep ":" | head -n 1

echo ""
echo "📋 All services:"
docker compose config --services 2>/dev/null | head -20

echo ""
echo "🚀 Starting ALL services (this will start Nare too)..."
docker compose up -d

echo ""
echo "⏳ Waiting 15 seconds for containers to start..."
sleep 15

echo ""
echo "📊 All running containers:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🔍 Finding Nare container..."
NARE_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i nare | head -n 1)

if [ -z "$NARE_CONTAINER" ]; then
    echo "❌ No Nare container found!"
    echo ""
    echo "Let's start it manually..."
    
    docker run -d \
      --name naresima-app \
      --restart always \
      --network web \
      -e NODE_ENV=production \
      -v $(pwd)/nare-travel/data:/app/data \
      -v $(pwd)/nare-travel/public/images/uploads:/app/public/images/uploads \
      -l "traefik.enable=true" \
      -l "traefik.http.routers.nare.rule=Host(\`berdjds.com\`) || Host(\`www.berdjds.com\`)" \
      -l "traefik.http.routers.nare.entrypoints=web" \
      -l "traefik.http.routers.nare.middlewares=redirect-to-https" \
      -l "traefik.http.routers.nare-secure.rule=Host(\`berdjds.com\`) || Host(\`www.berdjds.com\`)" \
      -l "traefik.http.routers.nare-secure.entrypoints=websecure" \
      -l "traefik.http.routers.nare-secure.tls.certresolver=le" \
      -l "traefik.http.services.nare.loadbalancer.server.port=3000" \
      naresima:latest
    
    sleep 5
    NARE_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i nare | head -n 1)
fi

echo ""
echo "✓ Container: $NARE_CONTAINER"

echo ""
echo "📝 Container Logs:"
docker logs --tail=50 "$NARE_CONTAINER"

echo ""
echo "🌐 Testing if app is responding..."
docker exec "$NARE_CONTAINER" wget -qO- http://localhost:3000 | head -c 200

echo ""
echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🌐 Visit: https://berdjds.com"
echo "   (SSL certificate may take 1-2 minutes)"
echo ""

read -p "Press ENTER to exit..."
exit
ENDSSH
