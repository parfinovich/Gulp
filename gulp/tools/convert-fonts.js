import Fontmin from 'fontmin';
import beep from 'beepbeep';
import log from 'fancy-log';
import fs from 'fs';

// Search for the source and destination folders
const srcFolder = 'src/fonts';
const distFolder = 'dist/fonts';

if (!fs.existsSync(srcFolder)) {
  log.warn(`⚠️ Папка ${srcFolder} не найдена. Шрифты не будут сконвертированы.`);
  process.exit(0);
}

// Fontmin pipeline
const fontmin = new Fontmin()
  .src(`${srcFolder}/*.{otf,ttf}`)
  .use(Fontmin.otf2ttf())
  .use(Fontmin.ttf2woff())
  .use(Fontmin.ttf2woff2())
  .dest(distFolder);

// Run conversion
fontmin.run((err) => {
  if (err) {
    beep();
    log.error('❌ FontMin Error:', err.message);
    process.exit(1);
  }

  beep();
  log(`✅ Шрифты успешно сконвертированы в: ${distFolder}`);
});
