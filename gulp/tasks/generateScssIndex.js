import fs from 'fs';
import path from 'path';
import log from 'fancy-log';
import beep from 'beepbeep';

export const generateScssIndex = () => {
  const dir = './src/scss/base';
  const indexFile = path.join(dir, '_index.scss');
  const exclude = ['_index.scss', '_fonts.scss', '_generated-ratios.scss'];

  try {
    const files = fs.readdirSync(dir)
      .filter(file =>
        file.endsWith('.scss') &&
        file.startsWith('_') &&
        !exclude.includes(file)
      )
      .map(file => `@forward '${file.slice(1, -5)}';`);

    fs.writeFileSync(indexFile, files.join('\n') + '\n');

    beep();
    log(`✅ Сгенерирован SCSS index: ${indexFile}`);
  } catch (err) {
    log.error(`❌ Ошибка генерации _index.scss: ${err.message}`);
  }

  return Promise.resolve();
};
