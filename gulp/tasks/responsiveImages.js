import responsive from 'gulp-responsive';
import log from 'fancy-log';
import beep from 'beepbeep';
import responsiveConfig from '../config/responsive-config.js';

export const responsiveImages = () => {
  return app.gulp.src([
    'src/img/**/*.{jpg,jpeg,png}',  // включить все изображения
    '!src/img/icons/**',            // исключить служебные
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
      quality: 80,               // компромисс между размером и качеством
      progressive: true,         // прогрессивная загрузка JPEG
      withMetadata: false,       // без EXIF-данных
      errorOnUnusedConfig: false,
      errorOnUnusedImage: false,
      errorOnEnlargement: false  // не увеличивать картинки сверх исходного
    }))
    .pipe(app.gulp.dest(app.path.build.images));
};
