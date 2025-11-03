/**
 * Параллакс эффект для Hero секции
 * Оптимизированная версия с проверкой поддержки и отключением на мобильных
 */

// Проверка поддержки transform
const supportsTransform = CSS.supports('transform', 'translate3d(0, 0, 0)');
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/**
 * Инициализация параллакс эффекта
 */
export function initHeroParallax() {
    const hero = document.querySelector('.hero');
    const about = document.querySelector('.about');
    
    if (!hero || !about) {
        console.warn('[Hero Parallax] Required elements not found');
        return;
    }

    // Отключаем параллакс на мобильных устройствах для производительности
    if (isMobile || window.innerWidth < 768) {
        return;
    }

    // Проверка поддержки transform
    if (!supportsTransform) {
        console.warn('[Hero Parallax] Transform not supported');
        return;
    }

    let ticking = false;
    let heroHeight = hero.offsetHeight;
    let isActive = true;

    /**
     * Обновляет параллакс эффект
     */
    function updateParallax() {
        if (!isActive) return;

        const scrolled = window.pageYOffset;

        if (scrolled < heroHeight) {
            // Hero уходит медленнее (0.5x скорость скролла)
            const heroTranslate = scrolled * 0.5;
            hero.style.transform = `translate3d(0, ${heroTranslate}px, 0)`;
            hero.style.willChange = 'transform';
            
            // About наезжает сразу с начала скролла
            const aboutTranslate = Math.max(0, heroHeight - scrolled);
            about.style.transform = `translate3d(0, ${aboutTranslate}px, 0)`;
            about.style.willChange = 'transform';
        } else {
            // Финальные позиции
            hero.style.transform = `translate3d(0, ${heroHeight * 0.5}px, 0)`;
            about.style.transform = 'translate3d(0, 0, 0)';
            
            // Убираем will-change для оптимизации
            hero.style.willChange = 'auto';
            about.style.willChange = 'auto';
        }

        ticking = false;
    }

    /**
     * Обработчик скролла с requestAnimationFrame
     */
    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateParallax);
        }
    }

    // Слушаем скролл с пассивным режимом
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Обновление высоты при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            heroHeight = hero.offsetHeight;
            
            // Отключаем параллакс если перешли на мобильный размер
            if (window.innerWidth < 768) {
                isActive = false;
                hero.style.transform = '';
                about.style.transform = '';
                hero.style.willChange = 'auto';
                about.style.willChange = 'auto';
            } else {
                isActive = true;
                updateParallax();
            }
        }, 150);
    }, { passive: true });
    
    // Инициализация
    updateParallax();

    // Cleanup функция для остановки эффекта
    return function cleanup() {
        isActive = false;
        window.removeEventListener('scroll', onScroll);
        hero.style.transform = '';
        about.style.transform = '';
        hero.style.willChange = 'auto';
        about.style.willChange = 'auto';
    };
}
