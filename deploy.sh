#!/bin/bash

# Nare Travel Website - Production Deployment Script
# This script builds and pushes the Docker image to GitHub Container Registry

set -e  # Exit on any error

echo "🚀 Starting deployment process for Nare Travel Website..."
echo "=================================================="

# Configuration
GITHUB_USERNAME="berdjds"
IMAGE_NAME="nare"
REGISTRY="ghcr.io"
FULL_IMAGE_NAME="${REGISTRY}/${GITHUB_USERNAME}/${IMAGE_NAME}"

# Get version number from user or use timestamp
read -p "Enter version number (or press Enter for auto-version): " VERSION
if [ -z "$VERSION" ]; then
    VERSION=$(date +"%Y%m%d-%H%M%S")
    echo "Using auto-generated version: ${VERSION}"
fi

# Full image tag
IMAGE_TAG="${FULL_IMAGE_NAME}:${VERSION}"
LATEST_TAG="${FULL_IMAGE_NAME}:latest"

echo ""
echo "📦 Image Details:"
echo "   Repository: ${FULL_IMAGE_NAME}"
echo "   Version: ${VERSION}"
echo "   Tags: ${VERSION}, latest"
echo ""

# Confirm before proceeding
read -p "Continue with deployment? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Check if logged in to GitHub Container Registry
echo ""
echo "🔐 Checking GitHub Container Registry authentication..."
if ! docker info | grep -q "Username"; then
    echo "⚠️  Not logged in to Docker registry"
    echo "Please login with: echo \$GITHUB_TOKEN | docker login ghcr.io -u ${GITHUB_USERNAME} --password-stdin"
    exit 1
fi

# Build the Docker image
echo ""
echo "🏗️  Building Docker image..."
echo "   This may take 5-10 minutes..."
docker build -t ${IMAGE_TAG} -t ${LATEST_TAG} .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo "✅ Docker image built successfully!"

# Push to registry
echo ""
echo "📤 Pushing image to GitHub Container Registry..."
echo "   Pushing versioned tag: ${VERSION}"
docker push ${IMAGE_TAG}

echo "   Pushing latest tag..."
docker push ${LATEST_TAG}

if [ $? -ne 0 ]; then
    echo "❌ Docker push failed!"
    exit 1
fi

echo ""
echo "✅ Docker image pushed successfully!"

# Display next steps
echo ""
echo "=================================================="
echo "✅ DEPLOYMENT BUILD COMPLETE!"
echo "=================================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. SSH into your production server:"
echo "   ssh root@213.136.80.87"
echo ""
echo "2. Navigate to the app directory:"
echo "   cd /root/productionapp"
echo ""
echo "3. Update docker-compose.yml with new version:"
echo "   sed -i 's|image: ghcr.io/berdjds/nare:.*|image: ${IMAGE_TAG}|g' docker-compose.yml"
echo ""
echo "4. Pull the new image:"
echo "   docker compose pull nare_app"
echo ""
echo "5. Restart the container:"
echo "   docker compose up -d nare_app"
echo ""
echo "6. Check logs:"
echo "   docker compose logs -f nare_app"
echo ""
echo "7. Verify deployment:"
echo "   curl https://berdjds.com"
echo ""
echo "=================================================="
echo "🎉 Image is ready for deployment!"
echo "=================================================="
