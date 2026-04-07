const faqTriggers = document.querySelectorAll('.faq-trigger');

faqTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.faq-item');
    if (!item) return;

    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    faqTriggers.forEach((node) => {
      node.setAttribute('aria-expanded', 'false');
      node.closest('.faq-item')?.classList.remove('is-open');
    });

    if (!expanded) {
      trigger.setAttribute('aria-expanded', 'true');
      item.classList.add('is-open');
    }
  });
});

const revealNodes = document.querySelectorAll('.reveal');

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, io) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -36px 0px'
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add('visible'));
}

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileNavClose = document.querySelector('.mobile-nav-close');
const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

function openMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.add('is-open');
  mobileNav.setAttribute('aria-hidden', 'false');
  if (mobileNavOverlay) mobileNavOverlay.classList.add('is-open');
  if (menuToggle) {
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
  }
  document.body.classList.add('mobile-nav-open');
  if (mobileNavClose) mobileNavClose.focus();
}

function closeMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.remove('is-open');
  mobileNav.setAttribute('aria-hidden', 'true');
  if (mobileNavOverlay) mobileNavOverlay.classList.remove('is-open');
  if (menuToggle) {
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  document.body.classList.remove('mobile-nav-open');
  if (menuToggle) menuToggle.focus();
}

if (menuToggle) menuToggle.addEventListener('click', openMobileNav);
if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);

mobileNavLinks.forEach((link) => {
  link.addEventListener('click', closeMobileNav);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) {
    closeMobileNav();
  }
});

const telefonoInput = document.getElementById('telefono');
const viaPreferidaGroup = document.getElementById('via-preferida-group');

if (telefonoInput && viaPreferidaGroup) {
  telefonoInput.addEventListener('input', () => {
    if (telefonoInput.value.trim() !== '') {
      viaPreferidaGroup.style.display = 'block';
    } else {
      viaPreferidaGroup.style.display = 'none';
    }
  });
}

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    const existingStatus = contactForm.querySelector('.form-status');
    if (existingStatus) existingStatus.remove();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          'Accept': 'application/json'
        }
      });

      const statusDiv = document.createElement('div');
      statusDiv.className = 'form-status';

      if (response.ok) {
        statusDiv.classList.add('success');
        statusDiv.textContent = '¡Gracias! Su mensaje ha sido enviado correctamente. Nos pondremos en contacto pronto.';
        contactForm.reset();
        if (viaPreferidaGroup) viaPreferidaGroup.style.display = 'none';
      } else {
        statusDiv.classList.add('error');
        const data = await response.json();
        statusDiv.textContent = data.error || 'Hubo un problema al enviar el mensaje. Por favor intente de nuevo.';
      }

      contactForm.appendChild(statusDiv);
    } catch (error) {
      const statusDiv = document.createElement('div');
      statusDiv.className = 'form-status error';
      statusDiv.textContent = 'Hubo un error de conexión. Por favor intente de nuevo.';
      contactForm.appendChild(statusDiv);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}
