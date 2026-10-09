import { recipesData, kecamatanData, favoriteIds, toggleFavorite } from './state.js';
import { formatNumber } from './utils.js';

// ─── Filter State ─────────────────────────────────────────────────────────────
let activeKecamatan = '';
let activeTab = 'all'; // 'all' | 'favorites'

// ─── Category Labels ──────────────────────────────────────────────────────────
const KATEGORI_LABEL = {
  bayi_mpasi:     '🍼 Bayi MPASI',
  dewasa:         '🧑 Dewasa',
  ibu_hamil:      '🤰 Ibu Hamil',
  ibu_menyusui:   '🤱 Menyusui',
  keluarga:       '👨‍👩‍👧‍👦 Keluarga'
};

// ─── Kecamatan Buttons ─────────────────────────────────────────────────────────
export function populateKecamatanUI() {
  // --- Recipe section kecamatan buttons ---
  const btnContainer = document.getElementById('kecamatan-buttons');
  if (btnContainer) {
    kecamatanData.forEach(kec => {
      const btn = document.createElement('button');
      btn.className = 'kec-btn';
      btn.dataset.kecamatan = kec.nama;
      btn.id = `kec-btn-${kec.id}`;
      btn.textContent = kec.nama;
      btn.addEventListener('click', () => selectKecamatan(kec.nama, btn));
      btnContainer.appendChild(btn);
    });
    document.getElementById('kec-btn-all')?.addEventListener('click', () => selectKecamatan('', document.getElementById('kec-btn-all')));
  }

  // --- Budget section kecamatan dropdown ---
  const budgetSelect = document.getElementById('budget-kecamatan');
  if (budgetSelect) {
    kecamatanData.forEach(kec => {
      const option = document.createElement('option');
      option.value = kec.nama;
      option.textContent = kec.nama;
      budgetSelect.appendChild(option);
    });
  }
}

function selectKecamatan(kecamatanName, clickedBtn) {
  activeKecamatan = kecamatanName;
  document.querySelectorAll('.kec-btn').forEach(b => b.classList.remove('kec-btn--active'));
  if (clickedBtn) clickedBtn.classList.add('kec-btn--active');

  filterAndRender();
}

// ─── Filter & Render ──────────────────────────────────────────────────────────
export function filterAndRender() {
  const kategoriGizi = document.getElementById('filter-kategori-gizi')?.value || '';
  const kategoriMakanan = document.getElementById('filter-kategori-makanan')?.value || '';
  const budgetSlider = document.getElementById('filter-budget-slider');
  const budgetMax = budgetSlider ? parseInt(budgetSlider.value) : Infinity;
  const search = (document.getElementById('filter-search')?.value || '').toLowerCase().trim();

  let filtered = recipesData.filter(recipe => {
    const matchKecamatan = !activeKecamatan || recipe.kecamatan.includes(activeKecamatan);
    const matchKategoriGizi = !kategoriGizi || (recipe.kategoriGizi && recipe.kategoriGizi.includes(kategoriGizi));
    const matchKategoriMakanan = !kategoriMakanan || recipe.kategoriMakanan === kategoriMakanan;
    const matchBudget = recipe.estimasiHarga <= budgetMax;
    const matchSearch = !search || recipe.nama.toLowerCase().includes(search) ||
      (recipe.bahanLokal && recipe.bahanLokal.some(b => b.toLowerCase().includes(search)));
    return matchKecamatan && matchKategoriGizi && matchKategoriMakanan && matchBudget && matchSearch;
  });

  const favorites = filtered.filter(r => favoriteIds.has(r.id));
  
  // Update tab counts
  const countAll = document.getElementById('count-all');
  const countFav = document.getElementById('count-favorites');
  if (countAll) countAll.textContent = filtered.length;
  if (countFav) countFav.textContent = favorites.length;

  if (activeTab === 'favorites') {
    renderRecipes(favorites);
  } else {
    renderRecipes(filtered);
  }
}

export function filterRecipes(kategoriGizi = '') {
  const categoryFilter = document.getElementById('filter-kategori-gizi');
  const foodTypeFilter = document.getElementById('filter-kategori-makanan');
  const budgetSlider = document.getElementById('filter-budget-slider');
  const searchInput = document.getElementById('filter-search');

  if (categoryFilter) categoryFilter.value = kategoriGizi;
  if (foodTypeFilter) foodTypeFilter.value = '';
  if (budgetSlider) budgetSlider.value = budgetSlider.max;
  if (searchInput) searchInput.value = '';

  activeKecamatan = '';
  activeTab = 'all';
  document.querySelectorAll('.kec-btn').forEach(button => {
    button.classList.toggle('kec-btn--active', button.dataset.kecamatan === '');
  });
  document.querySelectorAll('.recipes__tab').forEach(tab => {
    tab.classList.toggle('recipes__tab--active', tab.dataset.tab === 'all');
  });

  filterAndRender();
}

// ─── Render Recipe Cards ──────────────────────────────────────────────────────
export function renderRecipes(recipes) {
  const grid = document.getElementById('recipes-grid');
  if (!grid) return;

  if (recipes.length === 0) {
    grid.innerHTML = `
      <div class="recipes__empty">
        <div class="recipes__empty-icon">${activeTab === 'favorites' ? '❤️' : '🔍'}</div>
        <h3 class="recipes__empty-title">${activeTab === 'favorites' ? 'Belum Ada Favorit' : 'Tidak Ada Resep Ditemukan'}</h3>
        <p class="recipes__empty-text">${activeTab === 'favorites' ? 'Klik ikon ❤️ pada resep untuk menyimpannya.' : 'Coba ubah filter kecamatan, kategori, atau naikkan budget Anda.'}</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = recipes.map(recipe => {
    const isFav = favoriteIds.has(recipe.id);
    const kategoriGiziLabels = (recipe.kategoriGizi || [])
      .map(k => `<span class="recipe-card__gizi-badge">${KATEGORI_LABEL[k] || k}</span>`)
      .join('');

    return `
    <div class="recipe-card" data-recipe-id="${recipe.id}" id="recipe-card-${recipe.id}">
      <div class="recipe-card__img-wrapper">
        <picture>
          <img src="${recipe.gambar}" alt="${recipe.nama}" loading="lazy" width="400" height="250">
        </picture>
        <span class="badge badge--primary recipe-card__category">${recipe.kategoriMakanan}</span>
        <span class="recipe-card__price">Rp ${formatNumber(recipe.estimasiHarga)}</span>
        <button class="recipe-card__fav-btn ${isFav ? 'recipe-card__fav-btn--active' : ''}"
          data-recipe-id="${recipe.id}" id="fav-btn-${recipe.id}" aria-label="Favorit">
          ${isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="recipe-card__body">
        <h3 class="recipe-card__title">${recipe.nama}</h3>
        <p class="recipe-card__desc">${recipe.deskripsi}</p>
        <div class="recipe-card__gizi-badges">${kategoriGiziLabels}</div>
        <div class="recipe-card__meta">
          <div class="recipe-card__meta-item">
            <span>⏱️</span> ${recipe.waktuMasak}
          </div>
          <div class="recipe-card__meta-item">
            <span>👥</span> ${recipe.porsi}
          </div>
          <div class="recipe-card__meta-item">
            <span>🔥</span> ${recipe.kandunganGizi.kalori} kkal
          </div>
        </div>
      </div>
    </div>
  `}).join('');

  // Click events
  grid.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open modal when clicking fav button
      if (e.target.closest('.recipe-card__fav-btn')) return;
      const id = parseInt(card.dataset.recipeId);
      const recipe = recipesData.find(r => r.id === id);
      if (recipe) openRecipeModal(recipe);
    });
  });

  // Favorite buttons
  grid.querySelectorAll('.recipe-card__fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.recipeId);
      toggleFavorite(id);
      filterAndRender();
    });
  });
}

// ─── Recipe Modal ─────────────────────────────────────────────────────────────
export function openRecipeModal(recipe) {
  const modal = document.getElementById('recipe-modal');
  if (!modal) return;

  document.getElementById('modal-image').src = recipe.gambar;
  document.getElementById('modal-image').alt = recipe.nama;
  document.getElementById('modal-title').textContent = recipe.nama;
  document.getElementById('modal-price').textContent = `Rp ${formatNumber(recipe.estimasiHarga)} / sajian`;

  document.getElementById('modal-meta').innerHTML = `
    <span class="modal__meta-tag">🏷️ ${recipe.kategoriMakanan}</span>
    <span class="modal__meta-tag">⏱️ ${recipe.waktuMasak}</span>
    <span class="modal__meta-tag">👥 ${recipe.porsi}</span>
    <span class="modal__meta-tag">📅 Rp ${formatNumber(recipe.estimasiHargaPerMinggu)}/minggu</span>
  `;

  // Kategori Gizi badges
  const kategoriEl = document.getElementById('modal-kategori');
  if (kategoriEl && recipe.kategoriGizi) {
    kategoriEl.innerHTML = recipe.kategoriGizi.map(k =>
      `<span class="modal__kategori-badge modal__kategori-badge--${k}">${KATEGORI_LABEL[k] || k}</span>`
    ).join('');
  }

  // Info anak kecil
  const infoAnakEl = document.getElementById('modal-info-anak');
  const infoAnakText = document.getElementById('modal-info-anak-text');
  if (infoAnakEl && recipe.infoAnakKecil) {
    infoAnakEl.style.display = 'block';
    infoAnakText.textContent = recipe.infoAnakKecil;
  } else if (infoAnakEl) {
    infoAnakEl.style.display = 'none';
  }

  // Nutrition
  const gizi = recipe.kandunganGizi;
  document.getElementById('modal-nutrition').innerHTML = `
    <div class="modal__nutrition-item">
      <div class="modal__nutrition-value">${gizi.kalori}</div>
      <div class="modal__nutrition-label">Kalori (kkal)</div>
    </div>
    <div class="modal__nutrition-item">
      <div class="modal__nutrition-value">${gizi.protein}g</div>
      <div class="modal__nutrition-label">Protein</div>
    </div>
    <div class="modal__nutrition-item">
      <div class="modal__nutrition-value">${gizi.karbohidrat}g</div>
      <div class="modal__nutrition-label">Karbohidrat</div>
    </div>
    <div class="modal__nutrition-item">
      <div class="modal__nutrition-value">${gizi.lemak}g</div>
      <div class="modal__nutrition-label">Lemak</div>
    </div>
    <div class="modal__nutrition-item">
      <div class="modal__nutrition-value">${gizi.zatBesi}mg</div>
      <div class="modal__nutrition-label">Zat Besi</div>
    </div>
    <div class="modal__nutrition-item">
      <div class="modal__nutrition-value">${gizi.vitaminA}µg</div>
      <div class="modal__nutrition-label">Vitamin A</div>
    </div>
  `;

  // Ingredients (bullet points)
  document.getElementById('modal-ingredients').innerHTML = recipe.bahan
    .map(b => `<li>${b}</li>`).join('');

  // Steps (numbered)
  document.getElementById('modal-steps').innerHTML = recipe.caraMasak
    .map(s => `<li>${s}</li>`).join('');

  // Favorite button
  updateModalFavBtn(recipe.id);

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Store current recipe ID on modal for fav toggling
  modal.dataset.currentRecipeId = recipe.id;
}

function updateModalFavBtn(recipeId) {
  const favBtn = document.getElementById('modal-fav-btn');
  const favIcon = document.getElementById('modal-fav-icon');
  if (!favBtn || !favIcon) return;
  const isFav = favoriteIds.has(recipeId);
  favIcon.textContent = isFav ? '❤️' : '🤍';
  favBtn.title = isFav ? 'Hapus dari favorit' : 'Simpan ke favorit';
}

export function closeRecipeModal() {
  const modal = document.getElementById('recipe-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ─── Tab Switching ────────────────────────────────────────────────────────────
export function initTabs() {
  document.querySelectorAll('.recipes__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      document.querySelectorAll('.recipes__tab').forEach(t => t.classList.remove('recipes__tab--active'));
      tab.classList.add('recipes__tab--active');
      filterAndRender();
    });
  });
}

// ─── Slider Display ───────────────────────────────────────────────────────────
let sliderDebounceTimer = null;
export function initBudgetSlider() {
  const slider = document.getElementById('filter-budget-slider');
  const display = document.getElementById('budget-slider-display');
  if (!slider || !display) return;

  const updateDisplayOnly = () => {
    const val = parseInt(slider.value);
    display.textContent = val >= slider.max ? 'Semua harga' : `Rp ${formatNumber(val)}`;
  };

  slider.addEventListener('input', () => {
    updateDisplayOnly();
    clearTimeout(sliderDebounceTimer);
    sliderDebounceTimer = setTimeout(() => {
      filterAndRender();
    }, 150);
  });

  updateDisplayOnly();
}
