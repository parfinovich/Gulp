import fs from 'fs';
import path from 'path';

const ratiosPath = path.resolve('src/scss/base/_generated-ratios.scss');
let content = '';

try {
  content = fs.readFileSync(ratiosPath, 'utf8');
} catch {
  console.warn(`⚠️ Файл не найден: ${ratiosPath}`);
}

// Inserted widths from SCSS
const scssWidths = [...(content.matchAll(/"(\d+)x\d+"/g) || [])].map(m => parseInt(m[1]));

// Breakpoints
const breakpoints = [320, 768, 1024, 1440];

// Sort
const allWidths = [...new Set([...scssWidths, ...breakpoints])].sort((a, b) => a - b);

// Config
const responsiveConfig = {
  '**/*.{jpg,jpeg,png}': []
};

const responsiveWebpConfig = {
  '**/*.{jpg,jpeg,png}': []
};

// Generate responsive images
allWidths.forEach(w => {
  responsiveConfig['**/*.{jpg,jpeg,png}'].push(
    { width: w, rename: { suffix: `-${w}` } },
    { width: w * 2, rename: { suffix: '@2x' } }
  );
  responsiveWebpConfig['**/*.{jpg,jpeg,png}'].push(
    { width: w, rename: { suffix: `-${w}`, extname: '.webp' } },
    { width: w * 2, rename: { suffix: '@2x', extname: '.webp' } }
  );
});

// Add original images without suffix
responsiveConfig['**/*.{jpg,jpeg,png}'].push({ rename: { suffix: '' } });
responsiveWebpConfig['**/*.{jpg,jpeg,png}'].push({ rename: { suffix: '', extname: '.webp' } });

// Export the configurations
export default responsiveConfig;
export { responsiveWebpConfig };
