import svgSprite from 'gulp-svg-sprite';
import log from 'fancy-log';
import beep from 'beepbeep';

export const svgSprive = () => {
  return app.gulp.src(app.path.src.svgicons)
    .pipe(app.plugins.plumber({
      errorHandler: function (err) {
        beep();
        log.error('❌ SVG Sprite Error:', err.message);
        this.emit('end');
      }
    }))
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../icons/icons.svg',
          example: false
        }
      },
      shape: {
        transform: [
          {
            svgo: {
              plugins: [
                { removeViewBox: false },
                { cleanupIDs: false }
              ]
            }
          }
        ]
      }
    }))
    .pipe(app.gulp.dest(app.path.build.images));
};
