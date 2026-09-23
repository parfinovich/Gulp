import stylelint from 'stylelint';
import log from 'fancy-log';
import beep from 'beepbeep';

export const lintSCSS = async () => {
  try {
    const result = await stylelint.lint({
      files: 'src/scss/**/*.scss',
      fix: true,
      formatter: 'string'
    });

    if (result.output) {
      const output = result.output.trim();
      if (output) {
        log(output);
      }
    }

    if (result.errored) {
      log.warn('⚠️ SCSS lint warnings found');
    }
  } catch (err) {
    beep();
    log.error('❌ SCSS lint Error:', err.message);
  }
};
