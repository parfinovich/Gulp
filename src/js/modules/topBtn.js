/**
 * Кнопка "Вверх"
 * С throttling и улучшенной доступностью
 */

/**
 * Throttle функция для ограничения частоты вызовов
 * @param {Function} func - функция для выполнения
 * @param {number} delay - задержка в мс
 * @returns {Function} - throttled функция
 */
function throttle(func, delay) {
  let timeoutId = null;
  let lastExecTime = 0;

  return function(...args) {
    const currentTime = Date.now();
    const timeSinceLastExec = currentTime - lastExecTime;

    const execute = () => {
      lastExecTime = currentTime;
      func.apply(this, args);
    };

    if (timeSinceLastExec >= delay) {
      execute();
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(execute, delay - timeSinceLastExec);
    }
  };
}

/**
 * Инициализация кнопки "Вверх"
 */
export function topButton() {
  const scrollBtn = document.querySelector('.scroll-top');
  
  if (!scrollBtn) {
    console.warn('[Top Button] Button element not found');
    return;
  }

  // Константа для видимости кнопки
  const SCROLL_THRESHOLD = 300;
  
  /**
   * Показывает/скрывает кнопку в зависимости от позиции скролла
   */
  function toggleButtonVisibility() {
    const shouldShow = window.scrollY > SCROLL_THRESHOLD;
    
    if (shouldShow) {
      scrollBtn.classList.add('visible');
      scrollBtn.setAttribute('aria-hidden', 'false');
      scrollBtn.tabIndex = 0;
    } else {
      scrollBtn.classList.remove('visible');
      scrollBtn.setAttribute('aria-hidden', 'true');
      scrollBtn.tabIndex = -1;
    }
  }

  // Используем throttle для оптимизации
  const throttledToggle = throttle(toggleButtonVisibility, 100);
  
  // Слушаем скролл с пассивным режимом для производительности
  window.addEventListener('scroll', throttledToggle, { passive: true });

  // Клик по кнопке
  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Возвращаем фокус на начало страницы для доступности
    setTimeout(() => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus({ preventScroll: true });
      }
    }, 500);
  });

  // Обработка клавиатуры для доступности
  scrollBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollBtn.click();
    }
  });

  // Инициализация состояния кнопки
  toggleButtonVisibility();
}
