const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

const yearNode = document.querySelector('[data-year]');
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
for (const link of document.querySelectorAll('.site-nav a[href]')) {
  const linkPath = link.getAttribute('href');
  if (linkPath && linkPath === currentPath) {
    link.setAttribute('aria-current', 'page');
  }
}
