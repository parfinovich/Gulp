import { configFTP } from '../config/ftp.js';
import vinylFTP from 'vinyl-ftp';
import log from 'fancy-log';
import beep from 'beepbeep';

export const ftp = () => {
    configFTP.log = log;
    const ftpConnect = vinylFTP.create(configFTP);

    return app.gulp.src(`${app.path.buildFolder}/**/*.*`, {})
        .pipe(app.plugins.plumber({
            errorHandler: function (err) {
                beep();
                log.error('❌ FTP Error:', err.message);
                this.emit('end');
            }
        }))
        .pipe(ftpConnect.dest(`/${app.path.ftp}/${app.path.rootFolder}`));
};
