import { exec } from 'child_process';
import log from 'fancy-log';
import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fontkit = require('fontkit');

export const convertFonts = (done) => {
  exec('node gulp/tools/convert-fonts.js', (error, stdout, stderr) => {
    if (error) {
      log.error('❌ Ошибка при запуске fontmin:', error.message);
      return done(error);
    }
    if (stderr) log(stderr);
    log(stdout);
    done();
  });
};

export const fontsStyle = async (done) => {
  const fontsFile = path.resolve('src/scss/base/_fonts.scss');
  const fontsDir = path.resolve('dist/fonts');

  try {
    const exists = await fs.stat(fontsDir).catch(() => null);
    if (!exists) {
      log(`⚠️ Папка ${fontsDir} не найдена — возможно, convertFonts не сработал`);
      return done();
    }

    const fontFiles = await fs.readdir(fontsDir);
    if (!fontFiles || fontFiles.length === 0) {
      log('⚠️ Нет файлов шрифтов в dist/fonts');
      return done();
    }

    const fontMixin = `@use "sass:string";

@mixin font($font_name, $file_name, $weight, $style) {
  @font-face {
    font-family: "#{$font_name}";
    src: url("../fonts/#{$file_name}.woff2") format("woff2"),
         url("../fonts/#{$file_name}.woff") format("woff");
    font-weight: $weight;
    font-style: $style;
    font-display: swap;

    @if string.index(string.to-lower-case($file_name), "variable") {
      font-optical-sizing: auto;
      font-variation-settings: "slnt" 0;
    }
  }
}

`;

    await fs.writeFile(fontsFile, fontMixin);
    const processedFonts = new Set();

    for (const file of fontFiles) {
      const ext = path.extname(file).toLowerCase();
      const name = path.basename(file, ext);
      if (!['.woff', '.woff2'].includes(ext)) continue;
      if (processedFonts.has(name)) continue;

      const weight = getFontWeight(name);
      const include = `@include font("${name}", "${name}", ${weight}, normal);\n`;
      await fs.appendFile(fontsFile, include);
      processedFonts.add(name);

      const ttfPath = path.join(fontsDir, `${name}.ttf`);
      try {
        const ttfExists = await fs.stat(ttfPath).catch(() => null);
        if (ttfExists) {
          const font = fontkit.openSync(ttfPath);
          const realName = font.familyName;
          const isVariable = !!font.variationAxes;

          let usage = `\n// Пример использования:\nbody {\n  font-family: "${realName}", sans-serif;\n  font-weight: ${weight};\n  font-style: normal;`;
          if (isVariable) {
            usage += `\n  font-optical-sizing: auto;\n  font-variation-settings: "slnt" 0;`;
          }
          usage += `\n}\n`;
          await fs.appendFile(fontsFile, usage);
        }
      } catch (e) {
        log(`⚠️ Не удалось прочитать ${ttfPath}: ${e.message}`);
      }
    }

    log(`✅ Сгенерирован _fonts.scss с миксином, includes и примером использования`);
    done();
  } catch (err) {
    log.error('❌ Ошибка генерации fonts.scss:', err.message);
    done(err);
  }
};

function getFontWeight(fontName) {
  const name = fontName.toLowerCase();
  if (name.includes('thin')) return 100;
  if (name.includes('extralight')) return 200;
  if (name.includes('light')) return 300;
  if (name.includes('regular')) return 400;
  if (name.includes('medium')) return 500;
  if (name.includes('semibold')) return 600;
  if (name.includes('bold')) return 700;
  if (name.includes('extrabold') || name.includes('heavy')) return 800;
  if (name.includes('black')) return 900;
  return 400;
}
