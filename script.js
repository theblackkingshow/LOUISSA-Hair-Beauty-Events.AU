const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
for (const link of document.querySelectorAll('.site-nav a[href]')) {
  const linkPath = link.getAttribute('href');
  if (linkPath === currentPath || (currentPath === 'index.html' && linkPath === '#events')) {
    link.setAttribute('aria-current', 'page');
  }
}

const yearNode = document.querySelector('[data-year]');
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const revealNodes = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.14 }
  );

  revealNodes.forEach(node => observer.observe(node));
} else {
  revealNodes.forEach(node => node.classList.add('is-visible'));
}

const bookingForm = document.querySelector('[data-booking-form]');
const confirmation = document.querySelector('[data-booking-confirmation]');

if (bookingForm && confirmation) {
  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    const service = formData.get('service');
    const stylist = formData.get('stylist');
    const date = formData.get('date');
    const time = formData.get('time');
    confirmation.innerHTML = `
      <strong>Booking request received.</strong>
      <p>Your ${service} appointment with ${stylist} is reserved for ${date} at ${time}. We will confirm by phone or email shortly.</p>
    `;
    confirmation.classList.add('is-visible');
    confirmation.focus();
  });
}

for (const form of document.querySelectorAll('[data-soft-submit]')) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = form.querySelector('[data-form-message]');
    if (message) {
      message.textContent = 'Thank you. Your enquiry has been received and our team will be in touch shortly.';
    }
    form.reset();
  });
}
