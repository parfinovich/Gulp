import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import htmlValidator from 'html-validator';
import log from 'fancy-log';
import beep from 'beepbeep';

export const validateHTML = async () => {
  const files = await globby('dist/**/*.html');
  let hasError = false;

  if (!files.length) {
    log.warn('⚠️ Нет HTML-файлов для проверки в dist/');
    return;
  }

  for (const file of files) {
    try {
      const html = fs.readFileSync(file, 'utf8');

      const result = await htmlValidator({
        data: html,
        format: 'text'
      });

      if (result.trim()) {
        beep();
        log.warn(`⚠️  W3C issues in: ${file}\n${result}`);
        hasError = true;
      } else {
        log(`✅ ${file} — валиден`);
      }

    } catch (err) {
      beep();
      log.error(`❌ Ошибка валидации ${file}:\n${err.message}`);
      hasError = true;
    }
  }

  if (hasError) {
    log.warn('🚫 Некоторые HTML-файлы содержат ошибки W3C.');
  } else {
    log('🎉 Все HTML-файлы прошли W3C-проверку!');
  }
};
