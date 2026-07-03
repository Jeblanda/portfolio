const root = document.documentElement;
const header = document.querySelector('[data-header]');
const themeToggle = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-label');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const savedTheme = localStorage.getItem('portfolio-theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

setTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'), false);

function setTheme(theme, persist = true) {
  const isDark = theme === 'dark';
  root.dataset.theme = isDark ? 'dark' : 'light';

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  if (themeLabel) {
    themeLabel.textContent = isDark ? 'Light' : 'Dark';
  }

  if (persist) {
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  }
}

themeToggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
});

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('is-open') || false;
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

function updateHeaderShadow() {
  header?.classList.toggle('is-scrolled', window.scrollY > 10);
}

updateHeaderShadow();
window.addEventListener('scroll', updateHeaderShadow, { passive: true });

function initScrollReveal() {
  if (reducedMotionQuery.matches || !('IntersectionObserver' in window)) {
    return;
  }

  const revealGroups = [
    ['.ticker', 0],
    ['.section-heading', 0],
    ['.work-card', 85],
    ['.credentials-heading', 0],
    ['.certificate-card', 75],
    ['.badge-card', 90],
    ['.linkedin-card', 120],
    ['.stack-section > div', 0],
    ['.stack-list li', 55],
    ['.contact-panel', 0],
    ['.site-footer', 0],
  ];

  const revealTargets = [];
  document.body.classList.add('has-reveal');

  revealGroups.forEach(([selector, delayStep]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index, 5) * delayStep}ms`);
      revealTargets.push(element);
    });
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.14,
  });

  revealTargets.forEach((element) => revealObserver.observe(element));
}

initScrollReveal();
