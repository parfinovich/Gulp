document.addEventListener('DOMContentLoaded', () => {
  const yearNode = document.querySelector('[data-year]');

  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  console.info('Clean project initialized');
});
