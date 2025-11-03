/**
 * Contact Modal
 * Управляет открытием/закрытием модального окна для формы контакта
 */

let modal = null;
let modalContainer = null;
let openButtons = [];
let closeButtons = [];
let isOpen = false;

/**
 * Вычисляет ширину скроллбара
 */
const getScrollbarWidth = () => {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);
  
  const inner = document.createElement('div');
  outer.appendChild(inner);
  
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  
  return scrollbarWidth;
};

/**
 * Открывает модальное окно
 */
const openModal = (e) => {
  if (e) {
    e.preventDefault();
  }
  
  if (!modal || isOpen) return;
  
  // Блокируем скролл body
  const scrollbarWidth = getScrollbarWidth();
  document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
  document.body.classList.add('modal-open');
  
  // Показываем модальное окно
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  isOpen = true;
  
  // Фокусируем первый input
  setTimeout(() => {
    const firstInput = modal.querySelector('input');
    if (firstInput) {
      firstInput.focus();
    }
  }, 100);
  
  // Добавляем обработчик Escape
  document.addEventListener('keydown', handleEscape);
};

/**
 * Закрывает модальное окно
 */
const closeModal = () => {
  if (!modal || !isOpen) return;
  
  // Убираем блокировку скролла
  document.body.classList.remove('modal-open');
  document.body.style.removeProperty('--scrollbar-width');
  
  // Скрываем модальное окно
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  isOpen = false;
  
  // Убираем обработчик Escape
  document.removeEventListener('keydown', handleEscape);
  
  // Очищаем форму
  const form = modal.querySelector('form');
  if (form) {
    form.reset();
  }
};

/**
 * Обработчик клавиши Escape
 */
const handleEscape = (e) => {
  if (e.key === 'Escape' || e.keyCode === 27) {
    closeModal();
  }
};

/**
 * Обработчик клика вне модального окна
 */
const handleOverlayClick = (e) => {
  if (e.target.hasAttribute('data-modal-close')) {
    closeModal();
  }
};

/**
 * Инициализация модального окна
 */
export const initContactModal = () => {
  // Находим модальное окно
  modal = document.getElementById('contact-modal');
  
  if (!modal) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Contact Modal] Modal element not found');
    }
    return;
  }
  
  modalContainer = modal.querySelector('.modal__container');
  
  // Находим кнопки открытия (только на десктопе)
  openButtons = document.querySelectorAll('.header__button');
  
  if (openButtons.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Contact Modal] No open buttons found');
    }
  }
  
  // Находим кнопки закрытия
  closeButtons = modal.querySelectorAll('[data-modal-close]');
  
  // Проверяем ширину экрана и устанавливаем обработчики
  const setupEventListeners = () => {
    const isDesktop = window.innerWidth >= 768;
    
    // Удаляем предыдущие обработчики
    openButtons.forEach(btn => {
      btn.removeEventListener('click', openModal);
    });
    
    // На десктопе и планшетах - открываем модалку
    // На мобильных - оставляем обычную ссылку
    if (isDesktop) {
      openButtons.forEach(btn => {
        btn.addEventListener('click', openModal);
      });
    }
  };
  
  // Устанавливаем обработчики при инициализации
  setupEventListeners();
  
  // Обновляем при изменении размера окна
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setupEventListeners, 150);
  });
  
  // Обработчики закрытия
  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });
  
  // Клик вне модального окна
  modal.addEventListener('click', handleOverlayClick);
  
  // Предотвращаем закрытие при клике внутри контейнера
  if (modalContainer) {
    modalContainer.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  
  // Обработка формы в модальном окне
  const modalForm = modal.querySelector('[data-modal-form]');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Получаем данные формы
      const formData = new FormData(modalForm);
      const data = Object.fromEntries(formData);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[Contact Modal] Form submitted:', data);
      }
      
      // Здесь можно добавить отправку данных на сервер
      
      // Показываем успешное сообщение
      alert('Thank you for your message! We\'ll get back to you soon.');
      
      // Закрываем модалку
      closeModal();
    });
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[Contact Modal] Initialized successfully');
  }
};

/**
 * Экспортируем функции для внешнего использования
 */
export { openModal, closeModal };
