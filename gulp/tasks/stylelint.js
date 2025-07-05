import gulpStylelint from 'gulp-stylelint';

export const lintSCSS = () => {
  return app.gulp.src('src/scss/**/*.scss')
    .pipe(gulpStylelint({
      fix: true,
      reporters: [
        { formatter: 'string', console: true }
      ],
      failAfterError: false
    }));
};
