const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

// Define the images to download
const imagesToDownload = [
  {
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05',
    savePath: '../public/images/services/flights-professional.webp',
    refPath: '/images/services/flights-professional.webp',
    type: 'service'
  },
  {
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c',
    savePath: '../public/images/services/mice-professional.webp',
    refPath: '/images/services/mice-professional.webp',
    type: 'service'
  },
  {
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    savePath: '../public/images/team/team-member-1.webp',
    refPath: '/images/team/team-member-1.webp',
    type: 'team'
  },
  {
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    savePath: '../public/images/team/team-member-2.webp',
    refPath: '/images/team/team-member-2.webp',
    type: 'team'
  },
  {
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    savePath: '../public/images/team/team-member-3.webp',
    refPath: '/images/team/team-member-3.webp',
    type: 'team'
  }
];

// Function to download image and convert to WebP
async function downloadAndConvertToWebP(imageObj) {
  return new Promise((resolve, reject) => {
    const fullSavePath = path.join(__dirname, imageObj.savePath);
    const dir = path.dirname(fullSavePath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    console.log(`Downloading image from ${imageObj.url} to ${fullSavePath}...`);
    
    // Download image
    https.get(imageObj.url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          
          // Convert to WebP using sharp
          await sharp(buffer)
            .webp({ quality: 85 })
            .toFile(fullSavePath);
          
          console.log(`Successfully downloaded and converted to WebP: ${fullSavePath}`);
          resolve(imageObj);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Function to update service and about page references
async function updateReferences(downloadedImages) {
  try {
    // Update services page
    let servicesPagePath = path.join(__dirname, '../app/services/page.tsx');
    if (fs.existsSync(servicesPagePath)) {
      let content = fs.readFileSync(servicesPagePath, 'utf8');
      
      downloadedImages.forEach(img => {
        if (img.type === 'service') {
          // Replace the Unsplash URL with local path
          content = content.replace(new RegExp(`'${img.url}'`, 'g'), `'${img.refPath}'`);
        }
      });
      
      fs.writeFileSync(servicesPagePath, content);
      console.log('Updated services page image references');
    }
    
    // Update about page
    let aboutPagePath = path.join(__dirname, '../app/about/page.tsx');
    if (fs.existsSync(aboutPagePath)) {
      let content = fs.readFileSync(aboutPagePath, 'utf8');
      
      downloadedImages.forEach(img => {
        if (img.type === 'team') {
          // Replace the Unsplash URL with local path
          content = content.replace(new RegExp(`'${img.url}'`, 'g'), `'${img.refPath}'`);
        }
      });
      
      fs.writeFileSync(aboutPagePath, content);
      console.log('Updated about page image references');
    }
    
    // Download noise.png and convert to WebP
    if (!fs.existsSync(path.join(__dirname, '../public/noise.webp'))) {
      // Create a simple noise texture if there's no existing one
      await sharp({
        create: {
          width: 200,
          height: 200,
          channels: 4,
          background: { r: 128, g: 128, b: 128, alpha: 0.1 }
        }
      })
      .noise('gaussian', 0.5)
      .webp({ quality: 80 })
      .toFile(path.join(__dirname, '../public/noise.webp'));
      
      console.log('Created noise.webp texture');
      
      // Update footer.tsx
      let footerPath = path.join(__dirname, '../components/footer.tsx');
      if (fs.existsSync(footerPath)) {
        let content = fs.readFileSync(footerPath, 'utf8');
        content = content.replace("bg-[url('/noise.png')]", "bg-[url('/noise.webp')]");
        fs.writeFileSync(footerPath, content);
        console.log('Updated footer noise texture reference');
      }
    }
    
    console.log('All references updated successfully!');
  } catch (error) {
    console.error('Error updating references:', error);
  }
}

// Main function to download all images and update references
async function main() {
  try {
    console.log('Starting download of remaining external images...');
    
    const downloadPromises = imagesToDownload.map(img => downloadAndConvertToWebP(img));
    const downloadedImages = await Promise.all(downloadPromises);
    
    console.log('All images downloaded and converted to WebP');
    
    await updateReferences(downloadedImages);
    
    console.log('Process completed successfully!');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// Run the main function
main();
