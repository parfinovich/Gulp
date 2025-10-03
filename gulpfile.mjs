import gulp from "gulp";
import { path } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js";

global.app = {
    isBuild: process.argv.includes('--build'),
    isDev: !process.argv.includes('--build'),
    path: path,
    gulp: gulp,
    plugins: plugins
};

import { copy } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { generateScssIndex } from './gulp/tasks/generateScssIndex.js';
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { generateRatios } from './gulp/tasks/generateRatios.js';
import { images } from "./gulp/tasks/images.js";
import { responsiveImages } from './gulp/tasks/responsiveImages.js';
import { responsiveWebp } from './gulp/tasks/responsiveWebp.js';
import { imagesEnhanceHTML } from './gulp/tasks/htmlEnhance.js';
import { convertFonts, fontsStyle } from './gulp/tasks/fonts.js';
import { svgSprive } from "./gulp/tasks/svgSprive.js";
import { generateFavicon, injectFaviconMarkups } from './gulp/tasks/favicon.js';
import { validateHTML } from './gulp/tasks/validate.js';
import { hintHTML } from './gulp/tasks/htmlhint.js';
import { lintSCSS } from './gulp/tasks/stylelint.js';
import { zip } from "./gulp/tasks/zip.js";
import { ftp } from "./gulp/tasks/ftp.js";

function watcher() {
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.html, gulp.series(html, imagesEnhanceHTML));
    gulp.watch(path.watch.scss, gulp.series(lintSCSS, scss));
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.images, images);
}

// Exported individual tasks
export { svgSprive, validateHTML, hintHTML, lintSCSS };

// Task groups
const setupTasks = gulp.series(generateRatios, generateScssIndex, reset);
const fontTasks = gulp.series(convertFonts, fontsStyle);
const faviconTasks = gulp.series(generateFavicon, injectFaviconMarkups);

// Core build tasks (without duplicated responsive tasks)
const coreTasks = gulp.parallel(copy, html, scss, js, images);
const responsiveTasks = gulp.parallel(responsiveImages, responsiveWebp);

// Main task sequences
const mainTasks = gulp.series(
    fontTasks, 
    coreTasks,
    responsiveTasks,
    imagesEnhanceHTML
);

// Development workflow
const dev = gulp.series(
    setupTasks,
    fontTasks,
    faviconTasks,
    coreTasks,
    gulp.parallel(watcher, server)
);

// Production build
const build = gulp.series(
    setupTasks,
    fontTasks,
    faviconTasks,
    mainTasks
);

// Deployment tasks
const deployZIP = gulp.series(build, zip);
const deployFTP = gulp.series(build, ftp);

export { dev };
export { build };
export { deployZIP };
export { deployFTP };


gulp.task('default', dev);
