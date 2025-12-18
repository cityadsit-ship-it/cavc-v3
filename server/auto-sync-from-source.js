import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Auto-syncing modal data from ServicesData.js to services.json\n');

/**
 * Extract filename from various path formats:
 * - Vite import: billboardImages['/images/services/billboards/filename.webp']
 * - Fallback string: '/images/services/billboards/filename.webp'
 */
function extractFilename(pathString) {
  if (!pathString) return null;
  
  // Remove any leading/trailing quotes or brackets
  const cleaned = pathString.replace(/['"[\]]/g, '').trim();
  
  // Extract just the filename from the path
  const parts = cleaned.split('/');
  const filename = parts[parts.length - 1];
  
  // Remove _photo suffix if present (source uses _photo.webp, target just uses .webp)
  return filename.replace('_photo.webp', '.webp');
}

/**
 * Parse ServicesData.js to extract modal data
 */
async function parseServicesDataJS() {
  const sourceFile = path.join(__dirname, '..', 'src', 'components', 'ServicesData.js');
  const content = await fs.readFile(sourceFile, 'utf8');
  
  console.log('📖 Reading ServicesData.js...');
  
  // Extract the serviceData array - find it between 'export const serviceData = [' and the closing '];'
  const serviceDataMatch = content.match(/export const serviceData = \[([\s\S]*?)\n\];/);
  if (!serviceDataMatch) {
    throw new Error('Could not find serviceData export in ServicesData.js');
  }
  
  const serviceDataText = serviceDataMatch[1];
  
  // Parse each service object
  const services = [];
  
  // Split by service objects (each starts with '  {' and has an id, folder, etc.)
  const serviceRegex = /\{\s*id:\s*(\d+),\s*folder:\s*['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = serviceRegex.exec(serviceDataText)) !== null) {
    const serviceId = parseInt(match[1]);
    const folder = match[2];
    const serviceStartIndex = match.index;
    
    // Find the end of this service object (the next service or end of array)
    const nextServiceMatch = serviceRegex.exec(serviceDataText);
    const serviceEndIndex = nextServiceMatch ? nextServiceMatch.index : serviceDataText.length;
    serviceRegex.lastIndex = nextServiceMatch ? nextServiceMatch.index : serviceDataText.length;
    
    const serviceText = serviceDataText.substring(serviceStartIndex, serviceEndIndex);
    
    // Extract galleryItems array
    const galleryItemsMatch = serviceText.match(/galleryItems:\s*\[([\s\S]*?)\n\s*\],/);
    if (!galleryItemsMatch) {
      console.log(`⚠️  No galleryItems found for ${folder}, skipping`);
      continue;
    }
    
    const galleryItemsText = galleryItemsMatch[1];
    
    // Parse individual gallery items
    const galleryItems = [];
    
    // Match each gallery item object
    const itemRegex = /\{[\s\S]*?webp:[\s\S]*?jpg:[\s\S]*?modalDescription:[\s\S]*?\}/g;
    let itemMatch;
    
    while ((itemMatch = itemRegex.exec(galleryItemsText)) !== null) {
      const itemText = itemMatch[0];
      
      // Extract webp path (handles both import and string formats)
      const webpMatch = itemText.match(/webp:\s*(?:billboardImages|bannerImages|ledImages|transitImages|pillarImages|signageImages)\s*\[\s*['"]([^'"]+)['"]\s*\]\s*\|\|\s*['"]([^'"]+)['"]/);
      let webpPath = null;
      if (webpMatch) {
        webpPath = webpMatch[1] || webpMatch[2];
      } else {
        const simpleWebpMatch = itemText.match(/webp:\s*['"]([^'"]+)['"]/);
        if (simpleWebpMatch) {
          webpPath = simpleWebpMatch[1];
        }
      }
      
      // Extract modalDescription
      const modalDescMatch = itemText.match(/modalDescription:\s*['"]([^'"]+)['"]/);
      const modalDescription = modalDescMatch ? modalDescMatch[1] : null;
      
      // Extract modalDetails object
      const modalDetailsMatch = itemText.match(/modalDetails:\s*\{([\s\S]*?)\}/);
      let modalDetails = null;
      
      if (modalDetailsMatch) {
        const detailsText = modalDetailsMatch[1];
        modalDetails = {};
        
        // Parse key-value pairs in modalDetails
        const detailRegex = /['"]([^'"]+)['"]\s*:\s*['"]([^'"]*)['"]/g;
        let detailMatch;
        
        while ((detailMatch = detailRegex.exec(detailsText)) !== null) {
          modalDetails[detailMatch[1]] = detailMatch[2];
        }
      }
      
      if (webpPath && modalDescription) {
        const filename = extractFilename(webpPath);
        galleryItems.push({
          filename,
          modalDescription,
          modalDetails
        });
      }
    }
    
    if (galleryItems.length > 0) {
      services.push({
        id: serviceId,
        folder,
        galleryItems
      });
      console.log(`✓ Parsed ${folder}: ${galleryItems.length} items`);
    }
  }
  
  return services;
}

/**
 * Update services.json with modal data
 */
async function updateServicesJSON(parsedData) {
  const servicesJsonPath = path.join(__dirname, 'data', 'services.json');
  
  console.log('\n📝 Reading services.json...');
  const jsonContent = await fs.readFile(servicesJsonPath, 'utf8');
  const servicesData = JSON.parse(jsonContent);
  
  let totalUpdated = 0;
  let totalSkipped = 0;
  
  // For each service in the parsed data
  for (const sourceService of parsedData) {
    const { folder, galleryItems: sourceItems } = sourceService;
    
    // Skip banners and pillars as requested
    if (folder === 'banners' || folder === 'pillars') {
      console.log(`⏭️  Skipping ${folder} (already has data)`);
      continue;
    }
    
    // Find matching service in services.json
    const targetService = servicesData.services.find(s => s.folder === folder);
    
    if (!targetService) {
      console.log(`⚠️  Service not found in services.json: ${folder}`);
      continue;
    }
    
    console.log(`\n🔧 Updating ${folder}...`);
    let serviceUpdated = 0;
    
    // For each gallery item in target
    for (const targetItem of targetService.galleryItems) {
      // Extract filename from imagePath
      const targetFilename = extractFilename(targetItem.imagePath);
      
      if (!targetFilename) {
        console.log(`  ⚠️  Could not extract filename from: ${targetItem.imagePath}`);
        continue;
      }
      
      // Find matching source item
      const sourceItem = sourceItems.find(si => si.filename === targetFilename);
      
      if (sourceItem) {
        // Update modal data
        targetItem.modalDescription = sourceItem.modalDescription;
        targetItem.modalDetails = sourceItem.modalDetails;
        serviceUpdated++;
        totalUpdated++;
      } else {
        console.log(`  ⚠️  No match found for: ${targetFilename}`);
        totalSkipped++;
      }
    }
    
    console.log(`  ✓ Updated ${serviceUpdated}/${targetService.galleryItems.length} items`);
  }
  
  // Write updated data back to file
  console.log('\n💾 Writing updated services.json...');
  await fs.writeFile(servicesJsonPath, JSON.stringify(servicesData, null, 2), 'utf8');
  
  console.log('\n✅ Sync complete!');
  console.log(`   Updated: ${totalUpdated} items`);
  console.log(`   Skipped: ${totalSkipped} items`);
  console.log('\n📊 Summary:');
  
  // Print summary by service
  for (const service of servicesData.services) {
    const withModal = service.galleryItems.filter(item => item.modalDescription).length;
    const total = service.galleryItems.length;
    const icon = withModal === total ? '✅' : withModal > 0 ? '⚠️' : '❌';
    console.log(`   ${icon} ${service.folder}: ${withModal}/${total} items with modal data`);
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    const parsedData = await parseServicesDataJS();
    
    console.log(`\n📦 Total services parsed: ${parsedData.length}`);
    console.log(`   Services: ${parsedData.map(s => s.folder).join(', ')}`);
    
    await updateServicesJSON(parsedData);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
