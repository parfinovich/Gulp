import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';
import autoPrefixer from 'gulp-autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import log from 'fancy-log';
import beep from 'beepbeep';
import postcss from 'gulp-postcss';
import postcssConfig from '../../postcss.config.js'; // ⚠️ путь может отличаться

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
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(app.plugins.if(app.isBuild, groupCssMediaQueries()))
    .pipe(postcss(postcssConfig.plugins)) // ✅ заменили webpcss на PostCSS

    .pipe(app.plugins.if(app.isBuild, autoPrefixer({
		grid: true,
		overrideBrowserslist: ['last 3 versions'],
		cascade: true
    })))

    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(app.plugins.if(app.isBuild, cleanCss()))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(app.plugins.browserSync.stream());
};
