#!/bin/bash

echo "🔧 Fixing docker-compose.yml and deploying Nare Travel"
echo "======================================================"
echo ""
echo "Password: dC7Be3(2u2j)"
echo ""

ssh -t root@213.136.80.87 << 'ENDSSH'
cd /root/productionapp

echo ""
echo "📝 Restoring backup if needed..."
if [ -f docker-compose.yml.backup ]; then
    cp docker-compose.yml.backup docker-compose.yml
fi

echo ""
echo "📝 Manually adding nare-travel service properly..."

# Use Python to properly add the service
python3 << 'PYTHON'
import re

# Read the file
with open('docker-compose.yml', 'r') as f:
    content = f.read()

# Check if nare-travel already exists
if 'nare-travel:' in content:
    print("Service already exists, removing old entry...")
    # Remove existing nare-travel service
    lines = content.split('\n')
    new_lines = []
    skip = False
    for line in lines:
        if line.strip().startswith('nare-travel:'):
            skip = True
        elif skip and line and not line.startswith(' '):
            skip = False
        if not skip:
            new_lines.append(line)
    content = '\n'.join(new_lines)

# Find the right place to add (before volumes:)
if 'volumes:' in content:
    # Add before volumes
    content = content.replace('\nvolumes:', '\n  nare-travel:\n    image: nare-travel:latest\n    container_name: nare-travel\n    restart: always\n    networks:\n      - web\n    environment:\n      - NODE_ENV=production\n    volumes:\n      - ./nare-travel/data:/app/data\n      - ./nare-travel/public/images/uploads:/app/public/images/uploads\n    labels:\n      - "traefik.enable=true"\n      - "traefik.http.routers.naretravel.rule=Host(`berdjds.com`) || Host(`www.berdjds.com`)"\n      - "traefik.http.routers.naretravel.entrypoints=web"\n      - "traefik.http.routers.naretravel.middlewares=redirect-to-https"\n      - "traefik.http.routers.naretravel-secure.rule=Host(`berdjds.com`) || Host(`www.berdjds.com`)"\n      - "traefik.http.routers.naretravel-secure.entrypoints=websecure"\n      - "traefik.http.routers.naretravel-secure.tls.certresolver=le"\n      - "traefik.http.services.naretravel.loadbalancer.server.port=3000"\n    expose:\n      - "3000"\n\nvolumes:')

# Write back
with open('docker-compose.yml', 'w') as f:
    f.write(content)

print("✓ Service added successfully")
PYTHON

echo ""
echo "🔍 Validating docker-compose.yml..."
docker compose config > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ docker-compose.yml is valid"
else
    echo "⚠ Validation has warnings but continuing..."
fi

echo ""
echo "🔨 Building Docker image..."
docker build -t nare-travel:latest ./nare-travel

echo ""
echo "🚀 Starting nare-travel container..."
docker compose up -d nare-travel

echo ""
echo "⏳ Waiting 10 seconds for container to fully start..."
sleep 10

echo ""
echo "📊 Container Status:"
docker ps | grep nare

echo ""
echo "📝 Recent Logs:"
docker logs --tail=40 nare-travel 2>/dev/null || echo "Container not yet ready"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Visit https://berdjds.com"
echo "   (SSL may take 1-2 minutes)"
echo ""

read -p "Press ENTER to exit..."
exit
ENDSSH
