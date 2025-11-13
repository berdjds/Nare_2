#!/bin/bash

# Quick VPS Deployment Script
# Run this directly on your VPS server

set -e  # Exit on any error

echo "🚀 Starting Nare Travel Deployment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Step 1: Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Code pulled successfully"
else
    echo -e "${RED}✗${NC} Failed to pull code"
    exit 1
fi
echo ""

# Step 2: Run setup script
echo "⚙️  Running setup script..."
if [ -f "./vps-setup.sh" ]; then
    chmod +x vps-setup.sh
    ./vps-setup.sh
else
    echo -e "${RED}✗${NC} vps-setup.sh not found!"
    exit 1
fi
echo ""

# Step 3: Set ownership
echo "🔒 Setting directory ownership..."
echo -e "${YELLOW}Choose your web server user:${NC}"
echo "1) www-data (Nginx/Apache)"
echo "2) $USER (PM2/Node)"
read -p "Enter choice [1 or 2]: " choice

case $choice in
    1)
        echo "Setting ownership to www-data..."
        sudo chown -R www-data:www-data data/ public/images/uploads/ 2>/dev/null || true
        echo -e "${GREEN}✓${NC} Ownership set to www-data"
        ;;
    2)
        echo "Setting ownership to $USER..."
        sudo chown -R $USER:$USER data/ public/images/uploads/ 2>/dev/null || true
        echo -e "${GREEN}✓${NC} Ownership set to $USER"
        ;;
    *)
        echo -e "${YELLOW}⚠${NC}  Skipping ownership change - set manually if needed"
        ;;
esac
echo ""

# Step 4: Install dependencies
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
elif command -v npm &> /dev/null; then
    npm install
else
    echo -e "${RED}✗${NC} Neither npm nor pnpm found!"
    exit 1
fi
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# Step 5: Build application
echo "🔨 Building application..."
if command -v pnpm &> /dev/null; then
    pnpm build
else
    npm run build
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}✗${NC} Build failed"
    exit 1
fi
echo ""

# Step 6: Restart application
echo "🔄 Restarting application..."
if command -v pm2 &> /dev/null; then
    echo "Restarting with PM2..."
    pm2 restart nare-travel || pm2 restart all
    echo -e "${GREEN}✓${NC} Application restarted with PM2"
elif systemctl is-active --quiet nare-travel 2>/dev/null; then
    echo "Restarting with systemd..."
    sudo systemctl restart nare-travel
    echo -e "${GREEN}✓${NC} Application restarted with systemd"
elif command -v docker-compose &> /dev/null; then
    echo "Restarting with Docker..."
    docker-compose restart
    echo -e "${GREEN}✓${NC} Application restarted with Docker"
else
    echo -e "${YELLOW}⚠${NC}  Could not auto-restart. Please restart manually."
fi
echo ""

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📋 Next Steps:"
echo "1. Test image upload in admin panel"
echo "2. Test settings update"
echo "3. Check language flags appear"
echo "4. Verify new features work"
echo ""
echo "🔍 View logs:"
echo "   pm2 logs nare-travel --lines 50"
echo ""
echo "🌐 Visit your website and test!"
echo ""
