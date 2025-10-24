// Testimonials Swiper Slider
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

  // Небольшая задержка для корректного расчета размеров
  setTimeout(() => {
    // Создаем Swiper для всех размеров экрана
    testimonialsSwiper = new Swiper('.testimonials__slider', {
      slidesPerView: 1,
      spaceBetween: 20,
      speed: 600,
      loop: false,
      grabCursor: true,
      watchOverflow: true,
      centeredSlides: false,
      observer: true,
      observeParents: true,
      updateOnWindowResize: true,
      allowTouchMove: true,
      resistanceRatio: 0.85,
      touchRatio: 1,
      threshold: 5,
      longSwipesRatio: 0.5,
      longSwipesMs: 300,
      followFinger: true,
      slideToClickedSlide: false,
      navigation: {
        prevEl: '.testimonials__arrow--prev',
        nextEl: '.testimonials__arrow--next',
        disabledClass: 'testimonials__arrow--disabled',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 32,
        },
      },
      on: {
        init: function() {
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
        },
      }
    });
  }, 100);

  // Обработчик изменения размера окна для пересчета навигации
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (testimonialsSwiper) {
        testimonialsSwiper.update();
        updateNavButtons(testimonialsSwiper);
      }
    }, 250);
  });
};

// Функция обновления кнопок навигации
function updateNavButtons(swiper) {
  const prevButton = document.querySelector('.testimonials__arrow--prev');
  const nextButton = document.querySelector('.testimonials__arrow--next');
  
  if (!prevButton || !nextButton) {
    console.warn('Navigation buttons not found');
    return;
  }

  const currentIndex = swiper.activeIndex;
  const totalSlides = swiper.slides.length;
  
  // Получаем текущее значение slidesPerView из breakpoints
  let slidesPerView = 1;
  
  if (swiper.currentBreakpoint && swiper.params.breakpoints[swiper.currentBreakpoint]) {
    slidesPerView = swiper.params.breakpoints[swiper.currentBreakpoint].slidesPerView || 1;
  } else {
    slidesPerView = swiper.params.slidesPerView || 1;
  }
  
  // Вычисляем последний возможный индекс
  const maxIndex = Math.max(0, totalSlides - slidesPerView);
  
  // Обновление кнопки "Назад"
  if (currentIndex <= 0) {
    prevButton.style.opacity = '0';
    prevButton.style.pointerEvents = 'none';
    prevButton.setAttribute('aria-disabled', 'true');
  } else {
    prevButton.style.opacity = '1';
    prevButton.style.pointerEvents = 'auto';
    prevButton.setAttribute('aria-disabled', 'false');
  }
  
  // Обновление кнопки "Вперед"
  if (currentIndex >= maxIndex || swiper.isEnd) {
    nextButton.style.opacity = '0.3';
    nextButton.style.pointerEvents = 'none';
    nextButton.setAttribute('aria-disabled', 'true');
  } else {
    nextButton.style.opacity = '1';
    nextButton.style.pointerEvents = 'auto';
    nextButton.setAttribute('aria-disabled', 'false');
  }
}
