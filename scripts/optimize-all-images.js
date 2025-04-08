const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { promisify } = require('util');
const glob = promisify(require('glob'));

// Configuration for different image types
const imageConfigs = {
  'hero': {
    maxWidth: 1920,
    quality: 85
  },
  'destinations': {
    maxWidth: 800,
    quality: 80
  },
  'tours': {
    maxWidth: 800,
    quality: 80
  },
  'services': {
    maxWidth: 800,
    quality: 80
  },
  'team': {
    maxWidth: 400,
    quality: 85
  },
  'cultural': {
    maxWidth: 800,
    quality: 80
  },
  'adventure': {
    maxWidth: 800,
    quality: 80
  },
  'tickets': {
    maxWidth: 600,
    quality: 80
  },
  // Default configuration for any other images
  'default': {
    maxWidth: 800,
    quality: 80
  }
};

async function getFileSize(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size;
}

async function optimizeImage(imagePath) {
  try {
    // Determine the category from the path
    const category = imagePath.split(path.sep)[2] || 'default';
    const config = imageConfigs[category] || imageConfigs.default;
    
    const inputPath = path.join(process.cwd(), imagePath);
    const originalSize = await getFileSize(inputPath);
    
    // Skip if file is already small enough (less than 50KB)
    if (originalSize < 50 * 1024) {
      console.log(`Skipping ${imagePath} - already optimized (${(originalSize / 1024).toFixed(2)}KB)`);
      return;
    }
    
    // Create backup
    const backupPath = `${inputPath}.backup`;
    if (!(await fs.access(backupPath).catch(() => true))) {
      console.log(`Backup exists for ${imagePath}, skipping...`);
      return;
    }
    await fs.copyFile(inputPath, backupPath);
    
    // Get image dimensions
    const metadata = await sharp(inputPath).metadata();
    
    // Only resize if the image is larger than maxWidth
    const shouldResize = metadata.width > config.maxWidth;
    
    let pipeline = sharp(inputPath);
    if (shouldResize) {
      pipeline = pipeline.resize({
        width: config.maxWidth,
        height: undefined,
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    // Optimize
    await pipeline
      .webp({ quality: config.quality })
      .toFile(`${inputPath}.temp`);
    
    // Get optimized size
    const optimizedSize = await getFileSize(`${inputPath}.temp`);
    
    // Only replace if we achieved significant optimization (>10% reduction)
    if (optimizedSize < originalSize * 0.9) {
      await fs.unlink(inputPath);
      await fs.rename(`${inputPath}.temp`, inputPath);
      
      console.log(`Optimized ${imagePath}:`);
      console.log(`  Original size: ${(originalSize / 1024).toFixed(2)}KB`);
      console.log(`  Optimized size: ${(optimizedSize / 1024).toFixed(2)}KB`);
      console.log(`  Saved: ${((originalSize - optimizedSize) / 1024).toFixed(2)}KB`);
      if (shouldResize) {
        console.log(`  Resized from ${metadata.width}x${metadata.height} to ${config.maxWidth}x${Math.round(metadata.height * (config.maxWidth / metadata.width))}`);
      }
      console.log();
    } else {
      await fs.unlink(`${inputPath}.temp`);
      await fs.unlink(backupPath);
      console.log(`Skipping ${imagePath} - optimization not significant enough\n`);
    }
  } catch (error) {
    console.error(`Error optimizing ${imagePath}:`, error);
  }
}

async function optimizeAll() {
  console.log('Starting image optimization...\n');
  
  // Find all image files
  const images = await glob('public/images/**/*.webp');
  
  // Sort images by size (largest first)
  const imagesWithSize = await Promise.all(
    images.map(async (image) => ({
      path: image,
      size: await getFileSize(image)
    }))
  );
  
  imagesWithSize.sort((a, b) => b.size - a.size);
  
  // Process images
  for (const { path: imagePath, size } of imagesWithSize) {
    console.log(`Processing ${imagePath} (${(size / 1024).toFixed(2)}KB)...`);
    await optimizeImage(imagePath);
  }
  
  console.log('Image optimization complete!');
}

optimizeAll().catch(console.error);
