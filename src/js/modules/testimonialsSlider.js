// Testimonials Swiper Slider - УПРОЩЕННАЯ ВЕРСИЯ
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
    testimonialsSwiper = new Swiper('.testimonials__slider', {
      // Основные параметры
      // По умолчанию показываем 1 слайд — это безопасно для мобильных устройств.
      slidesPerView: 1,
      spaceBetween: 20,
      speed: 600,
      loop: false,
      grabCursor: true,
      watchOverflow: true,
      centeredSlides: false,
      
      // Важные параметры для корректной работы
      observer: true,
      observeParents: true,
      updateOnWindowResize: true,
      resizeObserver: false, // Отключаем чтобы избежать конфликтов
      
      // Настройки свайпов
      allowTouchMove: true,
      resistanceRatio: 0.85,
      
      // Навигация
      navigation: {
        prevEl: '.testimonials__arrow--prev',
        nextEl: '.testimonials__arrow--next',
        disabledClass: 'testimonials__arrow--disabled',
      },
      
      // Breakpoints: на мобильных показываем 1 слайд, на >=768 — 2
      breakpoints: {
        // Мобильные устройства — 1 слайд (в сочетании с CSS это даёт корректную ширину)
        0: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        // От 768px - показываем по 2 карточки
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
            enforceMobileSlideWidths(this);
          }, 100);
        },
        slideChange: function() {
          updateNavButtons(this);
        },
        resize: function() {
          this.update();
          updateNavButtons(this);
          enforceMobileSlideWidths(this);
        },
        breakpoint: function() {
          setTimeout(() => {
            this.update();
            updateNavButtons(this);
            enforceMobileSlideWidths(this);
          }, 50);
        },
      }
    });
  }, 100);

  // Обработчик изменения размера окна
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (testimonialsSwiper) {
        testimonialsSwiper.update();
        updateNavButtons(testimonialsSwiper);
        // Принудительно применяем защитные стили при изменении размера окна
        try {
          enforceMobileSlideWidths(testimonialsSwiper);
        } catch (e) {}
      }
    }, 250);
  });
};

// Функция обновления кнопок навигации (без изменений)
function updateNavButtons(swiper) {
  const prevButton = document.querySelector('.testimonials__arrow--prev');
  const nextButton = document.querySelector('.testimonials__arrow--next');
  
  if (!prevButton || !nextButton) {
    console.warn('Navigation buttons not found');
    return;
  }

  const isBeginning = swiper.isBeginning;
  const isEnd = swiper.isEnd;
  
  // Обновление кнопки "Назад"
  if (isBeginning) {
    prevButton.style.opacity = '0';
    prevButton.style.pointerEvents = 'none';
    prevButton.setAttribute('aria-disabled', 'true');
    prevButton.classList.add('testimonials__arrow--disabled');
  } else {
    prevButton.style.opacity = '1';
    prevButton.style.pointerEvents = 'auto';
    prevButton.setAttribute('aria-disabled', 'false');
    prevButton.classList.remove('testimonials__arrow--disabled');
  }
  
  // Обновление кнопки "Вперед"
  if (isEnd) {
    nextButton.style.opacity = '0.3';
    nextButton.style.pointerEvents = 'none';
    nextButton.setAttribute('aria-disabled', 'true');
    nextButton.classList.add('testimonials__arrow--disabled');
  } else {
    nextButton.style.opacity = '1';
    nextButton.style.pointerEvents = 'auto';
    nextButton.setAttribute('aria-disabled', 'false');
    nextButton.classList.remove('testimonials__arrow--disabled');
  }
}

// Защитная функция: на мобильных экранах сбрасываем inline-width от Swiper
// и принудительно ограничиваем max-width, чтобы карточки не тянулись слишком широко.
function enforceMobileSlideWidths(swiper) {
  try {
    const isMobile = window.innerWidth < 768;
    const slides = Array.from(swiper.slides || []);

    slides.forEach(slide => {
      if (isMobile) {
        // Убираем потенциальные конфликтующие свойства
        slide.style.removeProperty('min-width');
        // Принудительно выставляем ширину 100% через inline-стиль с !important
        slide.style.setProperty('width', '100%', 'important');
        slide.style.setProperty('max-width', '100%', 'important');
        slide.style.setProperty('box-sizing', 'border-box', 'important');

        // Также ограничим ширину самой карточки внутри слайда, если она есть
        const card = slide.querySelector && slide.querySelector('.testimonial-card');
        if (card) {
          card.style.setProperty('width', '100%', 'important');
          card.style.setProperty('max-width', '100%', 'important');
          card.style.setProperty('box-sizing', 'border-box', 'important');
        }
      } else {
        // на десктопе даём Swiper установить ширины сам — убираем наши защитные стили
        slide.style.removeProperty('width');
        slide.style.removeProperty('max-width');
        slide.style.removeProperty('box-sizing');

        const card = slide.querySelector && slide.querySelector('.testimonial-card');
        if (card) {
          card.style.removeProperty('width');
          card.style.removeProperty('max-width');
          card.style.removeProperty('box-sizing');
        }
      }
    });

    // Обновляем Swiper после изменений
    setTimeout(() => {
      if (swiper && typeof swiper.update === 'function') swiper.update();
    }, 20);
  } catch (e) {
    // безопасный лог — не ломаем основной поток
    // console.warn('enforceMobileSlideWidths error', e);
  }
}

export const destroyTestimonialsSlider = () => {
  if (testimonialsSwiper) {
    testimonialsSwiper.destroy(true, true);
    testimonialsSwiper = null;
  }
};
