/**
 * Параллакс эффект - секция about наезжает на hero при скролле
 */
export function initHeroParallax() {
    const hero = document.querySelector('.hero');
    const about = document.querySelector('.about');
    
    if (!hero || !about) return;

    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            // Hero уходит медленнее
            const heroTranslate = scrolled * 0.5;
            hero.style.transform = `translate3d(0, ${heroTranslate}px, 0)`;
            
            // About наезжает сразу с начала скролла
            const aboutTranslate = heroHeight - scrolled;
            about.style.transform = `translate3d(0, ${aboutTranslate}px, 0)`;
        } else {
            hero.style.transform = `translate3d(0, ${heroHeight * 0.5}px, 0)`;
            about.style.transform = 'translate3d(0, 0, 0)';
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateParallax);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Инициализация
    updateParallax();
}
