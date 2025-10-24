// FAQ Accordion functionality
export function initFaqAccordion() {
  const faqItems = document.querySelectorAll('[data-faq-item]');

  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const button = item.querySelector('[data-faq-button]');
    const content = item.querySelector('[data-faq-content]');
    const contentInner = content.querySelector('.faq__answer-inner');

    if (!button || !content || !contentInner) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-active');

      // Закрываем все остальные аккордеоны
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          const otherButton = otherItem.querySelector('[data-faq-button]');
          const otherContent = otherItem.querySelector('[data-faq-content]');
          
          otherItem.classList.remove('is-active');
          otherButton.setAttribute('aria-expanded', 'false');
          otherContent.style.maxHeight = null;
        }
      });

      // Переключаем текущий аккордеон
      if (isOpen) {
        item.classList.remove('is-active');
        button.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        item.classList.add('is-active');
        button.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = contentInner.scrollHeight + 'px';
      }
    });
  });

  // Открываем первый элемент по умолчанию
  if (faqItems[0]) {
    const firstButton = faqItems[0].querySelector('[data-faq-button]');
    const firstContent = faqItems[0].querySelector('[data-faq-content]');
    const firstContentInner = firstContent.querySelector('.faq__answer-inner');
    
    faqItems[0].classList.add('is-active');
    firstButton.setAttribute('aria-expanded', 'true');
    firstContent.style.maxHeight = firstContentInner.scrollHeight + 'px';
  }
}
