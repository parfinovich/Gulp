/**
 * Управление мобильным меню
 */
export function toggleMobileMenu() {
	const burger = document.querySelector('.header__burger');
	const nav = document.querySelector('.header__nav');
	const body = document.body;

	if (!burger || !nav) return;

	burger.addEventListener('click', () => {
		const isExpanded = burger.getAttribute('aria-expanded') === 'true';

		// Переключаем состояние
		burger.setAttribute('aria-expanded', String(!isExpanded));
		burger.classList.toggle('header__burger--active');
		nav.classList.toggle('header__nav--active');
		body.classList.toggle('no-scroll');
	});

	// Закрытие меню при клике на ссылку
	const navLinks = nav.querySelectorAll('.header__nav-link');
	navLinks.forEach(link => {
		link.addEventListener('click', () => {
			burger.setAttribute('aria-expanded', 'false');
			burger.classList.remove('header__burger--active');
			nav.classList.remove('header__nav--active');
			body.classList.remove('no-scroll');
		});
	});

	// Закрытие меню при клике вне его области
	nav.addEventListener('click', (e) => {
		if (e.target === nav) {
			burger.setAttribute('aria-expanded', 'false');
			burger.classList.remove('header__burger--active');
			nav.classList.remove('header__nav--active');
			body.classList.remove('no-scroll');
		}
	});
}

