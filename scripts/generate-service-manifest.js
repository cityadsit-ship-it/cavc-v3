import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICES_DIR = path.join(__dirname, '../public/images/services');
const OUTPUT_FILE = path.join(__dirname, '../src/components/ServicesManifest.json');

function scanServiceFolder(folderName) {
  const folderPath = path.join(SERVICES_DIR, folderName);
  
  if (!fs.existsSync(folderPath)) {
    console.warn(`Folder not found: ${folderPath}`);
    return { images: [], count: 0 };
  }

  const files = fs.readdirSync(folderPath);
  const imageFiles = files
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .sort((a, b) => {
      // Sort: main.jpg first, then numeric order
      if (a === 'main.jpg') return -1;
      if (b === 'main.jpg') return 1;
      const numA = parseInt(a.match(/\d+/)?.[0] || '999');
      const numB = parseInt(b.match(/\d+/)?.[0] || '999');
      return numA - numB;
    });

  return {
    images: imageFiles,
    count: imageFiles.filter(f => f !== 'main.jpg').length,
  };
}

function generateManifest() {
  const serviceFolders = fs.readdirSync(SERVICES_DIR)
    .filter(item => {
      const itemPath = path.join(SERVICES_DIR, item);
      return fs.statSync(itemPath).isDirectory();
    });

  const manifest = {};
  
  serviceFolders.forEach(folder => {
    const { images, count } = scanServiceFolder(folder);
    manifest[folder] = {
      folder,
      images,
      galleryCount: count,
      lastUpdated: new Date().toISOString(),
    };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`✅ Service manifest generated: ${OUTPUT_FILE}`);
  console.log(`📁 Scanned ${Object.keys(manifest).length} service folders`);
  
  Object.entries(manifest).forEach(([folder, data]) => {
    console.log(`   - ${folder}: ${data.galleryCount} images (+1 main)`);
  });
}

generateManifest();
