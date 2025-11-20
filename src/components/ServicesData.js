const SERVICES_IMAGE_BASE = '/images/services';

// Try multiple possible paths
const imageModules = import.meta.glob([
  '/images/services/**/*.jpg',
  '/images/services/**/*.jpeg',
  '/images/services/**/*.png',
  '../public/images/services/**/*.jpg',
  '../public/images/services/**/*.jpeg',
  '../public/images/services/**/*.png',
  '../../public/images/services/**/*.jpg',
  '../../public/images/services/**/*.jpeg',
  '../../public/images/services/**/*.png',
], {
  eager: true,
  query: '?url',
  import: 'default',
});

console.log('🔍 All image modules:', imageModules);
console.log('🔍 Paths:', Object.keys(imageModules));
console.log('🔍 Total modules found:', Object.keys(imageModules).length);

// Helper to get images for a specific folder
const getImagesForFolder = (folder) => {
  console.log(`\n🔎 Looking for images in folder: ${folder}`);
  
  const images = Object.entries(imageModules)
    .filter(([path]) => {
      // Match any path that contains the folder name and ends with image extension
      const patterns = [
        new RegExp(`/images/services/${folder}/[^/]+\\.(jpg|jpeg|png)$`, 'i'),
        new RegExp(`/public/images/services/${folder}/[^/]+\\.(jpg|jpeg|png)$`, 'i'),
      ];
      const matches = patterns.some(pattern => pattern.test(path));
      console.log(`  Path: ${path} - Matches: ${matches}`);
      return matches;
    })
    .map(([path, url]) => {
      const filename = path.split('/').pop();
      console.log(`  ✅ Found: ${filename} -> ${url}`);
      return {
        filename,
        url: url,
        isMain: filename.toLowerCase() === 'main.jpg',
      };
    })
    .sort((a, b) => {
      if (a.isMain) return -1;
      if (b.isMain) return 1;
      // Try to extract numbers from filename, if no number, use filename alphabetically
      const numA = parseInt(a.filename.match(/\d+/)?.[0] || '999');
      const numB = parseInt(b.filename.match(/\d+/)?.[0] || '999');
      if (numA !== numB) return numA - numB;
      // If numbers are same or both don't have numbers, sort alphabetically
      return a.filename.localeCompare(b.filename);
    });

  console.log(`📁 Total images for ${folder}:`, images.length);
  console.log(`📁 Image list:`, images.map(i => i.filename));
  return images;
};

// Helper to generate gallery from discovered images
const generateGalleryFromImages = (folder, captions = []) => {
  const images = getImagesForFolder(folder);

  return images
    .filter((img) => !img.isMain)
    .map((img, idx) => ({
      url: img.url,
      caption: captions[idx] || `${folder} - ${img.filename}`,
    }));
};

// Service definitions - galleryCount now auto-detected from actual files
export const serviceData = [
  {
    id: 1,
    folder: 'banners',
    title: 'Banners and Streamers',
    description:
      'Banners are mounted on either lamp post or streets signs along major and secondary roads.',
    adSize: '2ft x 6ft',
    material: 'Tarpaulin',
    location: 'Metro Manila (Key Roads)',
    captions: [
      'Banner on lamp post',
      'Streamer installation',
      'Street signage banners',
      'High visibility banners',
    ],
  },
  {
    id: 2,
    folder: 'pillars',
    title: 'Pillar Ads',
    description:
      'Pillar ads are advertisements placed on vertical columns or pillars that support public infrastructure, located where people often stand or pass by for visibility.',
    adSize: 'Custom',
    material: 'Sticker/Vinyl',
    location: 'High-traffic Areas',
    captions: [
      'Pillar ad in MRT station',
      'Column wrap advertising',
      'Branded pillar graphics',
    ],
  },
  {
    id: 3,
    folder: 'billboards',
    title: 'Billboards',
    description:
      'Billboards are large outdoor advertising structures typically located in high-traffic areas like highways or urban centers, designed to capture attention with bold graphics and concise messages.',
    adSize: '20ft x 40ft',
    material: 'Tarpaulin',
    location: 'Highways & Urban Centers',
    captions: [
      'Highway billboard',
      'Urban billboard',
      'Night billboard lighting',
      'Large format graphics',
      'Billboard installation',
      'Brand exposure billboard',
    ],
  },
  {
    id: 4,
    folder: 'leds',
    title: 'LED Display',
    description:
      'LED video billboards offer greater flexibility of use than what conventional billboards could ever provide.',
    adSize: 'Varies',
    material: 'LED Panel',
    location: 'Prime Locations',
    captions: [
      'LED billboard at night',
      'Dynamic LED display',
      'Flexible content LED',
      'High brightness LED',
      'LED installation',
    ],
  },
  {
    id: 5,
    folder: 'transits',
    title: 'Transit Ads',
    description:
      'Transit ads are advertisements placed on or inside public transportation vehicles and transit stations.',
    adSize: 'Custom',
    material: 'Sticker/Vinyl',
    location: 'Public Transport',
    captions: [
      'Bus wrap ad',
      'Train interior ad',
      'Station poster',
      'Taxi sticker ad',
    ],
  },
  {
    id: 6,
    folder: 'signages',
    title: 'Directional Signage',
    description:
      'Directional signage is placed in strategic locations, such as sidewalks, entrances, and high-traffic zones, featuring arrows, logos, or catchy slogans to attract foot traffic.',
    adSize: '2ft x 3ft',
    material: 'Acrylic/Metal',
    location: 'Strategic Points',
    captions: [
      'Sidewalk signage',
      'Entrance directional sign',
      'High-traffic zone signage',
    ],
  },
].map((service) => {
  const images = getImagesForFolder(service.folder);
  const mainImage = images.find((img) => img.isMain);
  const gallery = generateGalleryFromImages(service.folder, service.captions);

  console.log(`📊 Service ${service.folder}: ${gallery.length} gallery images + 1 main = ${gallery.length + 1} total`);

  return {
    ...service,
    mainImage: mainImage?.url || `${SERVICES_IMAGE_BASE}/${service.folder}/main.jpg`,
    gallery,
    galleryCount: gallery.length,
    imageCount: gallery.length + 1,
  };
});

// Helper to build full gallery including main image
export const buildGallery = (service) => [
  { url: service.mainImage, caption: 'Main Image' },
  ...service.gallery,
];

// CRUD helpers for future use
export const addImageToService = (serviceId, imageUrl, caption) => {
  const service = serviceData.find((s) => s.id === serviceId);
  if (service) {
    service.gallery.push({ url: imageUrl, caption });
    service.imageCount = service.gallery.length + 1;
    service.galleryCount = service.gallery.length;
  }
  return service;
};

export const removeImageFromService = (serviceId, imageIndex) => {
  const service = serviceData.find((s) => s.id === serviceId);
  if (service && service.gallery[imageIndex]) {
    service.gallery.splice(imageIndex, 1);
    service.imageCount = service.gallery.length + 1;
    service.galleryCount = service.gallery.length;
  }
  return service;
};

export const updateServiceImage = (serviceId, imageIndex, newUrl, newCaption) => {
  const service = serviceData.find((s) => s.id === serviceId);
  if (service && service.gallery[imageIndex]) {
    service.gallery[imageIndex] = {
      url: newUrl || service.gallery[imageIndex].url,
      caption: newCaption || service.gallery[imageIndex].caption,
    };
  }
  return service;
};
