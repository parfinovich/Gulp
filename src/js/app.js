import * as flsFunctions from "./modules/functions.js";
import { lazyLoadImages } from './modules/lazyload.js';
import { observeElements } from './modules/observe.js';
import { toggleMobileMenu } from './modules/toggleMenu.js';
import { topButton } from "./modules/topBtn.js";
import { setRealVH } from "./modules/RealVH.js";

flsFunctions.isWebp();

import Swiper, { Navigation, Pagination } from "swiper";

const swiper = new Swiper();

window.addEventListener('DOMContentLoaded', () => {
    observeElements();
    lazyLoadImages();
    toggleMobileMenu();
    topButton();
    setRealVH();
});