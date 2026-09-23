import realFavicon from 'gulp-real-favicon';
import fs from 'fs';
import path from 'path';
import log from 'fancy-log';
import beep from 'beepbeep';
import { deleteAsync } from 'del';
import gulp from 'gulp';

const FAVICON_DATA_FILE = 'faviconData.json';
const MASTER_PICTURE = 'src/favicon/favicon.png';
const DEST = 'dist/favicon/';

export const generateFavicon = async (done) => {
  if (!fs.existsSync(MASTER_PICTURE)) {
    log('ℹ️ favicon.png не найден, генерация favicon пропущена.');
    return done();
  }

  fs.mkdirSync('dist', { recursive: true });
  fs.mkdirSync(DEST, { recursive: true });

  await deleteAsync(DEST, { force: true });
  log('🧹 dist/favicon очищен');

  realFavicon.generateFavicon({
    masterPicture: MASTER_PICTURE,
    dest: DEST,
    iconsPath: '/favicon/',
    design: {
      ios: { pictureAspect: 'noChange' },
      desktopBrowser: {},
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#ffffff',
        manifest: {
          name: 'My Website',
          display: 'standalone',
          orientation: 'portrait',
          startUrl: '/',
          backgroundColor: '#ffffff',
          onConflict: 'override'
        }
      },
      safariPinnedTab: {
        pictureAspect: 'blackAndWhite',
        threshold: 60,
        themeColor: '#000000'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, (err) => {
    if (err) {
      beep();
      log.error('❌ Favicon generation error:', err.message);
      return done(err);
    }

    try {
      const webmanifestPath = path.join(DEST, 'site.webmanifest');
      if (fs.existsSync(webmanifestPath)) {
        fs.copyFileSync(webmanifestPath, 'dist/manifest.json');
        log('✅ site.webmanifest → manifest.json скопирован в dist/');
      } else {
        log('⚠️ site.webmanifest не найден в dist/favicon/');
      }
    } catch (e) {
      log('⚠️ Ошибка при копировании manifest.json:', e.message);
    }

    log('✅ Фавиконки успешно сгенерированы');
    done();
  });
};

export const injectFaviconMarkups = () => {
  if (!fs.existsSync(FAVICON_DATA_FILE)) {
    log('ℹ️ faviconData.json не найден, вставка фавиконок пропущена.');
    return Promise.resolve();
  }

  if (!fs.existsSync('dist')) {
    log('ℹ️ dist ещё не создан, вставка фавиконок пропущена.');
    return Promise.resolve();
  }

  const data = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE));
  return gulp.src('dist/**/*.html')
    .pipe(realFavicon.injectFaviconMarkups(data.favicon.html_code))
    .pipe(gulp.dest('dist'));
};

export const checkForFaviconUpdate = (done) => {
  if (!fs.existsSync(FAVICON_DATA_FILE)) {
    log('ℹ️ faviconData.json не найден, нечего проверять.');
    return done();
  }

  const currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, (err) => {
    if (err) {
      beep();
      log.error('❌ Ошибка проверки обновлений favicon:', err.message);
    } else {
      log('✅ Проверка favicon завершена. Обновлений нет.');
    }
    done();
  });
};
