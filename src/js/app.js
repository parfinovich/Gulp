import { initialize } from './core/initialize.js';
import { initAnchorLinks } from './components/anchor-links.js';

const start = () => {
  initialize([initAnchorLinks]);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
