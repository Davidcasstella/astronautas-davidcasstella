(() => {
  const header = document.querySelector('#site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const dialog = document.querySelector('#ticket-dialog');
  const ticketForm = document.querySelector('#ticket-form');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeMenu = () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  document.querySelectorAll('[data-open-tickets]').forEach((button) => {
    button.addEventListener('click', () => {
      closeMenu();
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    });
  });

  dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) dialog.close();
  });

  ticketForm.addEventListener('submit', (event) => {
    event.preventDefault();
    ticketForm.hidden = true;
    dialog.querySelector('.form-success').hidden = false;
  });

  document.querySelectorAll('[data-card-detail]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.exhibit-card');
      card.animate(
        [{ boxShadow: '0 0 0 rgba(240,42,42,0)' }, { boxShadow: '0 0 48px rgba(240,42,42,.28)' }, { boxShadow: '0 0 0 rgba(240,42,42,0)' }],
        { duration: 700, easing: 'ease-out' }
      );
    });
  });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach((item) => revealObserver.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add('is-visible'));
  }

  const sections = [...document.querySelectorAll('[data-section]')];
  const railLinks = [...document.querySelectorAll('[data-rail-link]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const value = entry.target.dataset.section;
        railLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.railLink === value));
      });
    }, { rootMargin: '-42% 0px -42% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 30);
      ticking = false;
    });
  }, { passive: true });

  if (!reduceMotion && matchMedia('(pointer: fine)').matches) {
    const hero = document.querySelector('.hero');
    const astronaut = document.querySelector('.astronaut-wrap');
    hero.addEventListener('pointermove', (event) => {
      const x = (event.clientX / window.innerWidth - .5) * 12;
      const y = (event.clientY / window.innerHeight - .5) * 9;
      astronaut.style.marginRight = `${x}px`;
      astronaut.style.marginTop = `${y}px`;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      astronaut.style.marginRight = '';
      astronaut.style.marginTop = '';
    });
  }
})();
