export function lazyLoadImages(selector = 'picture') {
  const pictures = document.querySelectorAll(selector);

  if (!('IntersectionObserver' in window)) {
    pictures.forEach(loadPicture);
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadPicture(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px 200px 0px', threshold: 0.01 });

  pictures.forEach(p => observer.observe(p));

  function loadPicture(picture) {
    const sources = picture.querySelectorAll('source[data-srcset]');
    const img = picture.querySelector('img');

    // ✅ Подставляем srcset для source
    sources.forEach(source => {
      source.srcset = source.dataset.srcset;
      source.removeAttribute('data-srcset');
    });

    if (!img) return;

    // ✅ Lazy-загрузка, если есть data-src
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.classList.remove('lazy');
      img.classList.add('loading');
    }

    // ✅ Ставим loaded для всех изображений — lazy или обычных
    if (img.complete) {
      img.classList.remove('loading');
      img.classList.add('loaded');
    } else {
      img.onload = () => {
        img.classList.remove('loading');
        img.classList.add('loaded');
      };
    }
  }
}
