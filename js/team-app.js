// ─── Team Page Bootstrap ──────────────────────────────────────────────────────
import { initHeaderScroll, initMobileMenu, initScrollReveal } from './ui.js';

async function loadComponents() {
  const placeholders = document.querySelectorAll('[data-include]');
  await Promise.all([...placeholders].map(async placeholder => {
    try {
      const response = await fetch(placeholder.dataset.include);
      if (!response.ok) throw new Error(`Gagal memuat ${placeholder.dataset.include}`);
      placeholder.outerHTML = await response.text();
    } catch (error) {
      console.error('Component load error:', error);
      placeholder.outerHTML = '';
    }
  }));
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadComponents();
  } catch (error) {
    console.error('Error loading components:', error);
  }

  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();

  // Mark "Tim Kami" nav link as active
  document.querySelectorAll('.header__nav-link').forEach(link => {
    link.classList.remove('header__nav-link--active');
    if (link.id === 'nav-admin') {
      link.classList.add('header__nav-link--active');
    }
  });
});
