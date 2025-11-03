/**
 * Активация навигационных ссылок при скролле
 * Оптимизированная версия с кэшированием и throttling
 */

// Кэш для хранения позиций секций
let sectionsCache = null;
let headerHeight = 0;

/**
 * Обновляет кэш секций
 */
function updateSectionsCache() {
  const sections = document.querySelectorAll('section[id]');
  const header = document.querySelector('.header');
  
  headerHeight = header ? header.offsetHeight : 0;
  
  sectionsCache = Array.from(sections).map(section => ({
    id: section.getAttribute('id'),
    top: section.offsetTop,
    bottom: section.offsetTop + section.offsetHeight
  }));
}

/**
 * Throttle функция для ограничения частоты вызовов
 * @param {Function} func - функция для выполнения
 * @param {number} wait - время ожидания в мс
 * @returns {Function} - throttled функция
 */
function throttle(func, wait) {
  let timeout = null;
  let lastTime = 0;
  
  return function executedFunction(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastTime;
    
    const callFunc = () => {
      lastTime = now;
      func.apply(this, args);
    };
    
    if (timeSinceLastCall >= wait) {
      callFunc();
    } else {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(callFunc, wait - timeSinceLastCall);
    }
  };
}

/**
 * Инициализация активной навигации
 */
export function initActiveNav() {
  const navLinks = document.querySelectorAll('.header__nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  if (!navLinks.length || !sections.length) {
    console.warn('[Active Nav] Required elements not found');
    return;
  }

  // Создаем карту ссылок для быстрого поиска
  const linkMap = new Map();
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const targetId = href.startsWith('#') ? href.substring(1) : (href === '/' ? 'home' : null);
      if (targetId) {
        linkMap.set(targetId, link);
      }
    }
  });

  // Инициализируем кэш секций
  updateSectionsCache();

  /**
   * Устанавливает активную ссылку
   */
  function setActiveLink() {
    if (!sectionsCache) return;

    const scrollY = window.scrollY + headerHeight + 100; // Смещение для точности
    let currentSection = '';

    // Находим текущую секцию
    for (const section of sectionsCache) {
      if (scrollY >= section.top && scrollY < section.bottom) {
        currentSection = section.id;
        break;
      }
    }

    // Если не нашли секцию и скролл вверху, устанавливаем home
    if (!currentSection && window.scrollY < 100) {
      currentSection = 'home';
    }

    // Обновляем активные классы
    linkMap.forEach((link, targetId) => {
      if (targetId === currentSection) {
        link.classList.add('header__nav-link--active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('header__nav-link--active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Используем throttle для оптимизации
  const throttledSetActiveLink = throttle(setActiveLink, 100);

  // Слушаем скролл с пассивным режимом для производительности
  window.addEventListener('scroll', throttledSetActiveLink, { passive: true });
  
  // Обновляем кэш при изменении размера окна
  const throttledUpdateCache = throttle(() => {
    updateSectionsCache();
    setActiveLink();
  }, 250);
  
  window.addEventListener('resize', throttledUpdateCache, { passive: true });
  
  // Вызываем при загрузке
  setActiveLink();

  /**
   * Плавный скролл при клике на навигацию
   */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Для Home ссылки
      if (href === '/' || href === '#home') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      // Только для якорных ссылок
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const header = document.querySelector('.header');
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = targetSection.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Обновляем активную ссылку после скролла
          setTimeout(() => setActiveLink(), 500);
        }
      }
    });
  });
}
