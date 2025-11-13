#!/bin/bash

echo "🔄 Updating existing Nare container (naresima-app)"
echo "=================================================="
echo ""
echo "Password: dC7Be3(2u2j)"
echo ""

ssh -t root@213.136.80.87 << 'ENDSSH'
cd /root/productionapp

echo ""
echo "📊 Current Nare container:"
docker ps | grep nare

echo ""
echo "📁 Finding app directory..."
APP_DIR=$(find . -maxdepth 2 -type d -name "*nare*" -o -name "*Nare*" | head -n 1)
if [ -z "$APP_DIR" ]; then
    echo "Creating nare-travel directory..."
    mkdir -p nare-travel
    cd nare-travel
    git clone https://github.com/berdjds/Nare_2.git .
    APP_DIR="./nare-travel"
else
    echo "Found: $APP_DIR"
    cd "$APP_DIR"
    echo "Pulling latest code..."
    git pull origin main 2>/dev/null || git clone https://github.com/berdjds/Nare_2.git .
fi

cd /root/productionapp

echo ""
echo "🔨 Building new image..."
docker build -t naresima:latest "$APP_DIR" || docker build -t nare-travel:latest "$APP_DIR"

echo ""
echo "🛑 Stopping old container..."
docker stop naresima-app 2>/dev/null || echo "Container not running"

echo ""
echo "🗑️  Removing old container..."
docker rm naresima-app 2>/dev/null || echo "Container already removed"

echo ""
echo "🚀 Starting updated container..."
# Find and restart the service in docker-compose
SERVICE=$(grep -B 5 "naresima\|berdjds\.com" docker-compose.yml | grep ":" | head -n 1 | sed 's/://g' | xargs)

if [ -n "$SERVICE" ]; then
    echo "Restarting service: $SERVICE"
    docker compose up -d "$SERVICE"
else
    echo "Service not found, trying manual start..."
    docker run -d \
      --name naresima-app \
      --restart always \
      --network web \
      -e NODE_ENV=production \
      -v /root/productionapp/nare-travel/data:/app/data \
      -v /root/productionapp/nare-travel/public/images/uploads:/app/public/images/uploads \
      naresima:latest
fi

echo ""
echo "⏳ Waiting 10 seconds..."
sleep 10

echo ""
echo "📊 Container Status:"
docker ps | grep -E "nare|naresima"

echo ""
echo "📝 Container Logs (last 40 lines):"
CONTAINER=$(docker ps | grep -E "nare|naresima" | awk '{print $1}' | head -n 1)
if [ -n "$CONTAINER" ]; then
    docker logs --tail=40 "$CONTAINER"
fi

echo ""
echo "✅ Update complete!"
echo ""
echo "🌐 Visit https://berdjds.com"
echo ""

read -p "Press ENTER to exit..."
exit
ENDSSH
