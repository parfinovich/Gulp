/**
 * Прогресс-бар чтения страницы
 * Показывает прогресс прокрутки страницы в header
 */
export function initProgressBar() {
    const progressBar = document.querySelector('.header__progress');
    if (!progressBar) return;

    function updateProgress() {
        // Вычисляем общую высоту документа
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Вычисляем процент прокрутки
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        // Обновляем ширину прогресс-бара
        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
        
        // Обновляем ARIA атрибуты для доступности
        progressBar.setAttribute('aria-valuenow', Math.round(scrollPercent));
    }

    // Обновляем прогресс при скролле с debounce
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Инициализируем прогресс при загрузке
    updateProgress();
}
