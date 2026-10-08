import { loadData, recipesData, kecamatanData, kategoriData } from './state.js';
import { populateKecamatanUI, filterAndRender, closeRecipeModal, initTabs, initBudgetSlider } from './recipes.js';
import { calculateBudget, initMainBudgetSlider } from './budget.js';
import { checkStunting } from './screening.js';
import { initHeaderScroll, initMobileMenu, initScrollReveal, initActiveNavLink } from './ui.js';
import { formatNumber } from './utils.js';

// ─── Component Loader ─────────────────────────────────────────────────────────
async function loadComponents() {
  const placeholders = document.querySelectorAll('[data-include]');
  await Promise.all([...placeholders].map(async placeholder => {
    const response = await fetch(placeholder.dataset.include);
    if (!response.ok) throw new Error(`Gagal memuat ${placeholder.dataset.include}`);
    placeholder.outerHTML = await response.text();
  }));
}

// ─── Dynamic Hero Stats ───────────────────────────────────────────────────────
function updateHeroStats() {
  const recipesCount = recipesData.length;
  const kecamatanCount = kecamatanData.length;
  const kategoriCount = kategoriData.length;
  const minPrice = recipesData.reduce((min, r) => Math.min(min, r.estimasiHarga), Infinity);

  const elRecipes = document.getElementById('hero-stat-recipes');
  const elPrice = document.getElementById('hero-stat-price');
  const elKecamatan = document.getElementById('hero-stat-kecamatan');
  const elKategori = document.getElementById('hero-stat-kategori');

  if (elRecipes) elRecipes.textContent = `${recipesCount}+`;
  if (elPrice && isFinite(minPrice)) elPrice.textContent = `Rp ${formatNumber(minPrice)}`;
  if (elKecamatan) elKecamatan.textContent = `${kecamatanCount}`;
  if (elKategori) elKategori.textContent = `${kategoriCount || 5}`;
}

// ─── Event Listeners ──────────────────────────────────────────────────────────
function initEventListeners() {
  // Budget calculator
  document.getElementById('btn-calc-budget')?.addEventListener('click', calculateBudget);

  // Stunting screening
  document.getElementById('btn-check-stunting')?.addEventListener('click', checkStunting);

  // Modal close
  document.getElementById('modal-close')?.addEventListener('click', closeRecipeModal);
  document.getElementById('recipe-modal')?.addEventListener('click', event => {
    if (event.target.id === 'recipe-modal' || event.target.classList.contains('modal__overlay')) {
      closeRecipeModal();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeRecipeModal();
  });

  // Modal favorite button
  document.getElementById('modal-fav-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('recipe-modal');
    if (!modal) return;
    const id = parseInt(modal.dataset.currentRecipeId);
    if (isNaN(id)) return;
    const { toggleFavorite, favoriteIds } = window.__dapurgizi_state || {};
    if (toggleFavorite) {
      toggleFavorite(id);
      const icon = document.getElementById('modal-fav-icon');
      if (icon) icon.textContent = favoriteIds.has(id) ? '❤️' : '🤍';
      filterAndRender();
    }
  });

  // Recipe section filters — auto-filter on change
  document.getElementById('filter-kategori-gizi')?.addEventListener('change', filterAndRender);
  document.getElementById('filter-kategori-makanan')?.addEventListener('change', filterAndRender);
  document.getElementById('filter-search')?.addEventListener('input', filterAndRender);
}

// ─── App Bootstrap ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadComponents();
    await loadData();

    // Expose state helpers for modal fav button
    const stateModule = await import('./state.js');
    window.__dapurgizi_state = stateModule;

    // Initialize Dynamic Hero Stats & UI
    updateHeroStats();
    populateKecamatanUI();
    filterAndRender();
    initTabs();
    initBudgetSlider();
    initMainBudgetSlider();

  } catch (error) {
    console.error('Error loading data:', error);
    const grid = document.getElementById('recipes-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="recipes__empty">
          <div class="recipes__empty-icon">⚠️</div>
          <h3 class="recipes__empty-title">Gagal Memuat Data</h3>
          <p class="recipes__empty-text">Pastikan Anda menjalankan aplikasi melalui server lokal (npx serve).</p>
        </div>
      `;
    }
  }

  // Init UI behaviors (always run, even on error)
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();
  initActiveNavLink();
  initEventListeners();
});
