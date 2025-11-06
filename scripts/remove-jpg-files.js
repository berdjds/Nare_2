const fs = require('fs');
const path = require('path');

// Base directory for images
const baseDir = path.join(__dirname, '..', 'public', 'images');

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

// Function to check if a WebP version exists
function webpVersionExists(jpgPath) {
  const webpPath = jpgPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  return fs.existsSync(webpPath);
}

// Function to remove JPG files
function removeJpgFiles() {
  // Get all files in the images directory
  const files = getAllFiles(baseDir);
  
  let removedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  console.log(`Found ${files.length} files to process`);
  
  // Process each file
  for (const file of files) {
    // Check if it's a JPG or PNG file
    if (/\.(jpg|jpeg|png)$/i.test(file)) {
      try {
        // Check if a WebP version exists
        if (webpVersionExists(file)) {
          // Remove the JPG file
          fs.unlinkSync(file);
          console.log(`Removed: ${path.relative(baseDir, file)}`);
          removedCount++;
        } else {
          console.log(`Skipped: ${path.relative(baseDir, file)} (no WebP version found)`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`Error removing ${file}:`, error.message);
        errorCount++;
      }
    } else {
      // Skip non-image files
      skippedCount++;
    }
  }
  
  // Summary
  console.log('\nRemoval Summary:');
  console.log(`- ${removedCount} JPG/PNG files removed`);
  console.log(`- ${skippedCount} files skipped`);
  console.log(`- ${errorCount} errors encountered`);
}

// Run the removal process
console.log('Starting to remove JPG/PNG files that have WebP versions...');
removeJpgFiles();
console.log('Process complete!');
