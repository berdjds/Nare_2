const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Base directory for images
const baseDir = path.join(__dirname, '..', 'public', 'images');
const imagesFilePath = path.join(__dirname, '..', 'lib', 'images.ts');

// Quality setting for WebP conversion (0-100)
const webpQuality = 85;

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
      return { success: false, reason: 'not-image', webpPath: null };
    }
    
    const newFilePath = filePath.replace(ext, '.webp');
    
    // Convert the image to WebP format
    await sharp(filePath)
      .webp({ quality: webpQuality })
      .toFile(newFilePath);
    
    console.log(`Converted: ${path.basename(filePath)} to WebP`);
    
    // Don't delete the original file to avoid permission issues
    // Instead, we'll just have both formats available
    
    return { success: true, reason: 'converted', webpPath: newFilePath };
  } catch (error) {
    console.error(`Error converting ${filePath} to WebP:`, error.message);
    return { success: false, reason: 'error', webpPath: null, error: error.message };
  }
}

// Function to update the images.ts file to use WebP
function updateImagesFile(conversions) {
  try {
    // Read the images.ts file
    let imagesContent = fs.readFileSync(imagesFilePath, 'utf8');
    
    // For each successful conversion, update the file extensions
    for (const [originalPath, result] of Object.entries(conversions)) {
      if (result.success) {
        const relativeOriginalPath = '/' + path.relative(path.join(__dirname, '..', 'public'), originalPath).replace(/\\/g, '/');
        const relativeWebpPath = relativeOriginalPath.replace(/\.(?:jpg|jpeg|png)$/i, '.webp');
        
        // Replace the reference in the images.ts file
        const regex = new RegExp(`"${relativeOriginalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
        imagesContent = imagesContent.replace(regex, `"${relativeWebpPath}"`);
      }
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(imagesFilePath, imagesContent);
    console.log('Updated images.ts file to use WebP images');
    
    return true;
  } catch (error) {
    console.error('Error updating images.ts file:', error.message);
    return false;
  }
}

// Main function to convert all images
async function convertAllImages() {
  // Get all files in the images directory
  const files = getAllFiles(baseDir);
  
  let conversions = {};
  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  console.log(`Found ${files.length} files to process`);
  
  // Convert each image file to WebP
  for (const file of files) {
    try {
      const result = await convertToWebP(file);
      conversions[file] = result;
      
      if (result.success) {
        successCount++;
      } else if (result.reason === 'not-image') {
        skippedCount++;
      } else {
        errorCount++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
      conversions[file] = { success: false, reason: 'error', webpPath: null, error: error.message };
      errorCount++;
    }
  }
  
  console.log('\nConversion Summary:');
  console.log(`- ${successCount} images successfully converted to WebP`);
  console.log(`- ${skippedCount} files skipped (non-image files)`);
  console.log(`- ${errorCount} errors encountered`);
  
  // Update the images.ts file if there were successful conversions
  if (successCount > 0) {
    const updated = updateImagesFile(conversions);
    if (updated) {
      console.log('Successfully updated images.ts file');
    } else {
      console.log('Failed to update images.ts file');
    }
  }
}

// Run the conversion process
convertAllImages()
  .then(() => {
    console.log('WebP conversion complete!');
  })
  .catch(error => {
    console.error('An error occurred during conversion:', error.message);
  });
