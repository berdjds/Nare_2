#!/bin/bash

echo "➕ Adding Nare Travel to docker-compose.yml"
echo "==========================================="
echo ""
echo "Password: dC7Be3(2u2j)"
echo ""

ssh -t root@213.136.80.87 << 'ENDSSH'
cd /root/productionapp

echo ""
echo "📝 Backing up docker-compose.yml..."
cp docker-compose.yml docker-compose.yml.backup

echo ""
echo "➕ Adding Nare Travel service..."

# Add the service before the volumes section
cat >> docker-compose.yml << 'EOF'

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
      - "traefik.http.routers.naretravel.rule=Host(`berdjds.com`) || Host(`www.berdjds.com`)"
      - "traefik.http.routers.naretravel.entrypoints=web"
      - "traefik.http.routers.naretravel.middlewares=redirect-to-https"
      - "traefik.http.routers.naretravel-secure.rule=Host(`berdjds.com`) || Host(`www.berdjds.com`)"
      - "traefik.http.routers.naretravel-secure.entrypoints=websecure"
      - "traefik.http.routers.naretravel-secure.tls.certresolver=le"
      - "traefik.http.services.naretravel.loadbalancer.server.port=3000"
    expose:
      - "3000"
EOF

echo ""
echo "✓ Service added to docker-compose.yml"
echo ""

echo "🔨 Building Docker image..."
docker build -t nare-travel:latest ./nare-travel

echo ""
echo "🚀 Starting Nare Travel container..."
docker compose up -d nare-travel

echo ""
echo "⏳ Waiting 5 seconds for container to start..."
sleep 5

echo ""
echo "📊 Container Status:"
docker ps | grep nare-travel

echo ""
echo "📝 Container Logs:"
docker logs --tail=30 nare-travel

echo ""
echo "✅ Done! Visit https://berdjds.com"
echo ""

read -p "Press ENTER to exit..."
exit
ENDSSH
