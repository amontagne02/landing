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
