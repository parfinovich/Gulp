import fs from 'fs';
import path from 'path';
import glob from 'glob';
import log from 'fancy-log';

export const generateRatios = (done) => {
  // Ищем все HTML-файлы, кроме тех, что в исключённых папках
  const files = glob.sync('src/**/*.html', {
    ignore: [
      'src/**/icons/**',
      'src/**/logos/**',
      'src/**/svg/**',
      'src/**/decor/**'
    ]
  });

  const regex = /class=["'][^"']*img-(\d+)x(\d+)[^"']*["']/g;
  const ratios = new Set();

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = regex.exec(content)) !== null) {
      const width = match[1];
      const height = match[2];
      ratios.add(`"${width}x${height}"`);
    }
  });

  const sorted = Array.from(ratios).sort((a, b) => {
    const [aw, ah] = a.replace(/"/g, '').split('x').map(Number);
    const [bw, bh] = b.replace(/"/g, '').split('x').map(Number);
    return aw * ah - bw * bh;
  });

  const scssContent = `// 🔄 Generated automatically from HTML\n` +
    `$img-ratios: (\n` +
    sorted.map(r => `  ${r},`).join('\n') +
    `\n);\n`;

  const outputPath = path.resolve('src/scss/base/_generated-ratios.scss');
  try {
    fs.writeFileSync(outputPath, scssContent);
    log(`✅ Generated _generated-ratios.scss with ${sorted.length} ratios`);
  } catch (err) {
    log.error(`❌ Ошибка при записи _generated-ratios.scss: ${err.message}`);
  }

  done();
};
