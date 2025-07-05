import responsive from 'gulp-responsive';
import log from 'fancy-log';
import beep from 'beepbeep';
import { responsiveWebpConfig } from '../config/responsive-config.js';

export const responsiveWebp = () => {
  return app.gulp.src([
    'src/img/**/*.{jpg,jpeg,png}',
    '!src/img/logos/**',
    '!src/img/icons/**',
    '!src/img/decor/**',
    '!src/img/svg/**'
  ])
    .pipe(app.plugins.plumber({
      errorHandler: function (err) {
        beep();
        log.error('❌ Responsive WebP Error:', err.message);
        this.emit('end');
      }
    }))
    .pipe(responsive(responsiveWebpConfig, {
      quality: 80,
      progressive: true,
      withMetadata: false,
      errorOnUnusedConfig: false,
      errorOnUnusedImage: false,
      errorOnEnlargement: false
    }))
    .pipe(app.gulp.dest(app.path.build.images));
};
