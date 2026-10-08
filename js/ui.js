export function initHeaderScroll() {
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = currentScroll;
  });
}

export function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
    });

    nav.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
      });
    });
  }
}

export function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

export function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link');
  const header = document.getElementById('header');
  const navigableSections = [...sections].filter(section =>
    [...navLinks].some(link => {
      const href = link.getAttribute('href') || '';
      return href === `#${section.id}` || href.endsWith(`#${section.id}`);
    })
  );

  function updateActiveLink() {
    const activationPoint = (header ? header.offsetHeight : 0) + 24;
    let activeSection = navigableSections[0];

    for (const section of navigableSections) {
      if (section.getBoundingClientRect().top > activationPoint) break;
      activeSection = section;
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const isActive = activeSection &&
        (href === `#${activeSection.id}` || href.endsWith(`#${activeSection.id}`));
      link.classList.toggle('header__nav-link--active', Boolean(isActive));
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);
  updateActiveLink();
}
