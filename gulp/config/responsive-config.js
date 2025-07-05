import fs from 'fs';
import path from 'path';

const ratiosPath = path.resolve('src/scss/base/_generated-ratios.scss');
let content = '';

// Пробуем прочитать SCSS с размерами
try {
  content = fs.readFileSync(ratiosPath, 'utf8');
} catch {
  console.warn(`⚠️ Файл не найден: ${ratiosPath}`);
}

// Извлекаем только ширины из "300x200", "1440x800" и т.д.
const scssWidths = [...(content.matchAll(/"(\d+)x\d+"/g) || [])].map(m => parseInt(m[1]));

// Контрольные точки — добавляются всегда
const breakpoints = [320, 768, 1024, 1440];

// Уникальные и отсортированные размеры
const allWidths = [...new Set([...scssWidths, ...breakpoints])].sort((a, b) => a - b);

// Конфиги
const responsiveConfig = {
  '**/*.{jpg,jpeg,png}': []
};

const responsiveWebpConfig = {
  '**/*.{jpg,jpeg,png}': []
};

// Генерация вариантов
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

// Добавляем оригиналы (неизменённые)
responsiveConfig['**/*.{jpg,jpeg,png}'].push({ rename: { suffix: '' } });
responsiveWebpConfig['**/*.{jpg,jpeg,png}'].push({ rename: { suffix: '', extname: '.webp' } });

// Экспорт
export default responsiveConfig;
export { responsiveWebpConfig };
