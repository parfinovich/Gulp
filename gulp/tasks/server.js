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
                // Устанавливаем правильные MIME-типы
                if (req.url.endsWith('.css')) {
                    res.setHeader('Content-Type', 'text/css');
                }
                if (req.url.endsWith('.js')) {
                    res.setHeader('Content-Type', 'application/javascript');
                }
                if (req.url.endsWith('.json')) {
                    res.setHeader('Content-Type', 'application/json');
                }
                // Отключаем CORS для external UI
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                next();
            }
        ],
        serveStatic: [{
            route: '',
            dir: app.path.build.html
        }],
        serveStaticOptions: {
            extensions: ['html']
        },
        notify: false,
        port: 3002,
        // Убираем host: 0.0.0.0 - BrowserSync сам определит правильный IP
        // Показываем все доступные URL
        ui: false,
        // Добавляем задержку для предотвращения множественных перезагрузок
        reloadDelay: 100,
        reloadDebounce: 500,
        // Логирование для отладки
        logLevel: 'info',
        logPrefix: 'BS',
    });

    done();
};

