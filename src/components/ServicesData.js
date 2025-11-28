const SERVICES_IMAGE_BASE = '/images/services';
const SERVICES_PDF_BASE = '/pdfs/services';

// Only use direct paths - public directory is served at root
const imageModules = import.meta.glob([
  '/images/services/**/*.jpg',
  '/images/services/**/*.jpeg',
  '/images/services/**/*.png',
  '/images/services/**/*.webp',
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
      // Only match direct /images/services/ paths (no /public/ prefix)
      const pattern = new RegExp(`^/images/services/${folder}/[^/]+\\.(jpg|jpeg|png|webp)$`, 'i');
      const matches = pattern.test(path);
      console.log(`  Path: ${path} - Matches: ${matches}`);
      return matches;
    })
    .map(([path, url]) => {
      const filename = path.split('/').pop();
      // Detect main.* across common extensions
      const isMain = /^main\.(jpg|jpeg|png|webp)$/i.test(filename);
      return {
        filename,
        url,
        isMain,
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
    .filter((img) => /\.webp$/i.test(img.filename)) // only webp in modal/thumbnail
    .map((img, idx) => ({
      url: img.url,
      caption: captions?.[idx] || `${folder} - ${img.filename}`,
    }));
};

// Import specific banner images - only direct paths, now using /banners/ subfolder
const bannerImages = import.meta.glob([
  '/images/services/banners/FB*.webp',
  '/images/services/banners/Walking*.webp',
  '/images/services/banners/zAcross*.webp',
], {
  eager: true,
  query: '?url',
  import: 'default',
});

console.log('🎯 Banner images found:', bannerImages);
console.log('🎯 Banner image keys:', Object.keys(bannerImages));

// Import specific signage images - only direct paths, using /signages/ subfolder
const signageImages = import.meta.glob([
  '/images/services/signages/FB*.webp',
], {
  eager: true,
  query: '?url',
  import: 'default',
});

console.log('🎯 Signage images found:', signageImages);
console.log('🎯 Signage image keys:', Object.keys(signageImages));

// Service definitions - galleryCount now auto-detected from actual files
export const serviceData = [
  {
    id: 1,
    folder: 'banners',
    title: 'Banners and Streamers',
    description: 'Banners are mounted on either lamp post or streets signs along major and secondary roads.',
    // Gallery images with individual modal data
    galleryItems: [
      {
        webp: bannerImages['/images/services/banners/FB Page1_LPB_photo.webp'] || '/images/services/banners/FB Page1_LPB_photo.webp',
        jpg: '/images/services/banners/FB Page1_LPB.jpg',
        modalDescription: 'LAMP POST BANNERS',
        standardSize: '3ft(w) x 9ft(h)',
        locations: 'Ortigas Center, Pasig, MOA, Pasay, Manila, Mandaluyong, Muntinlupa, Malabon, Caloocan, Rizal, Cavite, Cavitex, Bacolod, Bulacan, CDO, Laguna, Ilo-ilo, Cebu, and other provinces',
      },
      {
        webp: bannerImages['/images/services/banners/FB Page1_Ortigas Center banners_photo.webp'] || '/images/services/banners/FB Page1_Ortigas Center banners_photo.webp',
        jpg: '/images/services/banners/FB Page1_Ortigas Center banners.jpg',
        modalDescription: 'ORTIGAS CENTER LAMP POST BANNERS',
        adSize: '3ft(w) x 9ft(h)',
        adType: 'Lighted and regular banners',
        location: 'Ortigas Center, Pasig City',
      },
      {
        webp: bannerImages['/images/services/banners/FB Page1_Ortigas Center lighted banners_photo.webp'] || '/images/services/banners/FB Page1_Ortigas Center lighted banners_photo.webp',
        jpg: '/images/services/banners/FB Page1_Ortigas Center lighted banners.jpg',
        modalDescription: 'ORTIGAS CENTER LIGHTED BANNERS',
        adSize: '3ft(w) x 9ft(h)',
        adType: 'Lighted banners',
        location: 'San Miguel Avenue, ADB Avenue, J Vargas Avenue, Ortigas Center, Pasig City',
      },
      {
        webp: bannerImages['/images/services/banners/Walking Banner Ad_photo.webp'] || '/images/services/banners/Walking Banner Ad_photo.webp',
        jpg: '/images/services/banners/Walking Banner Ad.jpg',
        modalDescription: 'WALKING BANNER AD',
        adSize: '1.6ft(w) x 4ft(h)',
        adType: 'Walking banner',
        location: "Client's requirement",
      },
      {
        webp: bannerImages['/images/services/banners/Walking LED Ad_photo.webp'] || '/images/services/banners/Walking LED Ad_photo.webp',
        jpg: '/images/services/banners/Walking LED Ad.jpg',
        modalDescription: 'WALKING LED AD',
        adSize: 'front: 23in(w) x 25in(h) | 23in(w) x 57in(h)',
        adType: 'Walking LED',
        location: "Client's requirement",
      },
      {
        webp: bannerImages['/images/services/banners/zAcross the street streamer_photo.webp'] || '/images/services/banners/zAcross the street streamer_photo.webp',
        jpg: '/images/services/banners/zAcross the street streamer.jpg',
        modalDescription: 'ACROSS THE STREET STREAMER',
        adSize: '12ft(w) x 4ft(h) / 15ft(w) x 4ft(h)',
        adType: 'Street streamer',
        location: "Client's requirement",
      },
    ],
    // Use first item as preview
    previewImage: bannerImages['/images/services/banners/FB Page1_LPB_photo.webp'] || '/images/services/banners/FB Page1_LPB_photo.webp',
    downloadFile: '/images/services/banners/FB Page1_LPB.jpg',
    downloadFileName: 'FB Page1_LPB.jpg',
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
    pdfFile: `${SERVICES_PDF_BASE}/pillar-ads-cavc.pdf`,
    pdfFileName: 'pillar-ads-cavc.pdf',
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
    pdfFile: `${SERVICES_PDF_BASE}/billboards-cavc.pdf`,
    pdfFileName: 'billboards-cavc.pdf',
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
    pdfFile: `${SERVICES_PDF_BASE}/led-displays-cavc.pdf`,
    pdfFileName: 'led-displays-cavc.pdf',
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
    pdfFile: `${SERVICES_PDF_BASE}/transit-ads.pdf`,
    pdfFileName: 'transit-ads.pdf',
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
    description: 'Directional signage is placed in strategic locations, such as sidewalks, entrances, and high-traffic zones, featuring arrows, logos, or catchy slogans to attract foot traffic.',
    // Gallery images with individual modal data
    galleryItems: [
      {
        webp: signageImages['/images/services/signages/FB Page1_Directional Sign_clamp directional_photo.webp'] || '/images/services/signages/FB Page1_Directional Sign_clamp directional_photo.webp',
        jpg: '/images/services/signages/FB Page1_Directional Sign_clamp directional.jpg',
        modalDescription: 'CLAMP DIRECTIONAL SIGN',
        adSize: '2ft(w) x 3ft(h)',
        location: "Client's requirement",
      },
      {
        webp: signageImages['/images/services/signages/FB Page1_Directional Sign_double pole_photo.webp'] || '/images/services/signages/FB Page1_Directional Sign_double pole_photo.webp',
        jpg: '/images/services/signages/FB Page1_Directional Sign_double pole.jpg',
        modalDescription: 'DOUBLE POLE DIRECTIONAL SIGN',
        adSize: '4ft(w) x 3ft(h), 6ft(w) x 4ft(h)',
        location: "Client's requirement",
      },
      {
        webp: signageImages['/images/services/signages/FB Page1_Directional Sign_single pole_photo.webp'] || '/images/services/signages/FB Page1_Directional Sign_single pole_photo.webp',
        jpg: '/images/services/signages/FB Page1_Directional Sign_single pole.jpg',
        modalDescription: 'SINGLE POLE DIRECTIONAL SIGN',
        adSize: '2ft(w) x 3ft(h), 3ft(w) x 4ft(h)',
        location: "Client's requirement",
      },
    ],
    // Use first item as preview
    previewImage: signageImages['/images/services/signages/FB Page1_Directional Sign_clamp directional_photo.webp'] || '/images/services/signages/FB Page1_Directional Sign_clamp directional_photo.webp',
    downloadFile: '/images/services/signages/FB Page1_Directional Sign_clamp directional.jpg',
    downloadFileName: 'FB Page1_Directional Sign_clamp directional.jpg',
  },
].map((service) => {
  // If service has galleryItems, use them instead of folder-based discovery
  if (service.galleryItems) {
    const gallery = service.galleryItems.map((item) => ({
      url: item.webp,
      downloadUrl: item.jpg,
      caption: item.modalDescription,
      modalDescription: item.modalDescription,
      adSize: item.adSize,
      adType: item.adType,
      location: item.location,
      standardSize: item.standardSize,
      locations: item.locations,
    }));

    console.log(`📊 Service ${service.folder}: ${gallery.length} gallery images (manual)`);
    console.log(`📷 Gallery items:`, gallery);
    console.log(`🖼️ First image URL:`, gallery[0]?.url);

    return {
      ...service,
      mainImage: service.previewImage || gallery[0]?.url,
      gallery,
      galleryCount: gallery.length,
      imageCount: gallery.length,
    };
  }

  // Otherwise use folder-based discovery
  const images = getImagesForFolder(service.folder);
  const mainImage = images.find((img) => img.isMain);
  const gallery = generateGalleryFromImages(service.folder, service.captions);

  console.log(`📊 Service ${service.folder}: ${gallery.length} gallery images + 1 main = ${gallery.length + 1} total`);

  return {
    ...service,
    mainImage: service.previewImage || mainImage?.url || `${SERVICES_IMAGE_BASE}/${service.folder}/main.jpg`,
    gallery,
    galleryCount: gallery.length,
    imageCount: gallery.length,
  };
});

// Helper to build full gallery including main image
export const buildGallery = (service) => [
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
