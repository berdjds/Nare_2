#!/bin/bash

# Nare Travel Docker Update Script
# Run this on VPS to update berdjds.com deployment

set -e

echo "🔄 Updating Nare Travel on berdjds.com"
echo "======================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Navigate to production directory
cd /root/productionapp

# Find the nare travel app directory (could be various names)
APP_DIR=""
for dir in nare-travel naretravel Nare_2 nare; do
    if [ -d "$dir" ]; then
        APP_DIR="$dir"
        echo -e "${GREEN}Found app directory: $dir${NC}"
        break
    fi
done

if [ -z "$APP_DIR" ]; then
    echo -e "${YELLOW}App directory not found, creating new...${NC}"
    mkdir -p nare-travel
    cd nare-travel
    git clone https://github.com/berdjds/Nare_2.git .
    APP_DIR="nare-travel"
else
    echo "📥 Pulling latest code..."
    cd "$APP_DIR"
    git pull origin main || git clone https://github.com/berdjds/Nare_2.git .
fi

echo -e "${GREEN}✓${NC} Code updated"
echo ""

# Create data directories if they don't exist
echo "📁 Ensuring data directories exist..."
mkdir -p data public/images/uploads
chmod 755 data public/images/uploads
echo -e "${GREEN}✓${NC} Data directories ready"
echo ""

# Go back to production directory
cd /root/productionapp

# Build new Docker image
echo "🔨 Building new Docker image..."
docker build -t nare-travel:latest ./$APP_DIR

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Image built successfully"
else
    echo -e "${RED}✗${NC} Image build failed!"
    exit 1
fi
echo ""

# Find the container name (could be various names)
CONTAINER_NAME=$(docker ps --format '{{.Names}}' | grep -i 'nare' | head -n 1)

if [ -z "$CONTAINER_NAME" ]; then
    echo -e "${YELLOW}⚠${NC}  No running Nare container found"
    echo "Looking for service in docker-compose.yml..."
    
    # Try to find service in docker-compose.yml
    SERVICE_NAME=$(grep -A 1 "berdjds.com\|nare" docker-compose.yml 2>/dev/null | grep "^\s*[a-z]" | head -n 1 | sed 's/://g' | xargs)
    
    if [ -n "$SERVICE_NAME" ]; then
        echo "Found service: $SERVICE_NAME"
        echo "Starting container..."
        docker compose up -d "$SERVICE_NAME"
    else
        echo -e "${RED}Could not find service. Please check docker-compose.yml${NC}"
        exit 1
    fi
else
    echo "📦 Found container: $CONTAINER_NAME"
    
    # Stop the old container
    echo "🛑 Stopping old container..."
    docker stop "$CONTAINER_NAME"
    
    # Remove old container
    echo "🗑️  Removing old container..."
    docker rm "$CONTAINER_NAME"
    
    # Start new container
    echo "🚀 Starting new container..."
    docker compose up -d
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Update Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Show container status
echo "📊 Container Status:"
docker ps | grep -i nare || echo -e "${RED}No Nare container running${NC}"
echo ""

# Show recent logs
echo "📝 Recent logs (last 30 lines):"
NEW_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i 'nare' | head -n 1)
if [ -n "$NEW_CONTAINER" ]; then
    docker logs --tail=30 "$NEW_CONTAINER"
fi

echo ""
echo "🌐 Your site should be updated at:"
echo "   https://berdjds.com"
echo ""
echo "🔍 To view full logs:"
echo "   docker logs -f $NEW_CONTAINER"
echo ""
