import nunjucksRender from "gulp-nunjucks-render";
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import replace from "gulp-replace";
import fsExtra from "fs-extra";
import log from "fancy-log";
import beep from "beepbeep";

export const html = () => {
  const version = Date.now();

  if (app.isBuild) {
    fsExtra.ensureDirSync('./gulp');
    fsExtra.writeJsonSync('./gulp/version.json', { main: version });
  }

  return app.gulp.src(app.path.src.html)
    .pipe(app.plugins.plumber({
      errorHandler: function (err) {
        beep();
        log.error('❌ HTML Error:', err.message);
        this.emit('end');
      }
    }))
    .pipe(nunjucksRender({
      path: ['src/templates'],
      trimBlocks: true,
      lstripBlocks: true,
      data: {
        site: fsExtra.readJsonSync('src/data/site.json'),
        home: fsExtra.readJsonSync('src/data/home.json')
      }
    }))
    .pipe(app.plugins.replace(/@img\//g, 'img/'))
    .pipe(
      app.plugins.if(
        app.isBuild,
        webpHtmlNosvg()
      )
    )
    .pipe(
      app.plugins.if(
        app.isBuild,
        replace(/(\.css|\.js)(\?[^"']*)?/g, `$1?_v=${version}`)
      )
    )
    .pipe(app.gulp.dest(app.path.build.html))
    .pipe(app.plugins.browserSync.stream());
};
