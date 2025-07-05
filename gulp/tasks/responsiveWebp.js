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
      quality: 80,                   // WebP сжатие
      progressive: true,             // JPEG fallback (если будет)
      withMetadata: false,           // без EXIF-данных
      errorOnUnusedConfig: false,    // не падать, если нет соответствия
      errorOnUnusedImage: false,     // не ругаться на лишние картинки
      errorOnEnlargement: false      // не увеличивать
    }))
    .pipe(app.gulp.dest(app.path.build.images));
};
