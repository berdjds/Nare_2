#!/bin/bash

# VPS Setup Script for Nare Travel Website
# Run this on your VPS after pulling from git

echo "🚀 Setting up VPS directories and permissions..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create directories
echo "📁 Creating directories..."
mkdir -p data
mkdir -p public/images/uploads
mkdir -p public/flags

echo -e "${GREEN}✓${NC} Directories created"

# Set permissions
echo "🔒 Setting permissions..."
chmod 755 data
chmod 755 public/images/uploads
chmod 755 public/flags

echo -e "${GREEN}✓${NC} Permissions set"

# Create default settings if not exists
if [ ! -f "data/settings.json" ]; then
    echo "⚙️  Creating default settings..."
    cat > data/settings.json << 'SETTINGS'
{
  "autoTranslate": false,
  "defaultLanguage": "en",
  "enableAITranslation": false
}
SETTINGS
    chmod 644 data/settings.json
    echo -e "${GREEN}✓${NC} Default settings created"
else
    echo -e "${YELLOW}ℹ${NC}  settings.json already exists"
fi

# Create .gitkeep for uploads directory
touch public/images/uploads/.gitkeep

# Verify flag files
echo "🏴 Checking flag files..."
for flag in en hy ru ar; do
    if [ -f "public/flags/${flag}.svg" ]; then
        chmod 644 "public/flags/${flag}.svg"
        echo -e "${GREEN}✓${NC} ${flag}.svg exists"
    else
        echo -e "${RED}✗${NC} ${flag}.svg missing!"
    fi
done

# Display ownership info
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Set ownership for web server${NC}"
echo "Run one of these commands based on your setup:"
echo ""
echo "For Nginx/Apache (www-data user):"
echo "  sudo chown -R www-data:www-data data/ public/images/uploads/"
echo ""
echo "For PM2/Node user:"
echo "  sudo chown -R \$USER:\$USER data/ public/images/uploads/"
echo ""

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Next steps:"
echo "1. Set ownership (see commands above)"
echo "2. Run: npm install"
echo "3. Run: npm run build"
echo "4. Restart your app (pm2 restart / systemctl restart)"
echo "5. Test uploads in admin panel"
echo ""
