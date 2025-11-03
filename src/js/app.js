/**
 * Главный файл приложения
 * Инициализация всех модулей с обработкой ошибок
 */
import * as flsFunctions from "./modules/functions.js";
import { lazyLoadImages } from './modules/lazyload.js';
import { observeElements } from './modules/observe.js';
import { toggleMobileMenu } from './modules/toggleMenu.js';
import { topButton } from "./modules/topBtn.js";
import { setRealVH } from "./modules/RealVh.js";
import { initTestimonialsSlider } from "./modules/testimonialsSlider.js";
import { initProgressBar } from "./modules/progressBar.js";
import { initHeroParallax } from "./modules/heroParallax.js";
import { initFaqAccordion } from "./modules/faqAccordion.js";
import { initContactForm } from "./modules/contactForm.js";
import { initActiveNav } from "./modules/activeNav.js";
import { initContactModal } from "./modules/contactModal.js";

// Проверка WebP поддержки
flsFunctions.isWebp();

/**
 * Безопасная инициализация модуля с обработкой ошибок
 * @param {Function} initFunction - функция инициализации модуля
 * @param {string} moduleName - название модуля для логирования
 */
function safeInit(initFunction, moduleName) {
  try {
    initFunction();
  } catch (error) {
    console.error(`[${moduleName}] Initialization error:`, error);
  }
}

/**
 * Обработчик скролла для header
 */
function handleHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) {
    console.warn('[Header Scroll] Header element not found');
    return;
  }

  let ticking = false;
  const SCROLL_THRESHOLD = 50;

  function updateHeader() {
    const shouldAddClass = window.scrollY > SCROLL_THRESHOLD;
    
    if (shouldAddClass) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // Инициализация состояния
  updateHeader();
}

/**
 * Инициализация критичных модулей (до DOMContentLoaded)
 */
function initCriticalModules() {
  // Установка реальной высоты viewport для мобильных устройств
  safeInit(setRealVH, 'RealVH');
}

/**
 * Инициализация основных модулей (после DOMContentLoaded)
 */
function initMainModules() {
  // Модули для наблюдения и анимации
  safeInit(observeElements, 'Observe Elements');
  safeInit(lazyLoadImages, 'Lazy Load');
  
  // UI компоненты
  safeInit(toggleMobileMenu, 'Mobile Menu');
  safeInit(topButton, 'Top Button');
  safeInit(handleHeaderScroll, 'Header Scroll');
  safeInit(initProgressBar, 'Progress Bar');
  safeInit(initActiveNav, 'Active Nav');
  
  // Интерактивные компоненты
  safeInit(initHeroParallax, 'Hero Parallax');
  safeInit(initFaqAccordion, 'FAQ Accordion');
  safeInit(initContactForm, 'Contact Form');
  safeInit(initContactModal, 'Contact Modal');
}

/**
 * Инициализация модулей, требующих полной загрузки страницы
 */
function initPostLoadModules() {
  // Слайдер инициализируется после полной загрузки всех ресурсов
  safeInit(initTestimonialsSlider, 'Testimonials Slider');
}

// Критичные модули - выполняются сразу
initCriticalModules();

// Основные модули - после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMainModules);
} else {
  // DOM уже загружен
  initMainModules();
}

// Модули после полной загрузки страницы
window.addEventListener('load', initPostLoadModules);

// Обработка ошибок на уровне приложения
window.addEventListener('error', (event) => {
  console.error('[Global Error]:', event.error || event.message);
});

// Обработка необработанных промисов
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]:', event.reason);
});
