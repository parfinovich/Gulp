// Testimonials Swiper Slider - ИСПРАВЛЕННАЯ ВЕРСИЯ
let testimonialsSwiper = null;

export const initTestimonialsSlider = () => {
  const sliderEl = document.querySelector('.testimonials__slider');
  
  if (!sliderEl || typeof Swiper === 'undefined') {
    console.warn('Swiper element or Swiper library not found');
    return;
  }

  // Полностью уничтожаем предыдущий экземпляр
  if (testimonialsSwiper) {
    testimonialsSwiper.destroy(true, true);
    testimonialsSwiper = null;
  }

  // Очищаем инлайн-стили со всех слайдов перед инициализацией
  const slides = sliderEl.querySelectorAll('.swiper-slide');
  slides.forEach(slide => {
    slide.removeAttribute('style');
  });

  // Очищаем wrapper
  const wrapper = sliderEl.querySelector('.swiper-wrapper');
  if (wrapper) {
    wrapper.removeAttribute('style');
  }

  // Небольшая задержка для очистки DOM
  setTimeout(() => {
    testimonialsSwiper = new Swiper('.testimonials__slider', {
      slidesPerView: 'auto',
      spaceBetween: 16,
      slidesPerGroup: 1,
      speed: 500,
      loop: false,
      grabCursor: true,
      watchOverflow: true,
      centeredSlides: false,
      
      observer: false,
      observeParents: false,
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
        320: {
          slidesPerView: 'auto',
          spaceBetween: 16,
          slidesPerGroup: 1,
        },
        480: {
          slidesPerView: 'auto',
          spaceBetween: 20,
          slidesPerGroup: 1,
        },
        768: {
          slidesPerView: 'auto',
          spaceBetween: 32,
          slidesPerGroup: 1,
        },
        1024: {
          slidesPerView: 'auto',
          spaceBetween: 45,
          slidesPerGroup: 1,
        },
      },
      
      on: {
        init: function() {
          console.log('Swiper initialized');
          fixSlideWidths(this);
          updateNavButtons(this);
        },
        slideChange: function() {
          updateNavButtons(this);
        },
        resize: function() {
          fixSlideWidths(this);
          updateNavButtons(this);
        },
        breakpoint: function(swiper, breakpointParams) {
          console.log('Breakpoint changed:', breakpointParams);
          setTimeout(() => {
            fixSlideWidths(swiper);
            swiper.update();
            updateNavButtons(swiper);
          }, 50);
        }
      }
    });

    // Дополнительная проверка после инициализации
    setTimeout(() => {
      if (testimonialsSwiper) {
        fixSlideWidths(testimonialsSwiper);
        testimonialsSwiper.update();
      }
    }, 100);
  }, 150);
};

// ИСПРАВЛЕННАЯ ФУНКЦИЯ: принудительно задаем правильную ширину слайдов
function fixSlideWidths(swiper) {
  const slides = swiper.slides;
  const containerWidth = swiper.el.offsetWidth;
  const spaceBetween = swiper.params.spaceBetween || 16;
  const windowWidth = window.innerWidth;
  
  slides.forEach((slide) => {
    // Сбрасываем предыдущие стили
    slide.style.width = '';
    slide.style.maxWidth = '';
    slide.style.minWidth = '';
    
    if (windowWidth < 768) {
      // На мобильных - полная ширина контейнера
      slide.style.width = `${containerWidth}px`;
      slide.style.maxWidth = '100%';
    } else if (windowWidth < 1024) {
      // На планшетах - 90% контейнера, но не больше 400px
      const slideWidth = Math.min(containerWidth * 0.9, 400);
      slide.style.width = `${slideWidth}px`;
      slide.style.maxWidth = '400px';
    } else {
      // На десктопе - фиксированная ширина 400px
      slide.style.width = '400px';
      slide.style.maxWidth = '400px';
    }
  });
  
  // Принудительное обновление Swiper
  swiper.update();
}

// Функция обновления кнопок навигации
function updateNavButtons(swiper) {
  const prevButton = document.querySelector('.testimonials__arrow--prev');
  const nextButton = document.querySelector('.testimonials__arrow--next');
  
  if (!prevButton || !nextButton) return;

  const isBeginning = swiper.isBeginning;
  const isEnd = swiper.isEnd;
  
  const updateButtonState = (button, isDisabled) => {
    if (isDisabled) {
      button.style.opacity = '0';
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

let isInitialized = false;
document.addEventListener('DOMContentLoaded', () => {
  if (!isInitialized) {
    isInitialized = true;
    initTestimonialsSlider();
  }
});
