#!/bin/bash

# Nare Travel Docker Deployment Script
# Run this on VPS: bash vps-docker-setup.sh

set -e

echo "🐳 Nare Travel Docker Deployment"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Navigate to production app directory
cd /root/productionapp

# Create app directory
echo "📁 Creating application directory..."
mkdir -p nare-travel
cd nare-travel

# Check if git repo exists
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes..."
    git pull origin main
else
    echo "📥 Cloning repository..."
    git clone https://github.com/berdjds/Nare_2.git .
fi

echo -e "${GREEN}✓${NC} Code updated"
echo ""

# Create data directories
echo "📁 Creating data directories..."
mkdir -p data
mkdir -p public/images/uploads
chmod 755 data
chmod 755 public/images/uploads
echo -e "${GREEN}✓${NC} Directories created"
echo ""

# Build Docker image
echo "🔨 Building Docker image..."
cd /root/productionapp
docker build -t nare-travel:latest ./nare-travel

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Image built successfully"
else
    echo -e "${RED}✗${NC} Image build failed!"
    exit 1
fi
echo ""

# Check if service exists in docker-compose.yml
if grep -q "nare-travel:" docker-compose.yml 2>/dev/null; then
    echo "🔄 Service exists, restarting..."
    docker compose up -d nare-travel
else
    echo -e "${YELLOW}⚠${NC}  Service not found in docker-compose.yml"
    echo "Please add the service configuration manually."
    echo "See DOCKER_DEPLOY.md for configuration details."
    exit 1
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Show container status
echo "📊 Container Status:"
docker ps | grep nare-travel || echo -e "${RED}Container not running!${NC}"
echo ""

# Show recent logs
echo "📝 Recent logs:"
docker compose logs --tail=20 nare-travel
echo ""

echo "🌐 Your site should be available at:"
echo "   https://nare.am"
echo ""
echo "🔍 To view full logs:"
echo "   docker compose logs -f nare-travel"
echo ""
