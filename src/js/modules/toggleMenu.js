export function toggleMobileMenu() {
	const burger = document.querySelector('.header__burger');
	const menu = document.getElementById('mobileMenu');

	if (!burger || !menu) return;

	burger.addEventListener('click', () => {
	const expanded = burger.getAttribute('aria-expanded') === 'true';

	// Переключаем aria
	burger.setAttribute('aria-expanded', String(!expanded));

	// Переключаем видимость меню
	menu.hidden = expanded;

	// Классы для анимации (добавь по желанию в CSS)
	burger.classList.toggle('header__burger--active');
	menu.classList.toggle('header__mobile-nav--open');
	});
}
