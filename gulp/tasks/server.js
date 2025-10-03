export const server = (done) => {
    app.plugins.browserSync.init({
        server: {
            baseDir: `${app.path.build.html}`,
            serveStaticOptions: {
                extensions: ['html']
            }
        },
        middleware: [
            function (req, res, next) {
                if (req.url.endsWith('.css')) {
                    res.setHeader('Content-Type', 'text/css');
                }
                if (req.url.endsWith('.js')) {
                    res.setHeader('Content-Type', 'application/javascript');
                }
                if (req.url.endsWith('.json')) {
                    res.setHeader('Content-Type', 'application/json');
                }
                next();
            }
        ],
        files: [
            `${app.path.build.html}**/*.html`,
            `${app.path.build.css}**/*.css`,
            `${app.path.build.js}**/*.js`
        ],
        serveStatic: [{
            route: '',
            dir: app.path.build.html
        }],
        serveStaticOptions: {
            extensions: ['html']
        },
        notify: false,
        port: 3000,
    });

    done();
};
