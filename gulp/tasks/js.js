import webpack from 'webpack-stream';
import log from 'fancy-log';
import beep from 'beepbeep';

export const js = () => {
  return app.gulp.src(app.path.src.js, { sourcemaps: app.isDev })
    .pipe(app.plugins.plumber({
      errorHandler: function (err) {
        beep();
        log.error('❌ JS Error:', err.message);
        this.emit('end');
      }
    }))
    .pipe(webpack({
      mode: app.isBuild ? 'production' : 'development',
      devtool: app.isDev ? 'source-map' : false,
      output: {
        filename: 'app.min.js'
      },
      optimization: {
        minimize: app.isBuild
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      }
    }))
    .pipe(app.gulp.dest(app.path.build.js, { sourcemaps: app.isDev }))
    .pipe(app.plugins.browserSync.stream());
};
