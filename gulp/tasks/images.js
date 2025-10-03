import webp from 'gulp-webp';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';
import log from 'fancy-log';
import beep from 'beepbeep';
import { promises as fs } from 'fs';
import path from 'path';

// Modern image processing task
export const images = async () => {
  const srcImages = app.path.src.images;
  const buildImages = app.path.build.images;

  try {
    // Ensure output directory exists
    await fs.mkdir(buildImages, { recursive: true });

    // Process WebP versions
    await new Promise((resolve, reject) => {
      app.gulp.src(srcImages)
        .pipe(app.plugins.plumber({
          errorHandler: function (err) {
            beep();
            log.error('❌ IMAGES WebP Error:', err.message);
            reject(err);
          }
        }))
        .pipe(app.plugins.newer({ dest: buildImages, ext: '.webp' }))
        .pipe(webp({ 
          quality: app.isBuild ? 80 : 90,
          method: 6,
          crop: false,
          resize: false
        }))
        .pipe(app.gulp.dest(buildImages))
        .on('end', resolve)
        .on('error', reject);
    });

    // Process original images with modern imagemin
    if (app.isBuild) {
      const srcDir = path.dirname(srcImages.replace('**/*', ''));
      const files = await fs.readdir(srcDir, { recursive: true });
      
      for (const file of files) {
        const filePath = path.join(srcDir, file);
        const ext = path.extname(file).toLowerCase();
        
        if (['.jpg', '.jpeg', '.png', '.svg'].includes(ext)) {
          try {
            await imagemin([filePath], {
              destination: buildImages,
              plugins: [
                imageminMozjpeg({ quality: 85, progressive: true }),
                imageminOptipng({ optimizationLevel: 3 }),
                imageminSvgo({
                  plugins: [
                    { name: 'removeViewBox', active: false },
                    { name: 'cleanupIDs', active: true }
                  ]
                })
              ]
            });
          } catch (err) {
            log.warn(`⚠️ Could not optimize ${file}:`, err.message);
            // Copy original file if optimization fails
            await fs.copyFile(filePath, path.join(buildImages, file));
          }
        }
      }
    } else {
      // In dev mode, just copy files
      await new Promise((resolve, reject) => {
        app.gulp.src(srcImages)
          .pipe(app.gulp.dest(buildImages))
          .on('end', resolve)
          .on('error', reject);
      });
    }

    // Copy SVG files
    await new Promise((resolve, reject) => {
      app.gulp.src(app.path.src.svg)
        .pipe(app.gulp.dest(buildImages))
        .on('end', resolve)
        .on('error', reject);
    });

    log('✅ Images processed successfully');
    app.plugins.browserSync.reload();
    
  } catch (error) {
    beep();
    log.error('❌ Images processing failed:', error.message);
    throw error;
  }
};
