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
