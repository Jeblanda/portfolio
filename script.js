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
    { selector: '.ticker p', effect: 'reveal-sweep', delayStep: 0 },
    { selector: '.ticker li', effect: 'reveal-chip', delayStep: 45 },
    { selector: '.spotlight-media', effect: 'reveal-tilt-left', delayStep: 0 },
    { selector: '.spotlight-copy', effect: 'reveal-slide-right', delayStep: 120 },
    { selector: '.spotlight-points li', effect: 'reveal-chip', delayStep: 60 },
    { selector: '.spotlight-actions .button', effect: 'reveal-pop', delayStep: 70 },
    { selector: '.section-heading', effect: 'reveal-heading', delayStep: 0 },
    { selector: '.work-card', effect: 'reveal-card', delayStep: 85 },
    { selector: '.credentials-heading', effect: 'reveal-heading', delayStep: 0 },
    { selector: '.certificate-card', effect: 'reveal-soft', delayStep: 75 },
    { selector: '.badge-card', effect: 'reveal-soft', delayStep: 90 },
    { selector: '.linkedin-card', effect: 'reveal-soft', delayStep: 120 },
    { selector: '.stack-section > div', effect: 'reveal-heading', delayStep: 0 },
    { selector: '.stack-list li', effect: 'reveal-pop', delayStep: 55 },
    { selector: '.contact-panel', effect: 'reveal-sweep', delayStep: 0 },
    { selector: '.site-footer', effect: 'reveal-soft', delayStep: 0 },
  ];

  const revealTargets = [];
  document.body.classList.add('has-reveal');

  revealGroups.forEach(({ selector, effect, delayStep }) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('reveal', effect);
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
    rootMargin: '0px 0px 12% 0px',
    threshold: 0.08,
  });

  revealTargets.forEach((element) => {
    const rect = element.getBoundingClientRect();

    if (rect.top < window.innerHeight * 1.1 && rect.bottom > -80) {
      requestAnimationFrame(() => element.classList.add('is-visible'));
      return;
    }

    revealObserver.observe(element);
  });
}

function initInteractiveTilt() {
  if (reducedMotionQuery.matches || !window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  const tiltTargets = [
    { selector: '.showcase-browser', baseRotation: 1.5, lift: -12, scale: 1.018 },
    { selector: '.spotlight-media', baseRotation: -1.2, lift: -10, scale: 1.018 },
    { selector: '.work-card-featured', baseRotation: 0, lift: -6, scale: 1.012 },
    { selector: '.work-card-spotlight', baseRotation: 0, lift: -6, scale: 1.012 },
  ];

  tiltTargets.forEach(({ selector, baseRotation, lift, scale }) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.addEventListener('pointermove', (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const tiltX = (y * -8).toFixed(2);
        const tiltY = (x * 8).toFixed(2);

        element.style.transform = `perspective(900px) translateY(${lift}px) rotate(${baseRotation}deg) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;
      });

      element.addEventListener('pointerleave', () => {
        element.style.transform = '';
      });
    });
  });
}

initInteractiveTilt();
initScrollReveal();
