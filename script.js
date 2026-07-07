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

const packageBuilder = document.querySelector('[data-package-builder]');

if (packageBuilder) {
  const brandNode = document.querySelector('.brand strong');
  const brandName = brandNode && brandNode.textContent ? brandNode.textContent.trim() : 'the studio';
  const packageName = packageBuilder.querySelector('[data-package-name]');
  const packageTotal = packageBuilder.querySelector('[data-package-total]');
  const packageNote = packageBuilder.querySelector('[data-package-note]');
  const packageList = packageBuilder.querySelector('[data-package-list]');
  const guestCount = packageBuilder.querySelector('[data-guest-count]');
  const eventType = packageBuilder.querySelector('[data-event-type]');
  const whatsappLink = packageBuilder.querySelector('[data-package-whatsapp]');
  const contactLink = packageBuilder.querySelector('[data-package-contact]');

  const updatePackage = () => {
    const selectedBase = packageBuilder.querySelector('input[name="basePackage"]:checked');
    const selectedExtras = Array.from(packageBuilder.querySelectorAll('input[type="checkbox"]:checked'));
    const guests = Math.max(Number(guestCount?.value) || 10, 10);
    const event = eventType?.value || 'Event';
    const baseValue = selectedBase ? selectedBase.value : 'Custom package';
    const items = selectedBase ? [baseValue, ...selectedExtras.map(item => item.value)] : selectedExtras.map(item => item.value);

    if (packageName) {
      packageName.textContent = `${event} - ${baseValue}`;
    }
    if (packageTotal) {
      packageTotal.textContent = 'Tailored quote';
    }
    if (packageNote) {
      packageNote.textContent = `Estimated for ${guests} guests. Final quote depends on venue access, travel, hire items, and floral availability.`;
    }
    if (packageList) {
      packageList.innerHTML = items.length > 0 ? items.map(item => `<li>${item}</li>`).join('') : '<li>No package options selected</li>';
    }

    const message = [
      `Hello ${brandName}, I would like a quote for this package.`,
      '',
      `Event type: ${event}`,
      `Guest count: ${guests}`,
      `Base package: ${baseValue}`,
      `Add-ons: ${selectedExtras.map(item => item.value).join(', ') || 'None'}`,
      '',
      'Please confirm availability and final quote.',
      'Event date:',
      'Venue/location:',
    ].join('\n');

    if (whatsappLink) {
      whatsappLink.href = `https://wa.me/61417713516?text=${encodeURIComponent(message)}`;
    }
    if (contactLink) {
      contactLink.href = `contact.html?package=${encodeURIComponent(message)}`;
    }
  };

  packageBuilder.addEventListener('input', updatePackage);
  packageBuilder.addEventListener('change', updatePackage);
  updatePackage();
}

const packageMessage = new URLSearchParams(window.location.search).get('package');
if (packageMessage) {
  const messageField = document.querySelector('.contact-form textarea[name="message"]');
  const typeField = document.querySelector('.contact-form select[name="type"], .contact-form select[name="service"]');
  if (messageField) {
    messageField.value = packageMessage;
  }
  if (typeField) {
    const option = Array.from(typeField.options).find(item => /package|quote/i.test(item.textContent));
    if (option) {
      typeField.value = option.value;
    }
  }
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

// Fallbacks for broken or missing images (replaces with a working gallery image)
(function() {
  const fallback = 'assets/site-images/11-warm-string-lights-candles-event-ambient-lighting.jpg';

  const applyFallback = img => {
    if (!img || img.__fallbackApplied || img.src.endsWith(fallback)) {
      return;
    }

    img.__fallbackApplied = true;
    img.onerror = null;
    img.src = fallback;
  };

  // Replace only genuinely broken <img> sources and avoid cascading replacement.
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => applyFallback(img));
    img.addEventListener('load', () => {
      if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
        applyFallback(img);
      }
    });

    if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
      applyFallback(img);
    }
  });

  // Preload and validate hero/background images defined by CSS var --hero-image
  const heroNodes = Array.from(document.querySelectorAll('[style*="--hero-image"]'));
  heroNodes.forEach(node => {
    try {
      const style = getComputedStyle(node).getPropertyValue('--hero-image');
      const match = style && style.match(/url\(["']?(.*?)["']?\)/);
      const url = match ? match[1] : null;
      if (url) {
        const img = new Image();
        img.onload = () => {};
        img.onerror = () => {
          node.style.setProperty('--hero-image', `url('${fallback}')`);
        };
        img.src = url;
      }
    } catch (e) {
      // ignore
    }
  });
})();
