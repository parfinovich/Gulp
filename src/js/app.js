import * as flsFunctions from "./modules/functions.js";
import { lazyLoadImages } from './modules/lazyload.js';
import { observeElements } from './modules/observe.js';
import { toggleMobileMenu } from './modules/toggleMenu.js';
import { topButton } from "./modules/topBtn.js";
import { setRealVH } from "./modules/RealVH.js";
import { initTestimonialsSlider } from "./modules/testimonialsSlider.js";
import { initProgressBar } from "./modules/progressBar.js";
import { initHeroParallax } from "./modules/heroParallax.js";
import { initFaqAccordion } from "./modules/faqAccordion.js";
import { initContactForm } from "./modules/contactForm.js";
import { initActiveNav } from "./modules/activeNav.js";

flsFunctions.isWebp();

// Добавление класса header при скролле
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    observeElements();
    lazyLoadImages();
    toggleMobileMenu();
    topButton();
    setRealVH();
    handleHeaderScroll();
    initTestimonialsSlider();
    initProgressBar();
    initHeroParallax();
    initFaqAccordion();
    initContactForm();
    initActiveNav();
});
