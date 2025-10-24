/**
 * Активация навигационных ссылок при скролле
 */
export function initActiveNav() {
  const navLinks = document.querySelectorAll('.header__nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  if (!navLinks.length || !sections.length) return;

  function setActiveLink() {
    const scrollY = window.scrollY;
    let currentSection = '';

    // Проходим по всем секциям
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      // Проверяем, находимся ли в текущей секции (с учетом header)
      if (scrollY >= sectionTop - 200) {
        currentSection = sectionId;
      }
    });

    // Убираем класс active со всех ссылок
    navLinks.forEach(link => {
      link.classList.remove('header__nav-link--active');
      
      // Находим href ссылки
      const href = link.getAttribute('href');
      
      // Если это ссылка на home (/) или (#home)
      if ((href === '/' || href === '#home') && currentSection === 'home') {
        link.classList.add('header__nav-link--active');
      }
      // Если это якорная ссылка
      else if (href.startsWith('#')) {
        const targetId = href.substring(1);
        if (targetId === currentSection) {
          link.classList.add('header__nav-link--active');
        }
      }
    });
  }

  // Вызываем при скролле с debounce для производительности
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
      setActiveLink();
    });
  }, { passive: true });
  
  // Вызываем при загрузке
  setActiveLink();

  // Плавный скролл при клике на навигацию
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
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = targetSection.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}
