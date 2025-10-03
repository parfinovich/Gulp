import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';
import autoPrefixer from 'gulp-autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import log from 'fancy-log';
import beep from 'beepbeep';

const sass = gulpSass(dartSass);

export const scss = () => {
 	return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
	.pipe(app.plugins.plumber({
		errorHandler: function (err) {
			beep();
			log.error('❌ SCSS Error:', err.message);
			this.emit('end');
		}
	}))
    .pipe(app.plugins.replace(/@img\//g, '../img/'))
    .pipe(sass({ 
      outputStyle: app.isBuild ? 'compressed' : 'expanded',
      includePaths: ['node_modules'],
      silenceDeprecations: ['legacy-js-api', 'color-4-api']
    }))
    .pipe(autoPrefixer({
      grid: true,
      overrideBrowserslist: ['last 2 versions', '> 1%', 'ie >= 11']
    }))
    .pipe(app.plugins.if(app.isBuild, groupCssMediaQueries()))
    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(app.plugins.if(app.isBuild, cleanCss({
      level: 2,
      compatibility: 'ie11'
    })))
    .pipe(app.plugins.if(app.isBuild, rename({ extname: '.min.css' })))
    .pipe(app.plugins.if(app.isBuild, app.gulp.dest(app.path.build.css)))
    .pipe(app.plugins.browserSync.stream());
};
