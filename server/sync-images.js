import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICES_DATA_PATH = path.join(__dirname, 'data/services.json');
const IMAGES_BASE_PATH = path.join(__dirname, '../public/images/services');

// Service folder mapping
const serviceFolders = {
  banners: 1,
  pillars: 2,
  billboards: 3,
  leds: 4,
  signages: 5,
  transits: 6,
};

// Function to get all images from a folder
async function getImagesFromFolder(folderName) {
  const folderPath = path.join(IMAGES_BASE_PATH, folderName);
  
  try {
    const files = await fs.readdir(folderPath);
    const imageFiles = files.filter(file => 
      /\.(webp|jpg|jpeg|png)$/i.test(file) && file.includes('_photo')
    );
    
    return imageFiles.sort();
  } catch (error) {
    console.error(`Error reading folder ${folderName}:`, error.message);
    return [];
  }
}

// Function to create gallery item from filename
function createGalleryItem(folderName, filename) {
  const webpPath = `/images/services/${folderName}/${filename}`;
  const jpgFilename = filename.replace('_photo.webp', '.jpg');
  const jpgPath = `/images/services/${folderName}/${jpgFilename}`;
  
  // Extract description from filename
  const description = filename
    .replace('_photo.webp', '')
    .replace(/^\d+_/, '') // Remove leading numbers
    .replace(/^FB Page1_/, '')
    .replace(/_/g, ' ')
    .toUpperCase();
  
  return {
    imagePath: webpPath,
    jpgPath: jpgPath,
    modalDescription: description,
    modalDetails: {
      "Ad Size": "",
      "Location": "",
      "Landmarks": ""
    }
  };
}

// Main sync function
async function syncImages() {
  console.log('🔄 Starting image sync...\n');
  
  try {
    // Read current services data
    const data = JSON.parse(await fs.readFile(SERVICES_DATA_PATH, 'utf-8'));
    
    // Process each service folder
    for (const [folderName, serviceId] of Object.entries(serviceFolders)) {
      console.log(`📁 Processing ${folderName}...`);
      
      // Find the service
      const service = data.services.find(s => s.id === serviceId);
      if (!service) {
        console.log(`   ⚠️  Service not found for ${folderName}`);
        continue;
      }
      
      // Get existing gallery items
      const existingPaths = new Set(
        (service.galleryItems || []).map(item => item.imagePath)
      );
      
      // Get all images from folder
      const images = await getImagesFromFolder(folderName);
      console.log(`   Found ${images.length} images`);
      
      // Add new images
      let addedCount = 0;
      for (const image of images) {
        const imagePath = `/images/services/${folderName}/${image}`;
        if (!existingPaths.has(imagePath)) {
          const galleryItem = createGalleryItem(folderName, image);
          service.galleryItems = service.galleryItems || [];
          service.galleryItems.push(galleryItem);
          addedCount++;
        }
      }
      
      console.log(`   ✅ Added ${addedCount} new images`);
      console.log(`   📊 Total gallery items: ${service.galleryItems?.length || 0}\n`);
    }
    
    // Write updated data back to file
    await fs.writeFile(
      SERVICES_DATA_PATH,
      JSON.stringify(data, null, 2),
      'utf-8'
    );
    
    console.log('✨ Sync completed successfully!\n');
    
    // Print summary
    console.log('📊 Summary:');
    data.services.forEach(service => {
      console.log(`   ${service.title}: ${service.galleryItems?.length || 0} images`);
    });
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

// Run the sync
syncImages();
