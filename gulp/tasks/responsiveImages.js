import responsive from 'gulp-responsive';
import log from 'fancy-log';
import beep from 'beepbeep';
import responsiveConfig from '../config/responsive-config.js';

export const responsiveImages = () => {
  return app.gulp.src([
    'src/img/**/*.{jpg,jpeg,png}',  // Enable responsive images for these formats
    '!src/img/icons/**',
    '!src/img/logos/**',
    '!src/img/svg/**',
    '!src/img/decor/**'
  ])
    .pipe(app.plugins.plumber({
      errorHandler: function (err) {
        beep();
        log.error('❌ Responsive Images Error:', err.message);
        this.emit('end');
      }
    }))
    .pipe(responsive(responsiveConfig, {
      quality: 80,
      progressive: true,
      withMetadata: false,
      errorOnUnusedConfig: false,
      errorOnUnusedImage: false,
      errorOnEnlargement: false
    }))
    .pipe(app.gulp.dest(app.path.build.images));
};
