import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Original data structure from ServicesData.js
const servicesDataFromSource = [
  {
    id: 1,
    folder: 'banners',
    title: 'Banners, Lighted Box and Streamers',
    description: 'Banners are mounted on either lamp post or streets signs along major and secondary roads.',
    pdfFileName: 'banner-cavc.pdf',
  },
  {
    id: 2,
    folder: 'pillars',
    title: 'Pillar Ads',
    description: 'Pillar ads are advertisements placed on vertical columns or pillars that support public infrastructure, located where people often stand or pass by for visibility.',
    pdfFileName: 'pillar-ads-cavc.pdf',
  },
  {
    id: 3,
    folder: 'billboards',
    title: 'Billboards',
    description: 'Billboards are large outdoor advertising structures typically located in high-traffic areas like highways or urban centers, designed to capture attention with bold graphics and concise messages.',
    pdfFileName: 'billboard-cavc.pdf',
  },
  {
    id: 4,
    folder: 'leds',
    title: 'LED Display',
    description: 'LED displays are digital advertising screens that showcase dynamic content through light-emitting diodes, allowing for vibrant, animated, and easily updatable advertisements.',
    pdfFileName: 'led-display-cavc.pdf',
  },
  {
    id: 5,
    folder: 'transits',
    title: 'Transit Ads',
    description: 'Transit advertising refers to ads placed on or inside public transportation vehicles and stations, reaching commuters and travelers.',
    pdfFileName: 'transit-ads-cavc.pdf',
  },
  {
    id: 6,
    folder: 'signages',
    title: 'Directional Signage',
    description: 'Directional signage helps guide people to specific locations, often used in malls, buildings, and public spaces for wayfinding.',
    pdfFileName: 'directional-signage-cavc.pdf',
  },
];

async function fixServicesData() {
  console.log('🔧 Starting comprehensive data fix...\n');

  const servicesJsonPath = path.join(__dirname, 'data', 'services.json');
  
  try {
    // Read current services.json
    const data = await fs.readFile(servicesJsonPath, 'utf8');
    const servicesData = JSON.parse(data);
    
    console.log(`📊 Current services count: ${servicesData.services.length}`);
    
    // Create a map of current services by folder for easy lookup
    const currentServicesMap = new Map();
    servicesData.services.forEach(service => {
      currentServicesMap.set(service.folder, service);
    });
    
    // Fix each service to match ServicesData.js order and structure
    const fixedServices = servicesDataFromSource.map(sourceService => {
      const currentService = currentServicesMap.get(sourceService.folder);
      
      if (!currentService) {
        console.log(`⚠️  Service not found: ${sourceService.title}`);
        return {
          ...sourceService,
          galleryItems: [],
        };
      }
      
      console.log(`✅ Fixing: ${sourceService.title}`);
      console.log(`   - Gallery items: ${currentService.galleryItems?.length || 0}`);
      
      // Keep gallery items but ensure structure is correct
      const galleryItems = (currentService.galleryItems || []).map(item => ({
        imagePath: item.imagePath,
        jpgPath: item.jpgPath,
        modalDescription: item.modalDescription || '',
        modalDetails: item.modalDetails || {},
      }));
      
      return {
        id: sourceService.id,
        folder: sourceService.folder,
        title: sourceService.title,
        description: sourceService.description,
        pdfFileName: sourceService.pdfFileName,
        galleryItems,
      };
    });
    
    // Write updated data
    const updatedData = {
      services: fixedServices,
    };
    
    await fs.writeFile(
      servicesJsonPath,
      JSON.stringify(updatedData, null, 2),
      'utf8'
    );
    
    console.log('\n✅ Services data fixed successfully!');
    console.log('\n📋 Summary:');
    fixedServices.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title} (${service.galleryItems.length} images)`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing services data:', error);
    process.exit(1);
  }
}

fixServicesData();
