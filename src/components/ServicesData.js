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

// Import specific LED images - only direct paths, using /leds/ subfolder
const ledImages = import.meta.glob([
  '/images/services/leds/01_FB Page1_EDSA Highway 54 LED_photo.webp',
  '/images/services/leds/02_FB Page1_EDSA - P Tuazon LED_photo.webp',
  '/images/services/leds/03_FB Page1_EDSA Cubao LED NB_photo.webp',
  '/images/services/leds/04_FB Page1_EDSA Cubao LED SB_photo.webp',
  '/images/services/leds/07_FB Page1_LRT TV Monitor_photo.webp',
  '/images/services/leds/08_FB Page1_Baguio LED billboard_photo.webp',
  '/images/services/leds/FB Page1_EDSA Buendia Gantry NB_photo.webp',
  '/images/services/leds/FB Page1_EDSA Buendia Gantry SB_photo.webp',
  '/images/services/leds/FB Page1_EDSA Gantry generic_photo.webp',
  '/images/services/leds/FB Page1_EDSA Guadix Gantry NB_photo.webp',
  '/images/services/leds/FB Page1_EDSA Main Avenue Gantry NB_photo.webp',
  '/images/services/leds/FB Page1_EDSA Main Avenue Gantry SB_photo.webp',
  '/images/services/leds/FB Page1_EDSA Megamall Gantry SB_photo.webp',
  '/images/services/leds/FB Page1_EDSA Munoz Gantry SB_photo.webp',
  '/images/services/leds/FB Page1_EDSA Quezon Ave Gantry NB_photo.webp',
  '/images/services/leds/FB Page1_EDSA Quezon Ave Gantry SB_photo.webp',
], {
  eager: true,
  query: '?url',
  import: 'default',
});

console.log('🎯 LED images found:', ledImages);
console.log('🎯 LED image keys:', Object.keys(ledImages));

// Import specific pillar images - only direct paths, using /pillars/ subfolder
const pillarImages = import.meta.glob([
  '/images/services/pillars/FB Page1_Full Wrap Pillar Ad_photo.webp',
  '/images/services/pillars/FB Page1_LRT 2 Extension Pillar Ad_photo.webp',
], {
  eager: true,
  query: '?url',
  import: 'default',
});

console.log('🎯 Pillar images found:', pillarImages);
console.log('🎯 Pillar image keys:', Object.keys(pillarImages));

// Import specific transit images - only direct paths, using /transits/ subfolder
const transitImages = import.meta.glob([
  '/images/services/transits/FB Page1_Big face taxi ad_photo.webp',
  '/images/services/transits/FB Page1_Head-on taxi top ad_photo.webp',
  '/images/services/transits/FB Page1_Jeepney Top ad_photo.webp',
  '/images/services/transits/FB Page1_Roving billboard ad_photo.webp',
  '/images/services/transits/FB Page1_Roving LED billboard ad_photo.webp',
  '/images/services/transits/FB Page1_Trike ad_photo.webp',
], {
  eager: true,
  query: '?url',
  import: 'default',
});

console.log('🎯 Transit images found:', transitImages);
console.log('🎯 Transit image keys:', Object.keys(transitImages));

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
    galleryItems: [
      {
        webp: pillarImages['/images/services/pillars/FB Page1_Full Wrap Pillar Ad_photo.webp'] || '/images/services/pillars/FB Page1_Full Wrap Pillar Ad_photo.webp',
        jpg: '/images/services/pillars/FB Page1_Full Wrap Pillar Ad.jpg',
        modalDescription: 'FULL WRAP PILLAR ADS',
        adSize: '10ft(w) x 15ft to 43ft(h) ad size varies on the pillars',
        locations: 'LRT 1 Quezon City part',
        landmarks: 'from North EDSA to Balintawak Stations',
      },
      {
        webp: pillarImages['/images/services/pillars/FB Page1_LRT 2 Extension Pillar Ad_photo.webp'] || '/images/services/pillars/FB Page1_LRT 2 Extension Pillar Ad_photo.webp',
        jpg: '/images/services/pillars/FB Page1_LRT 2 Extension Pillar Ad.jpg',
        modalDescription: 'LRT 2 EXTENSIONS PILLAR ADS',
        adSize: '6ft(w) 10ft - 15ft(w)',
        locations: 'LRT 2 Extensions',
        landmarks: 'from Santolan to Masinag Stations',
      },
    ],
    previewImage: pillarImages['/images/services/pillars/FB Page1_Full Wrap Pillar Ad_photo.webp'] || '/images/services/pillars/FB Page1_Full Wrap Pillar Ad_photo.webp',
    downloadFile: '/images/services/pillars/FB Page1_Full Wrap Pillar Ad.jpg',
    downloadFileName: 'FB Page1_Full Wrap Pillar Ad.jpg',
    pdfFile: `${SERVICES_PDF_BASE}/pillar-ads-cavc.pdf`,
    pdfFileName: 'pillar-ads-cavc.pdf',
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
    galleryItems: [
      {
        webp: ledImages['/images/services/leds/01_FB Page1_EDSA Highway 54 LED_photo.webp'] || '/images/services/leds/01_FB Page1_EDSA Highway 54 LED_photo.webp',
        jpg: '/images/services/leds/01_FB Page1_EDSA Highway 54 LED.jpg',
        modalDescription: 'HIGHWAY 54 LED BILLBOARD',
        adSize: '10m(w) x 16m(h)',
        location: 'EDSA, Mandaluyong City *Southbound',
        landmarks: 'across SM Megamall, beside Highway 54, near Starmall, Ortigas CBD, Shangri-La Mall, MRT Shaw & Ortigas Station, Greenfield District',
      },
      {
        webp: ledImages['/images/services/leds/02_FB Page1_EDSA - P Tuazon LED_photo.webp'] || '/images/services/leds/02_FB Page1_EDSA - P Tuazon LED_photo.webp',
        jpg: '/images/services/leds/02_FB Page1_EDSA - P Tuazon LED.jpg',
        modalDescription: 'EDSA-P.TUAZON LED BILLBOARD',
        adSize: '12m(w) x 6m(h)',
        location: 'EDSA corner P.Tuazon Boulevard, Quezon City',
        landmarks: 'near SeaOil Gasoline Station, Amaia Skies Cubao, Smart Araneta Coliseum, Farmer\'s Market, STI College',
      },
      {
        webp: ledImages['/images/services/leds/03_FB Page1_EDSA Cubao LED NB_photo.webp'] || '/images/services/leds/03_FB Page1_EDSA Cubao LED NB_photo.webp',
        jpg: '/images/services/leds/03_FB Page1_EDSA Cubao LED NB.jpg',
        modalDescription: 'EDSA CUBAO LED BILLBOARD - NB',
        adSize: '17m(w) x 4m(h)',
        location: 'EDSA Araneta Cubao (Araneta City Footbridge) *Northbound',
        landmarks: 'near Araneta Coliseum, Farmer\'s Plaza, Philtranco, MRT Araneta-Cubao Station',
      },
      {
        webp: ledImages['/images/services/leds/04_FB Page1_EDSA Cubao LED SB_photo.webp'] || '/images/services/leds/04_FB Page1_EDSA Cubao LED SB_photo.webp',
        jpg: '/images/services/leds/04_FB Page1_EDSA Cubao LED SB.jpg',
        modalDescription: 'EDSA CUBAO LED BILLBOARD - SB',
        adSize: '11m(w) x 4m(h)',
        location: 'EDSA Araneta Cubao (Farmer\'s Footbridge) *Southbound',
        landmarks: 'near Araneta Coliseum, Farmer\'s Plaza, Philtranco, MRT Araneta-Cubao Station',
      },
      {
        webp: ledImages['/images/services/leds/07_FB Page1_LRT TV Monitor_photo.webp'] || '/images/services/leds/07_FB Page1_LRT TV Monitor_photo.webp',
        jpg: '/images/services/leds/07_FB Page1_LRT TV Monitor.jpg',
        modalDescription: 'LRT 2 TV MONITOR',
        adSize: '65inches-28 units | 55 inches-7 units | 43 inches-2 units',
        location: 'Highway 54, EDSA, Mandaluyong City',
        landmarks: 'near Gateway Mall, Araneta Center Cubao, Robinsons Magnolia, Robinsons Metro East, St. Bridget School, Hi-Top Supermarket',
      },
      {
        webp: ledImages['/images/services/leds/08_FB Page1_Baguio LED billboard_photo.webp'] || '/images/services/leds/08_FB Page1_Baguio LED billboard_photo.webp',
        jpg: '/images/services/leds/08_FB Page1_Baguio LED billboard.jpg',
        modalDescription: 'BAGUIO LED BILLBOARD',
        adSize: '5m(w) x 6m(h) 308px(w) 368px(h)',
        location: 'City Center Hotel, Session Road corner Mabini Street, Baguio City',
        landmarks: 'near Burnnham Park, Baguio Night Market, Maharlika Livelihood Center',
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Buendia Gantry NB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Buendia Gantry NB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Buendia Gantry NB.jpg',
        modalDescription: 'EDSA BUENDIA LED GANTRY',
        adSize: '40.288ft(w) x 6.719ft(h)',
        location: 'EDSA Buendia, Makati City *Northbound',
        landmarks: 'near Kalayaan Avenue approaching Buendia Avenue',
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Buendia Gantry SB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Buendia Gantry SB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Buendia Gantry SB.jpg',
        modalDescription: 'EDSA BUENDIA LED GANTRY',
        adSize: '40.288ft(w) x 6.719ft(h)',
        location: 'EDSA Buendia, Makati City *Southbound',
        landmarks: 'in between Kalayaan Avenue and Buendia Avenue',
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Gantry generic_photo.webp'] || '/images/services/leds/FB Page1_EDSA Gantry generic_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Gantry generic.jpg',
        modalDescription: 'EDSA LED GANTRY',
        adSize: '40.288ft(w) x 6.71ft(h)',
        location: 'EDSA Buendia, Makati City *Northbound',
        landmarks: 'near Kalayaan Avenue approaching Buendia Avenue',
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Guadix Gantry NB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Guadix Gantry NB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Guadix Gantry NB.jpg',
        modalDescription: 'EDSA GUADIZ LED GANTRY',
        adSize: '39.37ft(w) x 8.86ft(h)',
        location: 'EDSA, Mandaluyong City *Northbound',
        landmarks: 'near Guadix Drive, Saint Pedro Poveda College',
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Main Avenue Gantry NB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Main Avenue Gantry NB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Main Avenue Gantry NB.jpg',
        modalDescription: 'EDSA MAIN AVENUE LED GANDRY',
        adSize: '39.37ft(w) x 8.86ft(h)',
        location: 'EDSA Main Avenue, Quezon City *Northbound',
        landmarks: 'in front of The Sentinel Residences, near Shell Gasoline Station',
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Main Avenue Gantry SB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Main Avenue Gantry SB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Main Avenue Gantry SB.jpg',
        modalDescription: 'EDSA MAIN AVENUE LED GANTRY',
        adSize: '39.3ft(w) x 8.86ft(h)',
        location: 'EDSA Main Avenue, Quezon City *Southbound',
        landmarks: 'near North Road, bus carousel, and across Amaia Skies Cubao',
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Megamall Gantry SB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Megamall Gantry SB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Megamall Gantry SB.jpg',
        modalDescription: 'EDSA MEGAMALL LED GANTRY',
        adSize: '39.37ft(w) x 8.86ft(h)',
        location: 'EDSA, Mandaluyong City *Southbound',
        landmarks: 'across Megamall Building A, infront f Highway 54 Building',
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Munoz Gantry SB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Munoz Gantry SB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Munoz Gantry SB.jpg',
        modalDescription: 'EDSA MUÑOZ LED GANTRY',
        adSize: '39.37ft(w) x 8.86ft(h)',
        location: 'EDSA Muñoz, Quezon City *Southbound',
        landmarks: 'near Panorama Technocenter, across Global Trade Center',
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Quezon Ave Gantry NB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Quezon Ave Gantry NB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Quezon Ave Gantry NB.jpg',
        modalDescription: 'EDSA QUEZON AVE LED GANTRY',
        adSize: '39.37ft(w) x 8.86ft(h)',
        location: 'EDSA Quezon Avenue, Quezon City *Northbound',
        landmarks: 'across Megamall Building A, infront of Highway 54 Building',
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Quezon Ave Gantry SB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Quezon Ave Gantry SB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Quezon Ave Gantry SB.jpg',
        modalDescription: 'EDSA QUEZON AVE LED GANTRY',
        adSize: '39.37ft(w) x 8.86ft(h)',
        location: 'EDSA Quezon Avenue, Quezon City *Southbound',
        landmarks: 'near Avida Towers Vita, The Philippine Women\'s University',
      },
    ],
    previewImage: ledImages['/images/services/leds/01_FB Page1_EDSA Highway 54 LED_photo.webp'] || '/images/services/leds/01_FB Page1_EDSA Highway 54 LED_photo.webp',
    downloadFile: '/images/services/leds/01_FB Page1_EDSA Highway 54 LED.jpg',
    downloadFileName: '01_FB Page1_EDSA Highway 54 LED.jpg',
    pdfFile: `${SERVICES_PDF_BASE}/led-displays-cavc.pdf`,
    pdfFileName: 'led-displays-cavc.pdf',
  },
  {
    id: 5,
    folder: 'transits',
    title: 'Transit Ads',
    description:
      'Transit ads are advertisements placed on or inside public transportation vehicles and transit stations.',
    galleryItems: [
      {
        webp: transitImages['/images/services/transits/FB Page1_Big face taxi ad_photo.webp'] || '/images/services/transits/FB Page1_Big face taxi ad_photo.webp',
        jpg: '/images/services/transits/FB Page1_Big face taxi ad.jpg',
        modalDescription: 'BIG FACE TAXI AD (ILLUMINATED)',
        adSize: 'Top side ad: 36in(w) x 15in(h) 2 faces | Top rear ad: 26in(w) x 15in(h) 1 face | Top ad sticker: 28in(w) x 35(h) x 5n (l)',
      },
      {
        webp: transitImages['/images/services/transits/FB Page1_Head-on taxi top ad_photo.webp'] || '/images/services/transits/FB Page1_Head-on taxi top ad_photo.webp',
        jpg: '/images/services/transits/FB Page1_Head-on taxi top ad.jpg',
        modalDescription: 'HEAD-ON TAXI TOP AD',
        adSize: '35ft(w) x 12ft(h) front and back',
        inclusions: 'Headrest ad and rear sticker ad (optional)',
      },
      {
        webp: transitImages['/images/services/transits/FB Page1_Jeepney Top ad_photo.webp'] || '/images/services/transits/FB Page1_Jeepney Top ad_photo.webp',
        jpg: '/images/services/transits/FB Page1_Jeepney Top ad.jpg',
        modalDescription: 'JEEPNEY TOP AD',
        adSize: 'SIDE AD SPACE: 7ft-9ft(w) x 2ft(h)',
        trapezoidAd: 'TRAPEZOID AD: 8in(w) x 21.5in(h) x 32in (bottom w)',
        route: 'Metro Manila and Provincial',
      },
      {
        webp: transitImages['/images/services/transits/FB Page1_Roving billboard ad_photo.webp'] || '/images/services/transits/FB Page1_Roving billboard ad_photo.webp',
        jpg: '/images/services/transits/FB Page1_Roving billboard ad.jpg',
        modalDescription: 'ROVING BILLBOARD',
        adSize: 'SIDE AD SPACE: 15ft(w) x 9ft(h)',
        rearAdSpace: 'REAR AD SPACE: 40in(w) x 9ft(h) x 60n (bottom w)',
        frontAdSpace: 'FRONT AD SPACE: 44in(w) x 56in(h) x 52in (bottom w)',
        route: "Client's requirement",
      },
      {
        webp: transitImages['/images/services/transits/FB Page1_Roving LED billboard ad_photo.webp'] || '/images/services/transits/FB Page1_Roving LED billboard ad_photo.webp',
        jpg: '/images/services/transits/FB Page1_Roving LED billboard ad.jpg',
        modalDescription: 'ROVING LED BILLBOARD',
        ledAdSpace: 'LED AD SPACE: 960px(w) x 576px(h)',
        staticAdSpace: 'STATIC AD SPACE: 178in(w) x 91in(h)*',
        frontAdPanel: 'FRONT AD PANEL: 44in(w) x 56in(h) x 52in (bottom w)**',
        rearAd: 'REAR AD: 5ft(w) x 8ft(h)**',
        material: 'Panaflex* & outdoor sticker**',
      },
      {
        webp: transitImages['/images/services/transits/FB Page1_Trike ad_photo.webp'] || '/images/services/transits/FB Page1_Trike ad_photo.webp',
        jpg: '/images/services/transits/FB Page1_Trike ad.jpg',
        modalDescription: 'TRIKE ADS',
        adSize: 'SIDE AD SPACE: 19in(w) x 13in(h) 2 faces',
        trapezoidAd: 'TRAPEZOID AD: 4in(w) x 12.05in(h) x 14in (bottom w) 2 faces',
        backTarpAd: 'BACK TARP AD: 15n(w) x 30in(h)',
        stickerAd: 'STICKER AD: 8in(w) x 4in(h) & 10in(w) x 4in(h)',
        route: 'Metro Manila and Provincial',
      },
    ],
    previewImage: transitImages['/images/services/transits/FB Page1_Big face taxi ad_photo.webp'] || '/images/services/transits/FB Page1_Big face taxi ad_photo.webp',
    downloadFile: '/images/services/transits/FB Page1_Big face taxi ad.jpg',
    downloadFileName: 'FB Page1_Big face taxi ad.jpg',
    pdfFile: `${SERVICES_PDF_BASE}/transit-ads.pdf`,
    pdfFileName: 'transit-ads.pdf',
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
