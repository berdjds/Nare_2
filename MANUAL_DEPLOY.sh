#!/bin/bash

echo ""
echo "🚀 Nare Travel Deployment to berdjds.com"
echo "=========================================="
echo ""
echo "I'll guide you through the deployment."
echo "You'll need to enter the VPS password when prompted."
echo ""
echo "Password: dC7Be3(2u2j)"
echo ""
read -p "Press ENTER to start deployment..."

echo ""
echo "Step 1: Connecting to VPS..."
echo ""

ssh -t root@213.136.80.87 << 'ENDSSH'
echo ""
echo "✓ Connected to VPS"
echo ""
echo "📁 Navigating to production directory..."
cd /root/productionapp

echo ""
echo "📥 Downloading latest deployment script..."
curl -sSL https://raw.githubusercontent.com/berdjds/Nare_2/main/update-nare-docker.sh -o update.sh
chmod +x update.sh

echo ""
echo "🚀 Running deployment..."
echo ""
./update.sh

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Press ENTER to exit..."
read
exit
ENDSSH

echo ""
echo "🌐 Visit https://berdjds.com to see your updates!"
echo ""
