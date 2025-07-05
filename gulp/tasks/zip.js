import { deleteAsync } from 'del';
import zipPlugin from 'gulp-zip';
import log from 'fancy-log';
import beep from 'beepbeep';

export const zip = async () => {
  try {
    // Удаляем старый архив, если есть
    await deleteAsync(`./${app.path.rootFolder}.zip`);

    return app.gulp.src(`${app.path.buildFolder}/**/*.*`, {})
      .pipe(app.plugins.plumber({
        errorHandler: function (err) {
          beep();
          log.error('❌ ZIP Error:', err.message);
          this.emit('end');
        }
      }))
      .pipe(zipPlugin(`${app.path.rootFolder}.zip`))
      .pipe(app.gulp.dest('./'));
  } catch (err) {
    beep();
    log.error('❌ Ошибка удаления старого архива:', err.message);
  }
};
