/**
 * Testimonials Swiper Slider
 * Управляет инициализацией и работой слайдера отзывов
 */
let testimonialsSwiper = null;
let initializationTimeout = null;

/**
 * Инициализация слайдера отзывов
 */
export const initTestimonialsSlider = () => {
  const sliderEl = document.querySelector('.testimonials__slider');
  
  // Проверка наличия элемента и библиотеки Swiper
  if (!sliderEl) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Testimonials Slider] Slider element not found');
    }
    return;
  }

  if (typeof Swiper === 'undefined') {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Testimonials Slider] Swiper library not loaded');
    }
    return;
  }

  // Уничтожаем предыдущий экземпляр если существует
  if (testimonialsSwiper) {
    testimonialsSwiper.destroy(true, true);
    testimonialsSwiper = null;
  }

  // Очищаем предыдущий таймаут
  if (initializationTimeout) {
    clearTimeout(initializationTimeout);
  }

  // Инициализируем с небольшой задержкой для корректной загрузки
  initializationTimeout = setTimeout(() => {
    try {
      testimonialsSwiper = new Swiper('.testimonials__slider', {
        slidesPerView: 1,
        spaceBetween: 16,
        slidesPerGroup: 1,
        speed: 500,
        loop: false,
        grabCursor: true,
        watchOverflow: true,
        
        // Включаем observer для отслеживания изменений DOM
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        updateOnWindowResize: true,
        resizeObserver: true,
        
        allowTouchMove: true,
        resistanceRatio: 0.85,
        touchRatio: 1,
        threshold: 5,
        
        navigation: {
          prevEl: '.testimonials__arrow--prev',
          nextEl: '.testimonials__arrow--next',
          disabledClass: 'testimonials__arrow--disabled',
        },
        
        breakpoints: {
          // Мобильные: 1 слайд
          320: {
            slidesPerView: 1,
            spaceBetween: 16,
            slidesPerGroup: 1,
          },
          // Планшет: 2 слайда
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
            slidesPerGroup: 1,
          },
          // Десктоп: 2 слайда
          1024: {
            slidesPerView: 2,
            spaceBetween: 32,
            slidesPerGroup: 1,
          },
        },
        
        on: {
          init: function() {
            updateNavButtons(this);
          },
          slideChange: function() {
            updateNavButtons(this);
          },
          resize: function() {
            updateNavButtons(this);
          },
          breakpoint: function(swiper) {
            updateNavButtons(swiper);
          }
        }
      });

      // Дополнительное обновление после инициализации
      setTimeout(() => {
        if (testimonialsSwiper) {
          testimonialsSwiper.update();
          updateNavButtons(testimonialsSwiper);
        }
      }, 100);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Testimonials Slider] Initialization error:', error);
      }
    }
  }, 50);
};

/**
 * Обновление состояния кнопок навигации
 * @param {Object} swiper - экземпляр Swiper
 */
function updateNavButtons(swiper) {
  const prevButton = document.querySelector('.testimonials__arrow--prev');
  const nextButton = document.querySelector('.testimonials__arrow--next');
  
  if (!prevButton || !nextButton) return;

  const isBeginning = swiper.isBeginning;
  const isEnd = swiper.isEnd;
  
  /**
   * Обновление состояния кнопки
   * @param {HTMLElement} button - кнопка навигации
   * @param {boolean} isDisabled - состояние кнопки
   */
  const updateButtonState = (button, isDisabled) => {
    if (isDisabled) {
      button.style.opacity = '0.3';
      button.style.pointerEvents = 'none';
      button.setAttribute('aria-disabled', 'true');
      button.classList.add('testimonials__arrow--disabled');
    } else {
      button.style.opacity = '1';
      button.style.pointerEvents = 'auto';
      button.setAttribute('aria-disabled', 'false');
      button.classList.remove('testimonials__arrow--disabled');
    }
  };
  
  updateButtonState(prevButton, isBeginning);
  updateButtonState(nextButton, isEnd);
}

/**
 * Уничтожение экземпляра слайдера
 */
export const destroyTestimonialsSlider = () => {
  if (testimonialsSwiper) {
    testimonialsSwiper.destroy(true, true);
    testimonialsSwiper = null;
  }
  
  if (initializationTimeout) {
    clearTimeout(initializationTimeout);
    initializationTimeout = null;
  }
};

// Реинициализация при изменении размера окна (с throttling)
let resizeTimeout = null;
window.addEventListener('resize', () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  
  resizeTimeout = setTimeout(() => {
    if (testimonialsSwiper) {
      testimonialsSwiper.update();
      updateNavButtons(testimonialsSwiper);
    }
  }, 150);
}, { passive: true });
