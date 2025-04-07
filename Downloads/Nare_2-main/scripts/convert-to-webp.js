const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Base directory for images
const baseDir = path.join(__dirname, '..', 'public', 'images');

// Quality setting for WebP conversion (0-100)
const webpQuality = 80;

// Function to recursively get all files in a directory
function getAllFiles(dir) {
  const files = [];
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      files.push(...getAllFiles(itemPath));
    } else if (stats.isFile()) {
      files.push(itemPath);
    }
  }
  
  return files;
}

// Function to convert an image to WebP format
async function convertToWebP(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    // Only convert jpg/jpeg/png images
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      console.log(`Skipping non-image file: ${filePath}`);
      return false;
    }
    
    const newFilePath = filePath.replace(ext, '.webp');
    
    // Convert the image to WebP format
    await sharp(filePath)
      .webp({ quality: webpQuality })
      .toFile(newFilePath);
    
    console.log(`Converted: ${path.basename(filePath)} to WebP`);
    
    // Delete the original file
    fs.unlinkSync(filePath);
    console.log(`Deleted original: ${path.basename(filePath)}`);
    
    return true;
  } catch (error) {
    console.error(`Error converting ${filePath} to WebP:`, error.message);
    return false;
  }
}

// Main function to convert all images
async function convertAllImages() {
  // Get all files in the images directory
  const files = getAllFiles(baseDir);
  
  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  console.log(`Found ${files.length} files to process`);
  
  // Convert each image file to WebP
  for (const file of files) {
    try {
      const result = await convertToWebP(file);
      if (result) {
        successCount++;
      } else {
        skippedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\nConversion Summary:');
  console.log(`- ${successCount} images successfully converted to WebP`);
  console.log(`- ${skippedCount} files skipped (non-image files)`);
  console.log(`- ${errorCount} errors encountered`);
}

// Run the conversion process
convertAllImages()
  .then(() => {
    console.log('WebP conversion complete!');
  })
  .catch(error => {
    console.error('An error occurred during conversion:', error.message);
  });
