const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const imagesToOptimize = [
  {
    input: 'public/images/services/mice.webp',
    maxWidth: 800,  // Adjust based on your layout needs
    quality: 80
  },
  {
    input: 'public/images/destinations/dubai.webp',
    maxWidth: 600,
    quality: 80
  },
  {
    input: 'public/images/tours/noravank.webp',
    maxWidth: 600,
    quality: 80
  },
  {
    input: 'public/images/tours/garni.webp',
    maxWidth: 600,
    quality: 80
  },
  {
    input: 'public/images/tours/lake-sevan.webp',
    maxWidth: 600,
    quality: 80
  }
];

async function optimizeImage(imageConfig) {
  try {
    const inputPath = path.join(process.cwd(), imageConfig.input);
    const originalSize = (await fs.stat(inputPath)).size;
    
    // Create backup
    await fs.copyFile(inputPath, `${inputPath}.backup`);
    
    // Optimize image
    await sharp(inputPath)
      .resize({
        width: imageConfig.maxWidth,
        height: undefined,
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: imageConfig.quality })
      .toFile(`${inputPath}.temp`);
    
    // Get optimized size
    const optimizedSize = (await fs.stat(`${inputPath}.temp`)).size;
    
    // Replace original with optimized
    await fs.unlink(inputPath);
    await fs.rename(`${inputPath}.temp`, inputPath);
    
    console.log(`Optimized ${imageConfig.input}:`);
    console.log(`  Original size: ${(originalSize / 1024).toFixed(2)}KB`);
    console.log(`  Optimized size: ${(optimizedSize / 1024).toFixed(2)}KB`);
    console.log(`  Saved: ${((originalSize - optimizedSize) / 1024).toFixed(2)}KB\n`);
  } catch (error) {
    console.error(`Error optimizing ${imageConfig.input}:`, error);
  }
}

async function optimizeAll() {
  console.log('Starting image optimization...\n');
  
  for (const imageConfig of imagesToOptimize) {
    await optimizeImage(imageConfig);
  }
  
  console.log('Image optimization complete!');
}

optimizeAll().catch(console.error);
