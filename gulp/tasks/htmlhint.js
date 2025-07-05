import htmlhint from 'gulp-htmlhint';
import log from 'fancy-log';
import beep from 'beepbeep';

export const hintHTML = () => {
  return app.gulp.src('dist/**/*.html')
    .pipe(app.plugins.plumber({
      errorHandler: function (err) {
        beep();
        log.error('❌ HTMLHint Error:', err.message);
        this.emit('end');
      }
    }))
    .pipe(htmlhint('.htmlhintrc'))         // путь к конфигу
    .pipe(htmlhint.reporter())             // вывод ошибок в консоль
    .pipe(htmlhint.reporter('fail'))       // завершает задачу при ошибках
};
