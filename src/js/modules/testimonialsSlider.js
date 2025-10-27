// Testimonials Swiper Slider - ИСПРАВЛЕННАЯ ВЕРСИЯ ДЛЯ ВЫРАВНИВАНИЯ
let testimonialsSwiper = null;

export const initTestimonialsSlider = () => {
  const sliderEl = document.querySelector('.testimonials__slider');
  
  if (!sliderEl || typeof Swiper === 'undefined') {
    console.warn('Swiper element or Swiper library not found');
    return;
  }

  // Уничтожаем предыдущий если существует
  if (testimonialsSwiper) {
    testimonialsSwiper.destroy(true, true);
    testimonialsSwiper = null;
  }

  setTimeout(() => {
    testimonialsSwiper = new Swiper('.testimonials__slider', {
      // Основные параметры
      slidesPerView: 'auto', // Автоматическое определение количества слайдов
      spaceBetween: 32, // Отступ между карточками
      speed: 500,
      loop: false,
      grabCursor: true,
      watchOverflow: true,
      centeredSlides: false, // Не центрировать слайды
      
      // Важные параметры для корректной работы
      observer: true,
      observeParents: true,
      updateOnWindowResize: true,
      resizeObserver: true,
      
      // Настройки свайпов
      allowTouchMove: true,
      resistanceRatio: 0.7,
      
      // Навигация
      navigation: {
        prevEl: '.testimonials__arrow--prev',
        nextEl: '.testimonials__arrow--next',
        disabledClass: 'testimonials__arrow--disabled',
      },
      
      // Breakpoints - для правильного выравнивания
      breakpoints: {
        // Мобильные устройства
        0: {
          slidesPerView: 1,
          spaceBetween: 16,
          slidesPerGroup: 1,
          centeredSlides: false,
        },
        // Десктоп - используем auto для фиксированной ширины 400px
        768: {
          slidesPerView: 2,
          spaceBetween: 45,
          slidesPerGroup: 2,
          centeredSlides: false,
        },
      },
      
      on: {
        init: function() {
          updateNavButtons(this);
          // Гарантируем правильную ширину после инициализации
          setTimeout(() => {
            this.update();
            updateNavButtons(this);
          }, 100);
        },
        slideChange: function() {
          updateNavButtons(this);
        },
        resize: function() {
          this.update();
          updateNavButtons(this);
        },
        breakpoint: function() {
          this.update();
          updateNavButtons(this);
        }
      }
    });
  }, 100);
};

// Функция обновления кнопок навигации
function updateNavButtons(swiper) {
  const prevButton = document.querySelector('.testimonials__arrow--prev');
  const nextButton = document.querySelector('.testimonials__arrow--next');
  
  if (!prevButton || !nextButton) return;

  const isBeginning = swiper.isBeginning;
  const isEnd = swiper.isEnd;
  
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

export const destroyTestimonialsSlider = () => {
  if (testimonialsSwiper) {
    testimonialsSwiper.destroy(true, true);
    testimonialsSwiper = null;
  }
};

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', initTestimonialsSlider);
