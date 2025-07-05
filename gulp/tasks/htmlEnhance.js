import fs from 'fs';
import path from 'path';
import cheerio from 'gulp-cheerio';
import log from 'fancy-log';
import beep from 'beepbeep';

export const imagesEnhanceHTML = () => {
  const ratiosRaw = fs.readFileSync('src/scss/base/_generated-ratios.scss', 'utf8');
  const matchWidths = [...ratiosRaw.matchAll(/"(\d+)x\d+"/g)].map(m => parseInt(m[1]));
  const breakpoints = [320, 768, 1024, 1440];
  const allWidths = [...new Set([...matchWidths, ...breakpoints])].sort((a, b) => a - b);

  return app.gulp.src('dist/**/*.html')
    .pipe(cheerio($ => {
      let preloadAdded = false;

      $('img[data-src], img[src]').each(function () {
        const $img = $(this);
        const srcAttr = $img.attr('data-src') || $img.attr('src');
        if (!srcAttr || !/\.(jpg|jpeg|png)$/i.test(srcAttr)) return;

        const classList = $img.attr('class') || '';
        const alt = $img.attr('alt') || '';
        const ext = path.extname(srcAttr);
        const extClean = ext.slice(1).toLowerCase();
        const basePath = srcAttr.replace(/\.(jpg|jpeg|png)$/i, '');

        const widthMatch = classList.match(/img-(\d+)x(\d+)/);
        const width = widthMatch ? widthMatch[1] : '';
        const height = widthMatch ? widthMatch[2] : '';
        const isLazy = $img.attr('data-src') !== undefined;

        const normalizedPath = srcAttr.replace(/\\/g, '/').toLowerCase();

        const shouldContainFit = ['/icons/', '/logos/', '/svg/', '/decor/'].some(folder =>
          normalizedPath.includes(folder)
        );
        const shouldSkipPicture = ['/icons/', '/logos/'].some(folder =>
          normalizedPath.includes(folder)
        );

        // Если нужно пропустить оборачивание в <picture>
        if (shouldSkipPicture) {
          $img.attr('decoding', 'async');
          $img.attr('fetchpriority', isLazy ? 'low' : 'high');
          if (shouldContainFit) {
            $img.attr('data-fit', 'contain');
          }
          if (width) $img.attr('width', width);
          if (height) $img.attr('height', height);
          return; // оставить как есть
        }

        // Подготовка srcset
        const srcsetParts = [];
        allWidths.forEach(size => {
          const candidate = srcAttr.replace(/\.(jpg|jpeg|png)$/i, ext => `-${size}${ext}`);
          const fullPath = path.resolve('dist', candidate);
          if (fs.existsSync(fullPath)) {
            srcsetParts.push(`${candidate} ${size}w`);
          }
        });

        const retinaJpg = `${basePath}@2x.${extClean}`;
        if (fs.existsSync(path.resolve('dist', retinaJpg))) {
          srcsetParts.push(`${retinaJpg} 2x`);
        }

        const srcsetAttr = srcsetParts.length ? `srcset="${srcsetParts.join(', ')}"` : '';
        const sizesAttr = srcsetParts.length ? 'sizes="(max-width: 600px) 100vw, (max-width: 1024px) 80vw, 1200px"' : '';

        // WebP
        const webpSrcsetParts = [];
        allWidths.forEach(size => {
          const candidate = srcAttr.replace(/\.(jpg|jpeg|png)$/i, `-${size}.webp`);
          const fullPath = path.resolve('dist', candidate);
          if (fs.existsSync(fullPath)) {
            webpSrcsetParts.push(`${candidate} ${size}w`);
          }
        });

        const retinaWebp = `${basePath}@2x.webp`;
        if (fs.existsSync(path.resolve('dist', retinaWebp))) {
          webpSrcsetParts.push(`${retinaWebp} 2x`);
        }

        const webpSource = webpSrcsetParts.length
          ? `<source ${isLazy ? `data-srcset="${webpSrcsetParts.join(', ')}"` : `srcset="${webpSrcsetParts.join(', ')}"`} type="image/webp">`
          : '';

        const imgTag = `
          <img
            class="${[classList, isLazy ? 'lazy loading' : ''].filter(Boolean).join(' ')}"
            ${isLazy ? `data-src="${srcAttr}"` : `src="${srcAttr}"`}
            ${srcsetAttr}
            ${sizesAttr}
            alt="${alt}"
            decoding="async"
            fetchpriority="${isLazy ? 'low' : 'high'}"
            ${width ? `width="${width}"` : ''}
            ${height ? `height="${height}"` : ''}
            ${shouldContainFit ? 'data-fit="contain"' : ''}
          >`.trim();

        const picture = `<picture>${webpSource}${imgTag}</picture>`;
        $img.replaceWith(picture);

        // preload только для первого обычного изображения
        if (!preloadAdded && !isLazy && srcsetParts.length) {
          $('head').prepend(
            `<link rel="preload" as="image" href="${srcAttr}" imagesrcset="${srcsetParts.join(', ')}" imagesizes="${sizesAttr.replace(/^sizes="/, '').replace(/"$/, '')}">`
          );
          preloadAdded = true;
        }
      });
    }))
    .on('error', err => {
      beep();
      log.error('❌ HTML Enhance Error:', err.message);
    })
    .pipe(app.gulp.dest(app.path.build.html));
};
