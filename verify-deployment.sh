#!/bin/bash

echo "🔍 Verifying Deployment on VPS"
echo "=============================="
echo ""
echo "Password: dC7Be3(2u2j)"
echo ""

ssh -t root@213.136.80.87 << 'ENDSSH'

echo ""
echo "📊 All Running Containers:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🔍 Looking for Nare container..."
NARE_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i nare)

if [ -z "$NARE_CONTAINER" ]; then
    echo "❌ No Nare container found running!"
else
    echo "✅ Found: $NARE_CONTAINER"
    
    echo ""
    echo "📝 Container Details:"
    docker inspect $NARE_CONTAINER --format '{{.Config.Image}}'
    docker inspect $NARE_CONTAINER --format '{{.State.Status}}'
    docker inspect $NARE_CONTAINER --format '{{.NetworkSettings.Networks}}'
    
    echo ""
    echo "📝 Recent Logs:"
    docker logs --tail=50 $NARE_CONTAINER
    
    echo ""
    echo "🌐 Testing if app responds..."
    docker exec $NARE_CONTAINER wget -qO- http://localhost:3000 2>&1 | head -c 300
fi

echo ""
echo ""
echo "🔍 Checking Traefik routing..."
docker exec traefik cat /etc/traefik/traefik.yml | grep -A 10 berdjds || echo "No static config for berdjds"

echo ""
echo "🔍 Active Traefik routes:"
curl -s http://localhost:8080/api/http/routers | grep -i berdjds || echo "No dynamic routes for berdjds"

echo ""
echo ""

read -p "Press ENTER to exit..."
exit
ENDSSH
