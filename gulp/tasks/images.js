import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';
import log from 'fancy-log';
import beep from 'beepbeep';

export const images = () => {
  return app.gulp.src(app.path.src.images)
    .pipe(app.plugins.plumber({
      errorHandler: function (err) {
        beep();
        log.error('❌ IMAGES Error:', err.message);
        this.emit('end');
      }
    }))

    // New images only
    .pipe(app.plugins.newer(app.path.build.images))

    // Generate WebP
    .pipe(webp())
    .pipe(app.gulp.dest(app.path.build.images))

    // Повторно читаем исходники для оригиналов
    .pipe(app.gulp.src(app.path.src.images))
    .pipe(app.plugins.newer(app.path.build.images))

    // Optimize images
    .pipe(
      app.plugins.if(
        app.isBuild,
        imagemin([
          imagemin.mozjpeg({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 3 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: false }]
          })
        ])
      )
    )
    .pipe(app.gulp.dest(app.path.build.images))

    // SVG copy
    .pipe(app.gulp.src(app.path.src.svg))
    .pipe(app.gulp.dest(app.path.build.images))

    // Reload browser
    .pipe(app.plugins.browserSync.stream());
};
