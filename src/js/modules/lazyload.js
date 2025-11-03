/**
 * Ленивая загрузка изображений
 * С улучшенной поддержкой fallback и обработкой ошибок
 */

/**
 * Проверка поддержки IntersectionObserver
 */
const supportsIntersectionObserver = 'IntersectionObserver' in window;

/**
 * Загружает изображение из picture элемента
 * @param {HTMLElement} picture - picture элемент
 */
function loadPicture(picture) {
  try {
    const sources = picture.querySelectorAll('source[data-srcset]');
    const img = picture.querySelector('img');

    if (!img) {
      console.warn('[Lazy Load] Image element not found in picture');
      return;
    }

    // Подставляем srcset для source элементов
    sources.forEach(source => {
      const srcset = source.dataset.srcset;
      if (srcset) {
        source.srcset = srcset;
        source.removeAttribute('data-srcset');
      }
    });

    // Lazy-загрузка для img с data-src
    if (img.dataset.src) {
      const imgSrc = img.dataset.src;
      
      img.classList.remove('lazy');
      img.classList.add('loading');
      
      // Обработчик успешной загрузки
      img.onload = () => {
        img.classList.remove('loading');
        img.classList.add('loaded');
        img.removeAttribute('data-src');
      };
      
      // Обработчик ошибки загрузки
      img.onerror = () => {
        img.classList.remove('loading');
        img.classList.add('load-error');
        console.error(`[Lazy Load] Failed to load image: ${imgSrc}`);
        
        // Можно установить fallback изображение
        // img.src = '/path/to/fallback-image.jpg';
      };
      
      // Устанавливаем src для начала загрузки
      img.src = imgSrc;
    } else {
      // Если изображение уже загружено
      if (img.complete && img.naturalWidth > 0) {
        img.classList.remove('loading', 'lazy');
        img.classList.add('loaded');
      } else {
        img.classList.add('loading');
        
        img.onload = () => {
          img.classList.remove('loading');
          img.classList.add('loaded');
        };
        
        img.onerror = () => {
          img.classList.remove('loading');
          img.classList.add('load-error');
        };
      }
    }
  } catch (error) {
    console.error('[Lazy Load] Error loading picture:', error);
  }
}

/**
 * Инициализация ленивой загрузки изображений
 * @param {string} selector - селектор для picture элементов
 */
export function lazyLoadImages(selector = 'picture') {
  const pictures = document.querySelectorAll(selector);

  if (pictures.length === 0) {
    return;
  }

  // Fallback для старых браузеров без IntersectionObserver
  if (!supportsIntersectionObserver) {
    console.warn('[Lazy Load] IntersectionObserver not supported, loading all images immediately');
    pictures.forEach(loadPicture);
    return;
  }

  // Создаем IntersectionObserver с оптимальными настройками
  const observerConfig = {
    root: null, // viewport
    rootMargin: '50px 0px 200px 0px', // Начинаем загрузку немного заранее
    threshold: 0.01 // Минимальное пересечение для триггера
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const picture = entry.target;
        
        // Загружаем изображение
        loadPicture(picture);
        
        // Прекращаем наблюдение за этим элементом
        obs.unobserve(picture);
      }
    });
  }, observerConfig);

  // Начинаем наблюдение за всеми picture элементами
  pictures.forEach(picture => {
    // Проверяем, не загружено ли изображение уже
    const img = picture.querySelector('img');
    if (img && !img.classList.contains('loaded') && !img.classList.contains('load-error')) {
      observer.observe(picture);
    } else if (img && img.complete) {
      // Если изображение уже загружено, просто добавляем класс
      img.classList.add('loaded');
    }
  });

  // Возвращаем observer для возможности cleanup
  return observer;
}
