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

// Import specific billboard images - only direct paths, using /billboards/ subfolder
const billboardImages = import.meta.glob([
  '/images/services/billboards/01_FB Page1_EDSA Highway 54 wallboard_photo.webp',
  '/images/services/billboards/02_FB Page1_Highway 54 Billboard_photo.webp',
  '/images/services/billboards/03_FB Page1_EDSA Boni_photo.webp',
  '/images/services/billboards/04_FB Page1_EDSA Quezon Avenue Billboard_photo.webp',
  '/images/services/billboards/05_FB Page1_EDSA P Tuazon Billboard_photo.webp',
  '/images/services/billboards/06_FB Page1_C5 Taguig Billboard_photo.webp',
  '/images/services/billboards/07_FB Page1_C5 Taguig Billboard_south bound_photo.webp',
  '/images/services/billboards/08_FB Page1_C5 Bagong Ilog_photo.webp',
  '/images/services/billboards/09_FB Page1_C5 Kalayaan Bridge Billboard_photo.webp',
  '/images/services/billboards/10_FB Page1_Espana Billboard_photo.webp',
  '/images/services/billboards/10a_FB Page1_Morayta Lerma Billboard_photo.webp',
  '/images/services/billboards/11_FB Page1_Marcos Highway Billboard_photo.webp',
  '/images/services/billboards/12_FB Page1_Ortigas Ave Ext Rosario Billboard_photo.webp',
  '/images/services/billboards/13_FB Page1_NAIA Road Billboard_EB_photo.webp',
  '/images/services/billboards/14_FB Page1_NAIA Road Billboard_WB_photo.webp',
  '/images/services/billboards/15_FB Page1_SLEX Bicutan_north bound_photo.webp',
  '/images/services/billboards/16_FB Page1_SLEX Bicutan_south bound_photo.webp',
  '/images/services/billboards/17_FB Page1_SLEX Alabang billboard copy_photo.webp',
  '/images/services/billboards/18_FB Page1_SLEX Muntinlupa_south bound_photo.webp',
  '/images/services/billboards/19_FB Page1_SLEX Muntinlupa_north bound_photo.webp',
  '/images/services/billboards/20_FB Page1_Imus Cavite Billboard_North bound_photo.webp',
  '/images/services/billboards/21_FB Page1_Imus Cavite Billboard_South bound_photo.webp',
  '/images/services/billboards/22_FB Page1_Malvar Batangas Billboard_photo.webp',
  '/images/services/billboards/23_FB Page1_Malvar Batangas Billboard_south bound_photo.webp',
  '/images/services/billboards/24_FB Page1_NLEX Marilao_north bound_photo.webp',
  '/images/services/billboards/25_FB Page1_Bocaue billboard_photo.webp',
  '/images/services/billboards/26_FB Page1_Candaba Viaduct Billboard_photo.webp',
  '/images/services/billboards/27_FB Page1_Tuba Benguet A billboard_nb_photo.webp',
  '/images/services/billboards/27a_FB Page1_Tuba Benguet A billboard_photo.webp',
  '/images/services/billboards/28_FB Page1_Tuba Benguet B billboard_nb_photo.webp',
  '/images/services/billboards/28a_FB Page1_Tuba Benguet B billboard_photo.webp',
  '/images/services/billboards/Footbridge_C5 J Vargas_Face A_photo.webp',
  '/images/services/billboards/Footbridge_C5 J Vargas_Face B_photo.webp',
  '/images/services/billboards/Footbridge_C5 Kalayaan_Face A_photo.webp',
  '/images/services/billboards/Footbridge_C5 Kalayaan_Face B_photo.webp',
  '/images/services/billboards/Footbridge_C5 Kalayaan_Face C_photo.webp',
  '/images/services/billboards/Footbridge_C5 Kalayaan_Face D_photo.webp',
  '/images/services/billboards/Footbridge_C5 Kalayaan_Face E F_photo.webp',
  '/images/services/billboards/Footbridge_C5 Kalayaan_Face G_photo.webp',
  '/images/services/billboards/Footbridge_C5 Kalayaan_Face H_photo.webp',
  '/images/services/billboards/Footbridge_C5 Kalayaan_Face I copy_photo.webp',
  '/images/services/billboards/Footbridge_C5 Kalayaan_Face J_photo.webp',
  '/images/services/billboards/Footbridge_Katipunan_Face A B_photo.webp',
  '/images/services/billboards/Footbridge_Katipunan_Face C_photo.webp',
  '/images/services/billboards/Footbridge_Katipunan_Face D_photo.webp',
  '/images/services/billboards/Footbridge_Katipunan_Face E_photo.webp',
  '/images/services/billboards/Footbridge_Marcos Highway_Face A_photo.webp',
  '/images/services/billboards/Footbridge_Marcos Highway_Face B_photo.webp',
  '/images/services/billboards/Footbridge_Montillano_Face A_photo.webp',
  '/images/services/billboards/Footbridge_Montillano_Face B C_photo.webp',
  '/images/services/billboards/Footbridge_Montillano_Face D_photo.webp',
  '/images/services/billboards/Footbridge_Montillano_Face E_photo.webp',
  '/images/services/billboards/Footbridge_Montillano_Face F_photo.webp',
  '/images/services/billboards/Footbridge_Ortigas Avenue C Raymundo_Face A_photo.webp',
  '/images/services/billboards/Footbridge_Ortigas Avenue C Raymundo_Face B_photo.webp',
  '/images/services/billboards/Footbridge_Ortigas Avenue-Meralco Gate 2_Face A_photo.webp',
  '/images/services/billboards/Footbridge_Ortigas Avenue-Meralco Gate 2_Face B_photo.webp',
  '/images/services/billboards/Footbridge_Ortigas Face A_photo.webp',
  '/images/services/billboards/Footbridge_Ortigas Face B_photo.webp',
  '/images/services/billboards/Footbridge_Starmall Alabang_Face A_photo.webp',
  '/images/services/billboards/Footbridge_Starmall Alabang_Face B_photo.webp',
  '/images/services/billboards/Footbridge_Sumulong Highway_Face A_photo.webp',
  '/images/services/billboards/Footbridge_Sumulong Highway_Face B_photo.webp',
  '/images/services/billboards/Footbridge_Sumulong Highway_Face C_photo.webp',
  '/images/services/billboards/Footbridge_Sumulong Highway_Face D_photo.webp',
  '/images/services/billboards/Footbridge_Sumulong Highway_Face E_photo.webp',
  '/images/services/billboards/Footbridge_Sumulong Highway_Face F_photo.webp',
  '/images/services/billboards/Footbridge_Susana Heights_Face A_photo.webp',
  '/images/services/billboards/Footbridge_Susana Heights_Face B_photo.webp',
  '/images/services/billboards/Footbridge_Susana Heights_Face C_photo.webp',
  '/images/services/billboards/Footbridge_Susana Heights_Face D_photo.webp',
  '/images/services/billboards/Footbridge_Susana Heights_Face E_photo.webp',
  '/images/services/billboards/Footbridge_Susana Heights_Face F_photo.webp',
  '/images/services/billboards/Footbridge_Welcome Rotunda_Face A_photo.webp',
  '/images/services/billboards/Footbridge_Welcome Rotunda_Face B_photo.webp',
  '/images/services/billboards/Footbridge_Welcome Rotunda_Face C_photo.webp',
  '/images/services/billboards/Footbridge_Welcome Rotunda_Face E_photo.webp',
  '/images/services/billboards/ZBacoor POB_D_photo.webp',
  '/images/services/billboards/ZBacoor waiting shed_A_photo.webp',
  '/images/services/billboards/ZBacoor waiting shed_B_photo.webp',
  '/images/services/billboards/ZBacoor waiting shed_C_photo.webp',
], {
  eager: true,
  query: '?url',
  import: 'default',
});

console.log('🎯 Billboard images found:', billboardImages);
console.log('🎯 Billboard image keys:', Object.keys(billboardImages));

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
        modalDetails: {
          'Standard Size': '3ft(w) x 9ft(h)',
          'Locations': 'Ortigas Center, Pasig, MOA, Pasay, Manila, Mandaluyong, Muntinlupa, Malabon, Caloocan, Rizal, Cavite, Cavitex, Bacolod, Bulacan, CDO, Laguna, Ilo-ilo, Cebu, and other provinces',
        },
      },
      {
        webp: bannerImages['/images/services/banners/FB Page1_Ortigas Center banners_photo.webp'] || '/images/services/banners/FB Page1_Ortigas Center banners_photo.webp',
        jpg: '/images/services/banners/FB Page1_Ortigas Center banners.jpg',
        modalDescription: 'ORTIGAS CENTER LAMP POST BANNERS',
        modalDetails: {
          'Ad Size': '3ft(w) x 9ft(h)',
          'Ad Type': 'Lighted and regular banners',
          'Location': 'Ortigas Center, Pasig City',
        },
      },
      {
        webp: bannerImages['/images/services/banners/FB Page1_Ortigas Center lighted banners_photo.webp'] || '/images/services/banners/FB Page1_Ortigas Center lighted banners_photo.webp',
        jpg: '/images/services/banners/FB Page1_Ortigas Center lighted banners.jpg',
        modalDescription: 'ORTIGAS CENTER LIGHTED BANNERS',
        modalDetails: {
          'Ad Size': '3ft(w) x 9ft(h)',
          'Ad Type': 'Lighted banners',
          'Location': 'San Miguel Avenue, ADB Avenue, J Vargas Avenue, Ortigas Center, Pasig City',
        },
      },
      {
        webp: bannerImages['/images/services/banners/Walking Banner Ad_photo.webp'] || '/images/services/banners/Walking Banner Ad_photo.webp',
        jpg: '/images/services/banners/Walking Banner Ad.jpg',
        modalDescription: 'WALKING BANNER AD',
        modalDetails: {
          'Ad Size': '1.6ft(w) x 4ft(h)',
          'Ad Type': 'Walking banner',
          'Location': "Client's requirement",
        },
      },
      {
        webp: bannerImages['/images/services/banners/Walking LED Ad_photo.webp'] || '/images/services/banners/Walking LED Ad_photo.webp',
        jpg: '/images/services/banners/Walking LED Ad.jpg',
        modalDescription: 'WALKING LED AD',
        modalDetails: {
          'Ad Size': 'front: 23in(w) x 25in(h) | 23in(w) x 57in(h)',
          'Ad Type': 'Walking LED',
          'Location': "Client's requirement",
        },
      },
      {
        webp: bannerImages['/images/services/banners/zAcross the street streamer_photo.webp'] || '/images/services/banners/zAcross the street streamer_photo.webp',
        jpg: '/images/services/banners/zAcross the street streamer.jpg',
        modalDescription: 'ACROSS THE STREET STREAMER',
        modalDetails: {
          'Ad Size': '12ft(w) x 4ft(h) / 15ft(w) x 4ft(h)',
          'Ad Type': 'Street streamer',
          'Location': "Client's requirement",
        },
      },
    ],
    // Use first item as preview
    previewImage: bannerImages['/images/services/banners/FB Page1_LPB_photo.webp'] || '/images/services/banners/FB Page1_LPB_photo.webp',
    downloadFile: '/images/services/banners/FB Page1_LPB.jpg',
    downloadFileName: 'FB Page1_LPB.jpg',
    pdfFile: `${SERVICES_PDF_BASE}/banner-cavc.pdf`,
    pdfFileName: 'banner-cavc.pdf',
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
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft to 43ft(h) ad size varies on the pillars',
          'Locations': 'LRT 1 Quezon City part',
          'Landmarks': 'from North EDSA to Balintawak Stations',
        },
      },
      {
        webp: pillarImages['/images/services/pillars/FB Page1_LRT 2 Extension Pillar Ad_photo.webp'] || '/images/services/pillars/FB Page1_LRT 2 Extension Pillar Ad_photo.webp',
        jpg: '/images/services/pillars/FB Page1_LRT 2 Extension Pillar Ad.jpg',
        modalDescription: 'LRT 2 EXTENSIONS PILLAR ADS',
        modalDetails: {
          'Ad Size': '6ft(w) 10ft - 15ft(w)',
          'Locations': 'LRT 2 Extensions',
          'Landmarks': 'from Santolan to Masinag Stations',
        },
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
    galleryItems: [
      {
        webp: billboardImages['/images/services/billboards/01_FB Page1_EDSA Highway 54 wallboard_photo.webp'] || '/images/services/billboards/01_FB Page1_EDSA Highway 54 wallboard_photo.webp',
        jpg: '/images/services/billboards/01_FB Page1_EDSA Highway 54 wallboard.jpg',
        modalDescription: 'HIGHWAY 54 WALLBOARD',
        modalDetails: {
          'Ad Size': '40ft(w) x 60ft(h)',
          'Location': 'Lux Center, EDSA, Mandaluyong City',
          'Landmarks': 'Beside Highway 54, near Megamall, Ortigas CBD Starmall, Greenfield District, Shangri-La Mall',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/02_FB Page1_Highway 54 Billboard_photo.webp'] || '/images/services/billboards/02_FB Page1_Highway 54 Billboard_photo.webp',
        jpg: '/images/services/billboards/02_FB Page1_Highway 54 Billboard.jpg',
        modalDescription: 'HIGHWAY 54 Billboard',
        modalDetails: {
          'Ad Size': '30ft(w) x 50ft(h) * north bound',
          'Location': 'Highway 54, EDSA, Mandaluyong City',
          'Landmarks': 'across SM Megamall, near Starmall, Ortigas CBD, Greenfield District, St. Augustine School of Nursing, Shangri-La Mall',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/03_FB Page1_EDSA Boni_photo.webp'] || '/images/services/billboards/03_FB Page1_EDSA Boni_photo.webp',
        jpg: '/images/services/billboards/03_FB Page1_EDSA Boni.jpg',
        modalDescription: 'ESDA BONI BILLBOARD',
        modalDetails: {
          'Ad Size': '20ft(w) x 30ft(h)',
          'Location': 'Edsa Boni, Mandaluyong City',
          'Landmarks': 'Beside Prudential, near Caltex, Amber\'s & Guadalupe Bridge, Across Go Hotels',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/04_FB Page1_EDSA Quezon Avenue Billboard_photo.webp'] || '/images/services/billboards/04_FB Page1_EDSA Quezon Avenue Billboard_photo.webp',
        jpg: '/images/services/billboards/04_FB Page1_EDSA Quezon Avenue Billboard.jpg',
        modalDescription: 'EDSA-QUEZON AVE BILLBOARD',
        modalDetails: {
          'Ad Size': '60ft(w) x 50ft(h)',
          'Location': 'Quedsa Plaza Building, Quezon Ave corner EDSA, Quezon City',
          'Landmarks': 'NAPOLCOM Building, Centris MRT Station',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/05_FB Page1_EDSA P Tuazon Billboard_photo.webp'] || '/images/services/billboards/05_FB Page1_EDSA P Tuazon Billboard_photo.webp',
        jpg: '/images/services/billboards/05_FB Page1_EDSA P Tuazon Billboard.jpg',
        modalDescription: 'EDSA-CUBAO BILLBOARD',
        modalDetails: {
          'Ad Size': 'Half frame: 60ft(w) x 40ft(h) *whole: 60ft(h) x 80ft(h)',
          'Location': 'EDSA near corner P. Tuazon Blvd, Quezon City, North bound',
          'Landmarks': 'near Araneta City, Smart Araneta Coliseum, SeaOil Gasoline Station, across Samson College of Science and Technology',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/06_FB Page1_C5 Taguig Billboard_photo.webp'] || '/images/services/billboards/06_FB Page1_C5 Taguig Billboard_photo.webp',
        jpg: '/images/services/billboards/06_FB Page1_C5 Taguig Billboard.jpg',
        modalDescription: 'C5 TAGUIG BILLBOARD',
        modalDetails: {
          'Ad Size': '60ft(w) x 40ft(h) *north bound',
          'Location': 'Service Road, C5, Makati City',
          'Landmarks': 'across Market! Market!, near BGC, Treston College, SM Aura',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/07_FB Page1_C5 Taguig Billboard_south bound_photo.webp'] || '/images/services/billboards/07_FB Page1_C5 Taguig Billboard_south bound_photo.webp',
        jpg: '/images/services/billboards/07_FB Page1_C5 Taguig Billboard_south bound.jpg',
        modalDescription: 'C5 TAGUIG BILLBOARD',
        modalDetails: {
          'Ad Size': '60ft(w) x 40ft(h) *south bound',
          'Location': 'Service Road, C5, Makati City',
          'Landmarks': 'across Market! Market!, near BGC, Treston College, SM Aura',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/08_FB Page1_C5 Bagong Ilog_photo.webp'] || '/images/services/billboards/08_FB Page1_C5 Bagong Ilog_photo.webp',
        jpg: '/images/services/billboards/08_FB Page1_C5 Bagong Ilog.jpg',
        modalDescription: 'C5 BAGONG ILOG BILLBOARD',
        modalDetails: {
          'Ad Size': '30ft(w) x 50ft(h)',
          'Location': '23 San Roque Extension, Bagong Ilog Pasig * North bound',
          'Landmarks': 'near URC Floor Division, Rizal Medical Center',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/09_FB Page1_C5 Kalayaan Bridge Billboard_photo.webp'] || '/images/services/billboards/09_FB Page1_C5 Kalayaan Bridge Billboard_photo.webp',
        jpg: '/images/services/billboards/09_FB Page1_C5 Kalayaan Bridge Billboard.jpg',
        modalDescription: 'C5 KALAYAAN BRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '32.5ftft(w) x 50ft(h) *east bound',
          'Location': 'Dr. Jose P. Rizal Extension, Makati City',
          'Landmarks': 'visible along C5 Kalayaan Bridge, from Pasig towards C5 elevated U-turn and Kalayaan Avenue',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/10_FB Page1_Espana Billboard_photo.webp'] || '/images/services/billboards/10_FB Page1_Espana Billboard_photo.webp',
        jpg: '/images/services/billboards/10_FB Page1_Espana Billboard.jpg',
        modalDescription: 'ESPAÑA BOULEVARD BILLBOARD',
        modalDetails: {
          'Ad Size': '40ft(h) x 50ft(w) *south bound',
          'Location': 'España Boulevard corner Maceda Street, Manila City',
          'Landmarks': 'beside Mercury Drug Store, near KFC, BDO España, Wellcoco Building, District, towards University of Sto. Tomas',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/10a_FB Page1_Morayta Lerma Billboard_photo.webp'] || '/images/services/billboards/10a_FB Page1_Morayta Lerma Billboard_photo.webp',
        jpg: '/images/services/billboards/10a_FB Page1_Morayta Lerma Billboard.jpg',
        modalDescription: 'MORAYTA LERMA BILLBOARD',
        modalDetails: {
          'Ad Size': '84ft(w) x 30ft9h)',
          'Location': 'Lerma corner Nicanor Reyes, Manila City',
          'Landmarks': 'Louella Dormitory, FEU, U-Belt area, Greenwich, Mang Inasal, Chowking',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/11_FB Page1_Marcos Highway Billboard_photo.webp'] || '/images/services/billboards/11_FB Page1_Marcos Highway Billboard_photo.webp',
        jpg: '/images/services/billboards/11_FB Page1_Marcos Highway Billboard.jpg',
        modalDescription: 'MARCOS HIGHWAY BILLBOARD',
        modalDetails: {
          'Ad Size': '32.5ft(w) x 50ft(h) *east bound',
          'Location': 'F. Mariano corner Marcos Highway, Dela Paz, Pasig City',
          'Landmarks': 'near Bike 101, Honda Cars Marcos Highway, Assad Mini Mart, Robinsons Metro East',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/12_FB Page1_Ortigas Ave Ext Rosario Billboard_photo.webp'] || '/images/services/billboards/12_FB Page1_Ortigas Ave Ext Rosario Billboard_photo.webp',
        jpg: '/images/services/billboards/12_FB Page1_Ortigas Ave Ext Rosario Billboard.jpg',
        modalDescription: 'ORTIGAS AVE EXT BILLBOARD',
        modalDetails: {
          'Ad Size': '26ft(w) x 40ft(h)',
          'Location': 'Ortigas Avenue Extension, Rosario, Pasig City',
          'Landmarks': 'near Puregold Supermarket, Alfonso Supermarket, SSS Pasig Rosario Branch, Alfonso Specialist Hospital',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/13_FB Page1_NAIA Road Billboard_EB_photo.webp'] || '/images/services/billboards/13_FB Page1_NAIA Road Billboard_EB_photo.webp',
        jpg: '/images/services/billboards/13_FB Page1_NAIA Road Billboard_EB.jpg',
        modalDescription: 'NAIA ROAD BILLBOARD',
        modalDetails: {
          'Ad Size': '40ft(w) x 60ft(h) *east bound',
          'Location': 'Naia Road, Tambo, Paranaque City',
          'Landmarks': 'visible along NAIA Expressway, beside WGM Building, near Roxas Boulevard',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/14_FB Page1_NAIA Road Billboard_WB_photo.webp'] || '/images/services/billboards/14_FB Page1_NAIA Road Billboard_WB_photo.webp',
        jpg: '/images/services/billboards/14_FB Page1_NAIA Road Billboard_WB.jpg',
        modalDescription: 'NAIA ROAD BILLBOARD',
        modalDetails: {
          'Ad Size': '40ft(w) x 60ft(h) *west bound',
          'Location': 'Naia Road, Tambo, Paranaque City',
          'Landmarks': 'visible along NAIA Expressway, beside WGM Building, near Roxas Boulevard',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/15_FB Page1_SLEX Bicutan_north bound_photo.webp'] || '/images/services/billboards/15_FB Page1_SLEX Bicutan_north bound_photo.webp',
        jpg: '/images/services/billboards/15_FB Page1_SLEX Bicutan_north bound.jpg',
        modalDescription: 'SLEX BICUTAN BILLBOARD',
        modalDetails: {
          'Ad Size': '41ft(w) x 70ft(h) *north bound',
          'Location': 'West Service Road, Bicutan, Paranaque City',
          'Landmarks': 'beside Andok\'s, Pour Over Cafe, near Azure Urban Resort Residence, DHL Logistics Center',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/16_FB Page1_SLEX Bicutan_south bound_photo.webp'] || '/images/services/billboards/16_FB Page1_SLEX Bicutan_south bound_photo.webp',
        jpg: '/images/services/billboards/16_FB Page1_SLEX Bicutan_south bound.jpg',
        modalDescription: 'SLEX BICUTAN BILLBOARD',
        modalDetails: {
          'Ad Size': '50ft(w) x 70ft(h) *south bound',
          'Location': 'West Service Road, Bicutan, Paranaque City',
          'Landmarks': 'beside Andok\'s Pour Over Cafe, near Azure Urban Resort Residence, DHL Logistics Center',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/17_FB Page1_SLEX Alabang billboard copy_photo.webp'] || '/images/services/billboards/17_FB Page1_SLEX Alabang billboard copy_photo.webp',
        jpg: '/images/services/billboards/17_FB Page1_SLEX Alabang billboard copy.jpg',
        modalDescription: 'SLEX ALABANG BILLBOARD',
        modalDetails: {
          'Ad Size': '55ft(w) x 55ft(h) *north bound',
          'Location': 'KM 23 East Road, Alabang, Muntinlupa City',
          'Landmarks': 'also visible from Skyway and SLEX, beside Industrial and Technology Works Corp, near Filinvest Belize Oasis Alabang',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/18_FB Page1_SLEX Muntinlupa_south bound_photo.webp'] || '/images/services/billboards/18_FB Page1_SLEX Muntinlupa_south bound_photo.webp',
        jpg: '/images/services/billboards/18_FB Page1_SLEX Muntinlupa_south bound.jpg',
        modalDescription: 'SLEX MUNTINLUPA BILLBOARD',
        modalDetails: {
          'Ad Size': '50ft(w) x 50ft(h) *south bound',
          'Location': 'SLEX corner Katihan Road, Muntinlupa City',
          'Landmarks': 'across Southernside Montessori School, near Bilibid Katihan Road Overpass',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/19_FB Page1_SLEX Muntinlupa_north bound_photo.webp'] || '/images/services/billboards/19_FB Page1_SLEX Muntinlupa_north bound_photo.webp',
        jpg: '/images/services/billboards/19_FB Page1_SLEX Muntinlupa_north bound.jpg',
        modalDescription: 'SLEX MUNTINLUPA BILLBOARD',
        modalDetails: {
          'Ad Size': '50ft(w) x 50ft(h) *north bound',
          'Location': 'SLEX corner Katihan Road, Muntinlupa City',
          'Landmarks': 'across Southernside Montessori School, near Bilibid Katihan Road Overpass',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/20_FB Page1_Imus Cavite Billboard_North bound_photo.webp'] || '/images/services/billboards/20_FB Page1_Imus Cavite Billboard_North bound_photo.webp',
        jpg: '/images/services/billboards/20_FB Page1_Imus Cavite Billboard_North bound.jpg',
        modalDescription: 'IMUS CAVITE BILLBOARD',
        modalDetails: {
          'Ad Size': '30ft(w) x 50ft(h) *north bound',
          'Location': 'Emilio Aguinaldo Highway, Anabu, Imus, Cavite',
          'Landmarks': 'beside Shell, near SM Hypermarket, City Mall, Anabu Hills Subdivision, The Grand Parkplace',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/21_FB Page1_Imus Cavite Billboard_South bound_photo.webp'] || '/images/services/billboards/21_FB Page1_Imus Cavite Billboard_South bound_photo.webp',
        jpg: '/images/services/billboards/21_FB Page1_Imus Cavite Billboard_South bound.jpg',
        modalDescription: 'IMUS CAVITE BILLBOARD',
        modalDetails: {
          'Ad Size': '30ft(w) x 50ft(h) *south bound',
          'Location': 'Emilio Aguinaldo Hihgway, Anabu, Imus, Cavite',
          'Landmarks': 'beside Shell, near SM Hypermarket, City Mall, Anabu Hills Subdivision, The Grand Parkplace',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/22_FB Page1_Malvar Batangas Billboard_photo.webp'] || '/images/services/billboards/22_FB Page1_Malvar Batangas Billboard_photo.webp',
        jpg: '/images/services/billboards/22_FB Page1_Malvar Batangas Billboard.jpg',
        modalDescription: 'MALVAR BATANGAS BILLBOARD',
        modalDetails: {
          'Ad Size': '40ft(w) x 30ft(h) *north bound',
          'Location': 'President Jose P. Laurel Highway cor Main Blvd, Malvar, Batangas',
          'Landmarks': 'Lima Technology Center entrance, Iglesia Ni Cristo, Palawan Pawnshop',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/23_FB Page1_Malvar Batangas Billboard_south bound_photo.webp'] || '/images/services/billboards/23_FB Page1_Malvar Batangas Billboard_south bound_photo.webp',
        jpg: '/images/services/billboards/23_FB Page1_Malvar Batangas Billboard_south bound.jpg',
        modalDescription: 'MALVAR BATANGAS BILLBOARD',
        modalDetails: {
          'Ad Size': '40ft(w) x 30ft(h) *south bound',
          'Location': 'President Jose P. Laurel Highway cor Main Blvd, Malvar, Batangas',
          'Landmarks': 'Lima Technology Center entrance, Iglesia Ni Cristo, Palawan Pawnshop',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/24_FB Page1_NLEX Marilao_north bound_photo.webp'] || '/images/services/billboards/24_FB Page1_NLEX Marilao_north bound_photo.webp',
        jpg: '/images/services/billboards/24_FB Page1_NLEX Marilao_north bound.jpg',
        modalDescription: 'NLEX MARILAO BILLBOARD',
        modalDetails: {
          'Ad Size': '50ft(w) x 85ft(h)*north bound',
          'Location': 'NLEX Marilao, Bulacan',
          'Landmarks': 'in between Petron KM23 Gasolin Station and Lias Bridge',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/25_FB Page1_Bocaue billboard_photo.webp'] || '/images/services/billboards/25_FB Page1_Bocaue billboard_photo.webp',
        jpg: '/images/services/billboards/25_FB Page1_Bocaue billboard.jpg',
        modalDescription: 'BOCAUE BILLBOARD',
        modalDetails: {
          'Ad Size': '60ft(w) x 100ft(h) *double-faced',
          'Location': 'NLEX Bocaue, Bulacan*north bound',
          'Landmarks': 'before Bocaue Toll Plaza',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/26_FB Page1_Candaba Viaduct Billboard_photo.webp'] || '/images/services/billboards/26_FB Page1_Candaba Viaduct Billboard_photo.webp',
        jpg: '/images/services/billboards/26_FB Page1_Candaba Viaduct Billboard.jpg',
        modalDescription: 'NLEX CANDABA VIADUCT BILLBOARD',
        modalDetails: {
          'Ad Size': '60ft(w) x 40ft(h) *7 units(14 faces)',
          'Location': 'NLEX Candaba Viaduct, Pulilan, Bulacan *south bound',
          'Landmarks': 'Calumpit and Pulilan areas. Before Pulilan Regional Road',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/27_FB Page1_Tuba Benguet A billboard_nb_photo.webp'] || '/images/services/billboards/27_FB Page1_Tuba Benguet A billboard_nb_photo.webp',
        jpg: '/images/services/billboards/27_FB Page1_Tuba Benguet A billboard_nb.jpg',
        modalDescription: 'TUBA BENGUET BILLBOARD A',
        modalDetails: {
          'Ad Size': '30ft(w) x 45ft(h) *north bound',
          'Location': 'Aspiras-Palispis Highway, Población, Tuba Benguet',
          'Landmarks': 'beside 4J\'s Pasalubong, Guerrero Iron Works, near West Point Shooting Range',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/27a_FB Page1_Tuba Benguet A billboard_photo.webp'] || '/images/services/billboards/27a_FB Page1_Tuba Benguet A billboard_photo.webp',
        jpg: '/images/services/billboards/27a_FB Page1_Tuba Benguet A billboard.jpg',
        modalDescription: 'TUBA BENGUET BILLBOARD A',
        modalDetails: {
          'Ad Size': '30ft(w) x 45ft(h) *south bound',
          'Location': 'Aspiras-Palispis Highway, Población, Tuba Benguet',
          'Landmarks': 'beside 4J\'s Pasalubong, Guerrero Iron Works, near West Point Shooting Range',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/28_FB Page1_Tuba Benguet B billboard_nb_photo.webp'] || '/images/services/billboards/28_FB Page1_Tuba Benguet B billboard_nb_photo.webp',
        jpg: '/images/services/billboards/28_FB Page1_Tuba Benguet B billboard_nb.jpg',
        modalDescription: 'TUBA BENGUET BILLBOARD B',
        modalDetails: {
          'Ad Size': '30ft(w) x 50ft(h) *north bound',
          'Location': 'Aspiras-Palispis Highway, Población, Tuba Benguet',
          'Landmarks': 'beside Mapteng Bake Shop, near Rapide, Carpentrade Home Depot, Emerald Sky view Center',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/28a_FB Page1_Tuba Benguet B billboard_photo.webp'] || '/images/services/billboards/28a_FB Page1_Tuba Benguet B billboard_photo.webp',
        jpg: '/images/services/billboards/28a_FB Page1_Tuba Benguet B billboard.jpg',
        modalDescription: 'TUBA BENGUET BILLBOARD B',
        modalDetails: {
          'Ad Size': '30ft(w) x 50ft(h) *south bound',
          'Location': 'Aspiras-Palispis Highway, Población, Tuba Benguet',
          'Landmarks': 'beside Mapteng Bake Shop, near Rapide, Carpentrade Home Depot, Emerald Skyview Center',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_C5 J Vargas_Face A_photo.webp'] || '/images/services/billboards/Footbridge_C5 J Vargas_Face A_photo.webp',
        jpg: '/images/services/billboards/Footbridge_C5 J Vargas_Face A.jpg',
        modalDescription: 'C5 J. VARGAS FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face A:30ft(w) x 12ft(h) *from Makati towards QC Libis',
          'Location': 'C5 corner J. Vargas, Pasig City',
          'Landmarks': 'near Shell Station',
          'Traffic Count': '333,200 per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_C5 J Vargas_Face B_photo.webp'] || '/images/services/billboards/Footbridge_C5 J Vargas_Face B_photo.webp',
        jpg: '/images/services/billboards/Footbridge_C5 J Vargas_Face B.jpg',
        modalDescription: 'C5 J. VARGAS FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face B:30ft(w) x 12ft(h) *from QC Libis towards Makati',
          'Location': 'C5 corner J. Vargas, Pasig City',
          'Landmarks': 'near Shell Station',
          'Traffic Count': '333,200 per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_C5 Kalayaan_Face A_photo.webp'] || '/images/services/billboards/Footbridge_C5 Kalayaan_Face A_photo.webp',
        jpg: '/images/services/billboards/Footbridge_C5 Kalayaan_Face A.jpg',
        modalDescription: 'C5 KALAYAAN FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face A:50ft(w) x 16ft(h) *from SLEX towards Pasig',
          'Location': 'C5 Kalayaan near Elevated U-Turn, Taguig City',
          'Landmarks': 'gateway to Makati and Pasig City',
          'Traffic Count': '228,000 per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_C5 Kalayaan_Face B_photo.webp'] || '/images/services/billboards/Footbridge_C5 Kalayaan_Face B_photo.webp',
        jpg: '/images/services/billboards/Footbridge_C5 Kalayaan_Face B.jpg',
        modalDescription: 'C5 KALAYAAN FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face B:50ft(w) x 16ft(h) *from Pasig towards SLEX',
          'Location': 'C5 Kalayaan near Elevated U-Turn, Taguig City',
          'Landmarks': 'gateway to Makati and Pasig City',
          'Traffic Count': '228,000 per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_C5 Kalayaan_Face C_photo.webp'] || '/images/services/billboards/Footbridge_C5 Kalayaan_Face C_photo.webp',
        jpg: '/images/services/billboards/Footbridge_C5 Kalayaan_Face C.jpg',
        modalDescription: 'C5 KALAYAAN FOOTBRIDGE',
        modalDetails: {
          'Ad Size': 'Face C:50FT(w) x 16ft(h) *from Makati towards C5 (off bound)',
          'Location': 'C5 Kalayaan near Elevated U-Turn, Taguig City',
          'Landmarks': 'gateway to Makati and Pasig City',
          'Traffic Count': '228,000 per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_C5 Kalayaan_Face D_photo.webp'] || '/images/services/billboards/Footbridge_C5 Kalayaan_Face D_photo.webp',
        jpg: '/images/services/billboards/Footbridge_C5 Kalayaan_Face D.jpg',
        modalDescription: 'C5 KALAYAAN FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face D: 50ft(w) x 16ft(h) *from Makati towards C5',
          'Location': 'C5 Kalayaan near Elevated U-Turn, Taguig City',
          'Landmarks': 'gateway to Makati and Pasig City',
          'Traffic Count': '228,000 per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_C5 Kalayaan_Face E F_photo.webp'] || '/images/services/billboards/Footbridge_C5 Kalayaan_Face E F_photo.webp',
        jpg: '/images/services/billboards/Footbridge_C5 Kalayaan_Face E F.jpg',
        modalDescription: 'C5 KALAYAAN FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face E & F:Approx 60ft(w) x 16ft(h) *from Pateros towards C5',
          'Location': 'C5 Kalayaan near Elevated U-Turn, Taguig City',
          'Landmarks': 'gateway to Makati and Pasig City',
          'Traffic Count': '228,000 per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_C5 Kalayaan_Face G_photo.webp'] || '/images/services/billboards/Footbridge_C5 Kalayaan_Face G_photo.webp',
        jpg: '/images/services/billboards/Footbridge_C5 Kalayaan_Face G.jpg',
        modalDescription: 'C5 KALAYAAN FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face G:Approx 50ft(w) x 16ft(h) *view from C5 northbound(parallel)',
          'Location': 'C5 Kalayaan near Elevated U-Turn, Taguig City',
          'Landmarks': 'gateway to Makati and Pasig City',
          'Traffic Count': '228,000 per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_C5 Kalayaan_Face H_photo.webp'] || '/images/services/billboards/Footbridge_C5 Kalayaan_Face H_photo.webp',
        jpg: '/images/services/billboards/Footbridge_C5 Kalayaan_Face H.jpg',
        modalDescription: 'C5 KALAYAAN FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face H: Approx 60ft(w) x 16ft(h) *from C5 towards Pateros',
          'Location': 'C5 Kalayaan near Elevated U-Turn, Taguig City',
          'Landmarks': 'gateway to Makati and Pasig City',
          'Traffic Count': '228,000 per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_C5 Kalayaan_Face I copy_photo.webp'] || '/images/services/billboards/Footbridge_C5 Kalayaan_Face I copy_photo.webp',
        jpg: '/images/services/billboards/Footbridge_C5 Kalayaan_Face I copy.jpg',
        modalDescription: 'C5 KALAYAAN FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face I: 50ft(w) x 16ft(h) *view from C5 southbound (parallel)',
          'Location': 'C5 Kalayaan near Elevated U-Turn, Taguig City',
          'Landmarks': 'gateway to Makati and Pasig City',
          'Traffic Count': '228,000 per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_C5 Kalayaan_Face J_photo.webp'] || '/images/services/billboards/Footbridge_C5 Kalayaan_Face J_photo.webp',
        jpg: '/images/services/billboards/Footbridge_C5 Kalayaan_Face J.jpg',
        modalDescription: 'C5 KALAYAAN FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face J:Approx 60ft(w) x 16ft(h) *C5 towards Makati',
          'Location': 'C5 Kalayaan near Elevated U-Turn, Taguig City',
          'Landmarks': 'gateway to Makati and Pasig City',
          'Traffic Count': '228,000 per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Katipunan_Face A B_photo.webp'] || '/images/services/billboards/Footbridge_Katipunan_Face A B_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Katipunan_Face A B.jpg',
        modalDescription: 'KATIPUNAN-BONNY SERRANO FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face A:40ft(w) x 10ft(h) *towards White Plains | Face B:40ft(w) x 10ft(h) *towards EDSA',
          'Location': 'Katipunan corner Bonny Serrano, Quezon City',
          'Landmarks': 'Petron, Blue Ridge Subdivision, Autovogue Car Exchange',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Katipunan_Face C_photo.webp'] || '/images/services/billboards/Footbridge_Katipunan_Face C_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Katipunan_Face C.jpg',
        modalDescription: 'KATIPUNAN-BONNY SERRANO FOOTBRDIGE AD',
        modalDetails: {
          'Ad Size': 'Face C:60ft(w) x 10ft(h) *towards EDSA',
          'Location': 'Katipunan corner Bonny Serrano, Quezon City',
          'Landmarks': 'Petron, Blue Ridge Subdivision, Autovogue Car Exchange',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Katipunan_Face D_photo.webp'] || '/images/services/billboards/Footbridge_Katipunan_Face D_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Katipunan_Face D.jpg',
        modalDescription: 'KATIPUNAN-BONNY SERRANO FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face D:40ft(w) x 10ft(h) *towards Commonwealth',
          'Location': 'Katipunan corner Bonny Serrano, Quezon City',
          'Landmarks': 'Petron, Blue Ridge Subdivison, Autovogue Car Exchange',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Katipunan_Face E_photo.webp'] || '/images/services/billboards/Footbridge_Katipunan_Face E_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Katipunan_Face E.jpg',
        modalDescription: 'KATIPUNAN-BONNY SERRANO FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face E:40ft(w) x 10ft(h) *towards Marikina',
          'Location': 'Katipunan corner Bonny Serrano, Quezon City',
          'Landmarks': 'Petron, Blue Ridge Subdivison, Autovogue Car Exchange',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Marcos Highway_Face A_photo.webp'] || '/images/services/billboards/Footbridge_Marcos Highway_Face A_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Marcos Highway_Face A.jpg',
        modalDescription: 'MARCOS HIGHWAY FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face A: 40ft(w) x 14ft(h) *towards Antipolo',
          'Location': 'Marcos Highway, Pasig City',
          'Landmarks': 'near Ayala Mall Feliz, Puregold Ligaya, Jollibee, Chowking',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Marcos Highway_Face B_photo.webp'] || '/images/services/billboards/Footbridge_Marcos Highway_Face B_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Marcos Highway_Face B.jpg',
        modalDescription: 'MARCOS HIGHWAY FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face B 40ft(w) x 14ft(h) *towards Quezon City',
          'Location': 'Marcos Highway, Pasig City',
          'Landmarks': 'near Ayala Mall Feliz, Puregold Ligaya, Jollibee, Chowking',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Montillano_Face A_photo.webp'] || '/images/services/billboards/Footbridge_Montillano_Face A_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Montillano_Face A.jpg',
        modalDescription: 'MONTILLANO FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face A: Approx 40ft(w) x 10ft(h) *from Ilaya St towards SLEX',
          'Location': 'Alabang Montillano corner SLEX, Muntinlupa City',
          'Landmarks': 'near P2P Bus Terminal Alabang, Festival Mall, Asian Hospital',
          'Traffic Count': '108,000 Per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Montillano_Face B C_photo.webp'] || '/images/services/billboards/Footbridge_Montillano_Face B C_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Montillano_Face B C.jpg',
        modalDescription: 'MONTILLANO FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face B: Approx 40ft(w) x 10ft(h) *from Ilaya St towards SLEX',
          'Location': 'Alabang Montillano corner SLEX, Muntinlupa City',
          'Landmarks': 'near P2P Bus Terminal Alabang, Festival Mall, Asian Hospital',
          'Traffic Count': '108,000 Per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Montillano_Face D_photo.webp'] || '/images/services/billboards/Footbridge_Montillano_Face D_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Montillano_Face D.jpg',
        modalDescription: 'MONTILLANO FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face D: Approx 40ft(w) x 10ft(h) *from Ilaya St towards SLEX',
          'Location': 'Alabang Montillano corner SLEX, Muntinlupa City',
          'Landmarks': 'near P2P Bus Terminal Alabang, Festival Mall, Asian Hospital',
          'Traffic Count': '108,000 Per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Montillano_Face E_photo.webp'] || '/images/services/billboards/Footbridge_Montillano_Face E_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Montillano_Face E.jpg',
        modalDescription: 'MONTILLANO FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face E: Approx 40ft(w) x 10ft(h) *from Ilaya St towards SLEX',
          'Location': 'Alabang Montillano corner SLEX, Muntinlupa City',
          'Landmarks': 'near P2P Bus Terminal Alabang, Festival Mall, Asian Hospital',
          'Traffic Count': '108,000 Per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Montillano_Face F_photo.webp'] || '/images/services/billboards/Footbridge_Montillano_Face F_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Montillano_Face F.jpg',
        modalDescription: 'MONTILLANO FOOTBRIDGE AD',
        modalDetails: {
          'Ad Size': 'Face F: Approx 40ft(w) x 10ft(h) *from Ilaya St towards SLEX',
          'Location': 'Alabang Montillano corner SLEX, Muntinlupa City',
          'Landmarks': 'near P2P Bus Terminal Alabang, Festival Mall, Asian Hospital',
          'Traffic Count': '108,000 Per day',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Ortigas Avenue C Raymundo_Face A_photo.webp'] || '/images/services/billboards/Footbridge_Ortigas Avenue C Raymundo_Face A_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Ortigas Avenue C Raymundo_Face A.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Ortigas Avenue C Raymundo_Face B_photo.webp'] || '/images/services/billboards/Footbridge_Ortigas Avenue C Raymundo_Face B_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Ortigas Avenue C Raymundo_Face B.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Ortigas Avenue-Meralco Gate 2_Face A_photo.webp'] || '/images/services/billboards/Footbridge_Ortigas Avenue-Meralco Gate 2_Face A_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Ortigas Avenue-Meralco Gate 2_Face A.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Ortigas Avenue-Meralco Gate 2_Face B_photo.webp'] || '/images/services/billboards/Footbridge_Ortigas Avenue-Meralco Gate 2_Face B_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Ortigas Avenue-Meralco Gate 2_Face B.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Ortigas Face A_photo.webp'] || '/images/services/billboards/Footbridge_Ortigas Face A_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Ortigas Face A.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Ortigas Face B_photo.webp'] || '/images/services/billboards/Footbridge_Ortigas Face B_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Ortigas Face B.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Starmall Alabang_Face A_photo.webp'] || '/images/services/billboards/Footbridge_Starmall Alabang_Face A_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Starmall Alabang_Face A.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Starmall Alabang_Face B_photo.webp'] || '/images/services/billboards/Footbridge_Starmall Alabang_Face B_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Starmall Alabang_Face B.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Sumulong Highway_Face A_photo.webp'] || '/images/services/billboards/Footbridge_Sumulong Highway_Face A_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Sumulong Highway_Face A.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Sumulong Highway_Face B_photo.webp'] || '/images/services/billboards/Footbridge_Sumulong Highway_Face B_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Sumulong Highway_Face B.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Sumulong Highway_Face C_photo.webp'] || '/images/services/billboards/Footbridge_Sumulong Highway_Face C_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Sumulong Highway_Face C.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Sumulong Highway_Face D_photo.webp'] || '/images/services/billboards/Footbridge_Sumulong Highway_Face D_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Sumulong Highway_Face D.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Sumulong Highway_Face E_photo.webp'] || '/images/services/billboards/Footbridge_Sumulong Highway_Face E_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Sumulong Highway_Face E.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Sumulong Highway_Face F_photo.webp'] || '/images/services/billboards/Footbridge_Sumulong Highway_Face F_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Sumulong Highway_Face F.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Susana Heights_Face A_photo.webp'] || '/images/services/billboards/Footbridge_Susana Heights_Face A_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Susana Heights_Face A.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Susana Heights_Face B_photo.webp'] || '/images/services/billboards/Footbridge_Susana Heights_Face B_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Susana Heights_Face B.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Susana Heights_Face C_photo.webp'] || '/images/services/billboards/Footbridge_Susana Heights_Face C_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Susana Heights_Face C.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Susana Heights_Face D_photo.webp'] || '/images/services/billboards/Footbridge_Susana Heights_Face D_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Susana Heights_Face D.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Susana Heights_Face E_photo.webp'] || '/images/services/billboards/Footbridge_Susana Heights_Face E_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Susana Heights_Face E.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Susana Heights_Face F_photo.webp'] || '/images/services/billboards/Footbridge_Susana Heights_Face F_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Susana Heights_Face F.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Welcome Rotunda_Face A_photo.webp'] || '/images/services/billboards/Footbridge_Welcome Rotunda_Face A_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Welcome Rotunda_Face A.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Welcome Rotunda_Face B_photo.webp'] || '/images/services/billboards/Footbridge_Welcome Rotunda_Face B_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Welcome Rotunda_Face B.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
       
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Welcome Rotunda_Face C_photo.webp'] || '/images/services/billboards/Footbridge_Welcome Rotunda_Face C_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Welcome Rotunda_Face C.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/Footbridge_Welcome Rotunda_Face E_photo.webp'] || '/images/services/billboards/Footbridge_Welcome Rotunda_Face E_photo.webp',
        jpg: '/images/services/billboards/Footbridge_Welcome Rotunda_Face E.jpg',
        modalDescription: 'FOOTBRIDGE BILLBOARD',
        modalDetails: {
          'Ad Size': '10ft(w) x 15ft(h)',
          'Location': 'Various locations',
          'Landmarks': 'near MRT stations, major intersections',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/ZBacoor POB_D_photo.webp'] || '/images/services/billboards/ZBacoor POB_D_photo.webp',
        jpg: '/images/services/billboards/ZBacoor POB_D.jpg',
        modalDescription: 'BACOOR OVERPASS BILLBOARD',
        modalDetails: {
          'Ad Size': 'Top: 30ft(w) x 10ft(h) *2 faces | Bottom: 40ft(w) x 14ft(h) *2 faces',
          'Location': 'Emilio Aguinaldo Highway near corner Niog Road, Bacoor, Cavite',
          'Landmarks': 'near Jollibee, Coronado Commercial Complex',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/ZBacoor waiting shed_A_photo.webp'] || '/images/services/billboards/ZBacoor waiting shed_A_photo.webp',
        jpg: '/images/services/billboards/ZBacoor waiting shed_A.jpg',
        modalDescription: 'BACOOR WAITING SHED',
        modalDetails: {
          'Ad Size': 'Mini billboard: 29.53ft(w) x 6.56(h) *1 face | Panel ads: 7.84ft(w) x 4ft(h) *3 faces',
          'Location': 'Emilio Aguinaldo Highway, Bacoor, Cavite',
          'Landmarks': 'near SM City Bacoor',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/ZBacoor waiting shed_B_photo.webp'] || '/images/services/billboards/ZBacoor waiting shed_B_photo.webp',
        jpg: '/images/services/billboards/ZBacoor waiting shed_B.jpg',
        modalDescription: 'BACOOR WAITING SHED',
        modalDetails: {
          'Ad Size': 'Mini billboard: 29.53ft(w) x 6.56(h) *1 face | Panel ads: 6.84ft-8.53ft(w) x 4ft(h) *3 faces',
          'Location': 'Gen. Evangelista Street, Bacoor, Cavite',
          'Landmarks': 'in front of Población Elementary School',
        },
      },
      {
        webp: billboardImages['/images/services/billboards/ZBacoor waiting shed_C_photo.webp'] || '/images/services/billboards/ZBacoor waiting shed_C_photo.webp',
        jpg: '/images/services/billboards/ZBacoor waiting shed_C.jpg',
        modalDescription: 'BACOOR WAITING SHED',
        modalDetails: {
          'Ad Size': 'Mini billboard: 20.42ft(w) x 6.56(h) *1 face | Panel ads: 7.55ft(w) x 4ft(h) *2 faces',
          'Location': 'Tirona Highway, Bacoor, Cavite',
          'Landmarks': 'near Bacoor Freedom Park Mabolo Plaza',
        },
      },
    ],
    previewImage: billboardImages['/images/services/billboards/01_FB Page1_EDSA Highway 54 wallboard_photo.webp'] || '/images/services/billboards/01_FB Page1_EDSA Highway 54 wallboard_photo.webp',
    downloadFile: '/images/services/billboards/01_FB Page1_EDSA Highway 54 wallboard.jpg',
    downloadFileName: '01_FB Page1_EDSA Highway 54 wallboard.jpg',
    pdfFile: `${SERVICES_PDF_BASE}/billboards-cavc.pdf`,
    pdfFileName: 'billboards-cavc.pdf',
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
        modalDetails: {
          'Ad Size': '10m(w) x 16m(h)',
          'Location': 'EDSA, Mandaluyong City *Southbound',
          'Landmarks': 'across SM Megamall, beside Highway 54, near Starmall, Ortigas CBD, Shangri-La Mall, MRT Shaw & Ortigas Station, Greenfield District',
        },
      },
      {
        webp: ledImages['/images/services/leds/02_FB Page1_EDSA - P Tuazon LED_photo.webp'] || '/images/services/leds/02_FB Page1_EDSA - P Tuazon LED_photo.webp',
        jpg: '/images/services/leds/02_FB Page1_EDSA - P Tuazon LED.jpg',
        modalDescription: 'EDSA-P.TUAZON LED BILLBOARD',
        modalDetails: {
          'Ad Size': '12m(w) x 6m(h)',
          'Location': 'EDSA corner P.Tuazon Boulevard, Quezon City',
          'Landmarks': 'near SeaOil Gasoline Station, Amaia Skies Cubao, Smart Araneta Coliseum, Farmer\'s Market, STI College',
        },
      },
      {
        webp: ledImages['/images/services/leds/03_FB Page1_EDSA Cubao LED NB_photo.webp'] || '/images/services/leds/03_FB Page1_EDSA Cubao LED NB_photo.webp',
        jpg: '/images/services/leds/03_FB Page1_EDSA Cubao LED NB.jpg',
        modalDescription: 'EDSA CUBAO LED BILLBOARD - NB',
        modalDetails: {
          'Ad Size': '17m(w) x 4m(h)',
          'Location': 'EDSA Araneta Cubao (Araneta City Footbridge) *Northbound',
          'Landmarks': 'near Araneta Coliseum, Farmer\'s Plaza, Philtranco, MRT Araneta-Cubao Station',
        },
      },
      {
        webp: ledImages['/images/services/leds/04_FB Page1_EDSA Cubao LED SB_photo.webp'] || '/images/services/leds/04_FB Page1_EDSA Cubao LED SB_photo.webp',
        jpg: '/images/services/leds/04_FB Page1_EDSA Cubao LED SB.jpg',
        modalDescription: 'EDSA CUBAO LED BILLBOARD - SB',
        modalDetails: {
          'Ad Size': '11m(w) x 4m(h)',
          'Location': 'EDSA Araneta Cubao (Farmer\'s Footbridge) *Southbound',
          'Landmarks': 'near Araneta Coliseum, Farmer\'s Plaza, Philtranco, MRT Araneta-Cubao Station',
        },
      },
      {
        webp: ledImages['/images/services/leds/07_FB Page1_LRT TV Monitor_photo.webp'] || '/images/services/leds/07_FB Page1_LRT TV Monitor_photo.webp',
        jpg: '/images/services/leds/07_FB Page1_LRT TV Monitor.jpg',
        modalDescription: 'LRT 2 TV MONITOR',
        modalDetails: {
          'Ad Size': '65inches-28 units | 55 inches-7 units | 43 inches-2 units',
          'Location': 'Highway 54, EDSA, Mandaluyong City',
          'Landmarks': 'near Gateway Mall, Araneta Center Cubao, Robinsons Magnolia, Robinsons Metro East, St. Bridget School, Hi-Top Supermarket',
        },
      },
      {
        webp: ledImages['/images/services/leds/08_FB Page1_Baguio LED billboard_photo.webp'] || '/images/services/leds/08_FB Page1_Baguio LED billboard_photo.webp',
        jpg: '/images/services/leds/08_FB Page1_Baguio LED billboard.jpg',
        modalDescription: 'BAGUIO LED BILLBOARD',
        modalDetails: {
          'Ad Size': '5m(w) x 6m(h) 308px(w) 368px(h)',
          'Location': 'City Center Hotel, Session Road corner Mabini Street, Baguio City',
          'Landmarks': 'near Burnnham Park, Baguio Night Market, Maharlika Livelihood Center',
        },
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Buendia Gantry NB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Buendia Gantry NB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Buendia Gantry NB.jpg',
        modalDescription: 'EDSA BUENDIA LED GANTRY',
        modalDetails: {
          'Ad Size': '40.288ft(w) x 6.719ft(h)',
          'Location': 'EDSA Buendia, Makati City *Northbound',
          'Landmarks': 'near Kalayaan Avenue approaching Buendia Avenue',
        },
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Buendia Gantry SB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Buendia Gantry SB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Buendia Gantry SB.jpg',
        modalDescription: 'EDSA BUENDIA LED GANTRY',
        modalDetails: {
          'Ad Size': '40.288ft(w) x 6.719ft(h)',
          'Location': 'EDSA Buendia, Makati City *Southbound',
          'Landmarks': 'in between Kalayaan Avenue and Buendia Avenue',
        },
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Gantry generic_photo.webp'] || '/images/services/leds/FB Page1_EDSA Gantry generic_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Gantry generic.jpg',
        modalDescription: 'EDSA LED GANTRY',
        modalDetails: {
          'Ad Size': '40.288ft(w) x 6.71ft(h)',
          'Location': 'EDSA Buendia, Makati City *Northbound',
          'Landmarks': 'near Kalayaan Avenue approaching Buendia Avenue',
        },
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Guadix Gantry NB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Guadix Gantry NB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Guadix Gantry NB.jpg',
        modalDescription: 'EDSA GUADIZ LED GANTRY',
        modalDetails: {
          'Ad Size': '39.37ft(w) x 8.86ft(h)',
          'Location': 'EDSA, Mandaluyong City *Northbound',
          'Landmarks': 'near Guadix Drive, Saint Pedro Poveda College',
        },
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Main Avenue Gantry NB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Main Avenue Gantry NB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Main Avenue Gantry NB.jpg',
        modalDescription: 'EDSA MAIN AVENUE LED GANDRY',
        modalDetails: {
          'Ad Size': '39.37ft(w) x 8.86ft(h)',
          'Location': 'EDSA Main Avenue, Quezon City *Northbound',
          'Landmarks': 'in front of The Sentinel Residences, near Shell Gasoline Station',
        },
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Main Avenue Gantry SB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Main Avenue Gantry SB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Main Avenue Gantry SB.jpg',
        modalDescription: 'EDSA MAIN AVENUE LED GANTRY',
        modalDetails: {
          'Ad Size': '39.3ft(w) x 8.86ft(h)',
          'Location': 'EDSA Main Avenue, Quezon City *Southbound',
          'Landmarks': 'near North Road, bus carousel, and across Amaia Skies Cubao',
        },
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Megamall Gantry SB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Megamall Gantry SB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Megamall Gantry SB.jpg',
        modalDescription: 'EDSA MEGAMALL LED GANTRY',
        modalDetails: {
          'Ad Size': '39.37ft(w) x 8.86ft(h)',
          'Location': 'EDSA, Mandaluyong City *Southbound',
          'Landmarks': 'across Megamall Building A, infront f Highway 54 Building',
        },
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Munoz Gantry SB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Munoz Gantry SB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Munoz Gantry SB.jpg',
        modalDescription: 'EDSA MUÑOZ LED GANTRY',
        modalDetails: {
          'Ad Size': '39.37ft(w) x 8.86ft(h)',
          'Location': 'EDSA Muñoz, Quezon City *Southbound',
          'Landmarks': 'near Panorama Technocenter, across Global Trade Center',
        },
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Quezon Ave Gantry NB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Quezon Ave Gantry NB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Quezon Ave Gantry NB.jpg',
        modalDescription: 'EDSA QUEZON AVE LED GANTRY',
        modalDetails: {
          'Ad Size': '39.37ft(w) x 8.86ft(h)',
          'Location': 'EDSA Quezon Avenue, Quezon City *Northbound',
          'Landmarks': 'across Megamall Building A, infront of Highway 54 Building',
        },
      },
      {
        webp: ledImages['/images/services/leds/FB Page1_EDSA Quezon Ave Gantry SB_photo.webp'] || '/images/services/leds/FB Page1_EDSA Quezon Ave Gantry SB_photo.webp',
        jpg: '/images/services/leds/FB Page1_EDSA Quezon Ave Gantry SB.jpg',
        modalDescription: 'EDSA QUEZON AVE LED GANTRY',
        modalDetails: {
          'Ad Size': '39.37ft(w) x 8.86ft(h)',
          'Location': 'EDSA Quezon Avenue, Quezon City *Southbound',
          'Landmarks': 'near Avida Towers Vita, The Philippine Women\'s University',
        },
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
        modalDetails: {
          'Ad Size': 'Top side ad: 36in(w) x 15in(h) 2 faces | Top rear ad: 26in(w) x 15in(h) 1 face | Top ad sticker: 28in(w) x 35(h) x 5n (l)',
        },
      },
      {
        webp: transitImages['/images/services/transits/FB Page1_Head-on taxi top ad_photo.webp'] || '/images/services/transits/FB Page1_Head-on taxi top ad_photo.webp',
        jpg: '/images/services/transits/FB Page1_Head-on taxi top ad.jpg',
        modalDescription: 'HEAD-ON TAXI TOP AD',
        modalDetails: {
          'Ad Size': '35ft(w) x 12ft(h) front and back',
          'Inclusions': 'Headrest ad and rear sticker ad (optional)',
        },
      },
      {
        webp: transitImages['/images/services/transits/FB Page1_Jeepney Top ad_photo.webp'] || '/images/services/transits/FB Page1_Jeepney Top ad_photo.webp',
        jpg: '/images/services/transits/FB Page1_Jeepney Top ad.jpg',
        modalDescription: 'JEEPNEY TOP AD',
        modalDetails: {
          'Ad Size': 'SIDE AD SPACE: 7ft-9ft(w) x 2ft(h)',
          'Trapezoid Ad': 'TRAPEZOID AD: 8in(w) x 21.5in(h) x 32in (bottom w)',
          'Route': 'Metro Manila and Provincial',
        },
      },
      {
        webp: transitImages['/images/services/transits/FB Page1_Roving billboard ad_photo.webp'] || '/images/services/transits/FB Page1_Roving billboard ad_photo.webp',
        jpg: '/images/services/transits/FB Page1_Roving billboard ad.jpg',
        modalDescription: 'ROVING BILLBOARD',
        modalDetails: {
          'Ad Size': 'SIDE AD SPACE: 15ft(w) x 9ft(h)',
          'Rear Ad Space': 'REAR AD SPACE: 40in(w) x 9ft(h) x 60n (bottom w)',
          'Front Ad Space': 'FRONT AD SPACE: 44in(w) x 56in(h) x 52in (bottom w)',
          'Route': "Client's requirement",
        },
      },
      {
        webp: transitImages['/images/services/transits/FB Page1_Roving LED billboard ad_photo.webp'] || '/images/services/transits/FB Page1_Roving LED billboard ad_photo.webp',
        jpg: '/images/services/transits/FB Page1_Roving LED billboard ad.jpg',
        modalDescription: 'ROVING LED BILLBOARD',
        modalDetails: {
          'LED Ad Space': 'LED AD SPACE: 960px(w) x 576px(h)',
          'Static Ad Space': 'STATIC AD SPACE: 178in(w) x 91in(h)*',
          'Front Ad Panel': 'FRONT AD PANEL: 44in(w) x 56in(h) x 52in (bottom w)**',
          'Rear Ad': 'REAR AD: 5ft(w) x 8ft(h)**',
          'Material': 'Panaflex* & outdoor sticker**',
        },
      },
      {
        webp: transitImages['/images/services/transits/FB Page1_Trike ad_photo.webp'] || '/images/services/transits/FB Page1_Trike ad_photo.webp',
        jpg: '/images/services/transits/FB Page1_Trike ad.jpg',
        modalDescription: 'TRIKE ADS',
        modalDetails: {
          'Ad Size': 'SIDE AD SPACE: 19in(w) x 13in(h) 2 faces',
          'Trapezoid Ad': 'TRAPEZOID AD: 4in(w) x 12.05in(h) x 14in (bottom w) 2 faces',
          'Back Tarp Ad': 'BACK TARP AD: 15n(w) x 30in(h)',
          'Sticker Ad': 'STICKER AD: 8in(w) x 4in(h) & 10in(w) x 4in(h)',
          'Route': 'Metro Manila and Provincial',
        },
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
        modalDetails: {
          'Ad Size': '2ft(w) x 3ft(h)',
          'Location': "Client's requirement",
        },
      },
      {
        webp: signageImages['/images/services/signages/FB Page1_Directional Sign_double pole_photo.webp'] || '/images/services/signages/FB Page1_Directional Sign_double pole_photo.webp',
        jpg: '/images/services/signages/FB Page1_Directional Sign_double pole.jpg',
        modalDescription: 'DOUBLE POLE DIRECTIONAL SIGN',
        modalDetails: {
          'Ad Size': '4ft(w) x 3ft(h), 6ft(w) x 4ft(h)',
          'Location': "Client's requirement",
        },
      },
      {
        webp: signageImages['/images/services/signages/FB Page1_Directional Sign_single pole_photo.webp'] || '/images/services/signages/FB Page1_Directional Sign_single pole_photo.webp',
        jpg: '/images/services/signages/FB Page1_Directional Sign_single pole.jpg',
        modalDescription: 'SINGLE POLE DIRECTIONAL SIGN',
        modalDetails: {
          'Ad Size': '2ft(w) x 3ft(h), 3ft(w) x 4ft(h)',
          'Location': "Client's requirement",
        },
      },
    ],
    // Use first item as preview
    previewImage: signageImages['/images/services/signages/FB Page1_Directional Sign_clamp directional_photo.webp'] || '/images/services/signages/FB Page1_Directional Sign_clamp directional_photo.webp',
    downloadFile: '/images/services/signages/FB Page1_Directional Sign_clamp directional.jpg',
    downloadFileName: 'FB Page1_Directional Sign_clamp directional.jpg',
    pdfFile: `${SERVICES_PDF_BASE}/signages-cavc.pdf`,
    pdfFileName: 'signages-cavc.pdf',
  },
].map((service) => {
  if (service.galleryItems) {
    const gallery = service.galleryItems.map((item) => ({
      url: item.webp,
      downloadUrl: item.jpg,
      caption: item.modalDescription,
      modalDescription: item.modalDescription,
      modalDetails: item.modalDetails,
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
