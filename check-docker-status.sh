#!/bin/bash

echo "🔍 Checking Docker Container Status on VPS"
echo "==========================================="
echo ""
echo "Password: dC7Be3(2u2j)"
echo ""

ssh -t root@213.136.80.87 << 'ENDSSH'
echo ""
echo "📊 Current Docker Containers:"
echo "----------------------------"
docker ps -a | grep -i nare || echo "No Nare containers found"
echo ""

echo "📋 Docker Compose Services:"
echo "----------------------------"
cd /root/productionapp
docker compose ps 2>/dev/null | grep -i nare || echo "No services in docker-compose"
echo ""

echo "📝 Recent Container Logs:"
echo "-------------------------"
CONTAINER=$(docker ps -a --format '{{.Names}}' | grep -i nare | head -n 1)
if [ -n "$CONTAINER" ]; then
    echo "Container: $CONTAINER"
    echo ""
    docker logs --tail=50 "$CONTAINER"
else
    echo "No Nare container found to check logs"
fi
echo ""

echo "🔍 Checking docker-compose.yml for Nare:"
echo "----------------------------------------"
grep -A 20 "berdjds.com\|nare" docker-compose.yml 2>/dev/null || echo "Not found in docker-compose.yml"
echo ""

read -p "Press ENTER to exit..."
exit
ENDSSH
