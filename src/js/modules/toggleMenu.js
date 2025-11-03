/**
 * Управление мобильным меню
 * Открытие/закрытие с улучшенной доступностью и анимацией
 */

/**
 * Закрывает мобильное меню
 * @param {HTMLElement} burger - кнопка меню
 * @param {HTMLElement} nav - навигация
 * @param {HTMLElement} body - body элемент
 */
function closeMenu(burger, nav, body) {
	burger.setAttribute('aria-expanded', 'false');
	burger.classList.remove('header__burger--active');
	nav.classList.remove('header__nav--active');
	body.classList.remove('no-scroll');
	
	// Возвращаем фокус на кнопку меню
	burger.focus();
}

/**
 * Открывает мобильное меню
 * @param {HTMLElement} burger - кнопка меню
 * @param {HTMLElement} nav - навигация
 * @param {HTMLElement} body - body элемент
 */
function openMenu(burger, nav, body) {
	burger.setAttribute('aria-expanded', 'true');
	burger.classList.add('header__burger--active');
	nav.classList.add('header__nav--active');
	body.classList.add('no-scroll');
	
	// Фокус на первую ссылку в меню для доступности
	const firstLink = nav.querySelector('.header__nav-link');
	if (firstLink) {
		// Небольшая задержка для корректной анимации
		setTimeout(() => firstLink.focus(), 100);
	}
}

/**
 * Инициализация мобильного меню
 */
export function toggleMobileMenu() {
	const burger = document.querySelector('.header__burger');
	const nav = document.querySelector('.header__nav');
	const body = document.body;

	if (!burger || !nav) {
		console.warn('[Mobile Menu] Required elements not found');
		return;
	}

	// Клик по кнопке меню
	burger.addEventListener('click', () => {
		const isExpanded = burger.getAttribute('aria-expanded') === 'true';

		if (isExpanded) {
			closeMenu(burger, nav, body);
		} else {
			openMenu(burger, nav, body);
		}
	});

	// Закрытие меню при клике на ссылку
	const navLinks = nav.querySelectorAll('.header__nav-link');
	navLinks.forEach(link => {
		link.addEventListener('click', () => {
			closeMenu(burger, nav, body);
		});
	});

	// Закрытие меню при клике вне его области (на overlay)
	nav.addEventListener('click', (e) => {
		if (e.target === nav) {
			closeMenu(burger, nav, body);
		}
	});

	// Закрытие меню по клавише Escape
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			const isExpanded = burger.getAttribute('aria-expanded') === 'true';
			if (isExpanded) {
				closeMenu(burger, nav, body);
			}
		}
	});

	// Ловушка фокуса - удержание фокуса внутри меню когда оно открыто
	document.addEventListener('keydown', (e) => {
		if (e.key !== 'Tab') return;

		const isExpanded = burger.getAttribute('aria-expanded') === 'true';
		if (!isExpanded) return;

		const focusableElements = nav.querySelectorAll(
			'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
		);
		
		if (focusableElements.length === 0) return;

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		// Shift + Tab на первом элементе
		if (e.shiftKey && document.activeElement === firstElement) {
			e.preventDefault();
			lastElement.focus();
		}
		// Tab на последнем элементе
		else if (!e.shiftKey && document.activeElement === lastElement) {
			e.preventDefault();
			firstElement.focus();
		}
	});

	// Закрытие меню при изменении размера экрана (переход с мобильного на десктоп)
	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			// Закрываем меню если ширина экрана больше мобильной
			if (window.innerWidth > 768) {
				const isExpanded = burger.getAttribute('aria-expanded') === 'true';
				if (isExpanded) {
					closeMenu(burger, nav, body);
				}
			}
		}, 150);
	}, { passive: true });
}
