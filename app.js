/**
 * DapurGizi Nusantara — Main Application Logic
 * 
 * Features:
 * A. Regional Ingredient Filter (Filter Pangan Lokal)
 * B. Budget-to-Nutrition Calculator (Kalkulator Anggaran Dapur)
 * C. Simple Family Profile (Kalkulator Risiko Stunting)
 */

// ===================================
// Data Store
// ===================================
let recipesData = [];
let kecamatanData = [];

// ===================================
// Data Loading
// ===================================
async function loadData() {
  try {
    const [recipesRes, kecamatanRes] = await Promise.all([
      fetch('data/recipes.json'),
      fetch('data/kecamatan.json')
    ]);
    recipesData = await recipesRes.json();
    kecamatanData = await kecamatanRes.json();

    populateKecamatanDropdowns();
    renderRecipes(recipesData);
  } catch (error) {
    console.error('Error loading data:', error);
    // Fallback: show a friendly message
    const grid = document.getElementById('recipes-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="recipes__empty">
          <div class="recipes__empty-icon">⚠️</div>
          <h3 class="recipes__empty-title">Gagal Memuat Data</h3>
          <p class="recipes__empty-text">Pastikan Anda menjalankan aplikasi melalui server lokal.</p>
        </div>
      `;
    }
  }
}

// ===================================
// Populate Kecamatan Dropdowns
// ===================================
function populateKecamatanDropdowns() {
  const selectors = [
    document.getElementById('filter-kecamatan'),
    document.getElementById('budget-kecamatan')
  ];

  selectors.forEach(select => {
    if (!select) return;
    kecamatanData.forEach(kec => {
      const option = document.createElement('option');
      option.value = kec.nama;
      option.textContent = kec.nama;
      select.appendChild(option);
    });
  });
}

// ===================================
// A. Recipe Rendering & Filtering
// ===================================
function renderRecipes(recipes) {
  const grid = document.getElementById('recipes-grid');
  if (!grid) return;

  if (recipes.length === 0) {
    grid.innerHTML = `
      <div class="recipes__empty">
        <div class="recipes__empty-icon">🔍</div>
        <h3 class="recipes__empty-title">Tidak Ada Resep Ditemukan</h3>
        <p class="recipes__empty-text">Coba ubah filter kecamatan, kategori, atau naikkan budget Anda.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = recipes.map(recipe => `
    <div class="recipe-card" data-recipe-id="${recipe.id}" id="recipe-card-${recipe.id}">
      <div class="recipe-card__img-wrapper">
        <img src="${recipe.gambar}" alt="${recipe.nama}" loading="lazy">
        <span class="badge badge--primary recipe-card__category">${recipe.kategori}</span>
        <span class="recipe-card__price">Rp ${formatNumber(recipe.estimasiHarga)}</span>
      </div>
      <div class="recipe-card__body">
        <h3 class="recipe-card__title">${recipe.nama}</h3>
        <p class="recipe-card__desc">${recipe.deskripsi}</p>
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
  `).join('');

  // Attach click handlers
  grid.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.recipeId);
      const recipe = recipesData.find(r => r.id === id);
      if (recipe) openRecipeModal(recipe);
    });
  });
}

function filterRecipes() {
  const kecamatan = document.getElementById('filter-kecamatan').value;
  const kategori = document.getElementById('filter-kategori').value;
  const budgetMax = parseInt(document.getElementById('filter-budget').value) || Infinity;

  let filtered = recipesData.filter(recipe => {
    const matchKecamatan = !kecamatan || recipe.kecamatan.includes(kecamatan);
    const matchKategori = !kategori || recipe.kategori === kategori;
    const matchBudget = recipe.estimasiHarga <= budgetMax;
    return matchKecamatan && matchKategori && matchBudget;
  });

  renderRecipes(filtered);
}

// ===================================
// Recipe Detail Modal
// ===================================
function openRecipeModal(recipe) {
  const modal = document.getElementById('recipe-modal');
  
  document.getElementById('modal-image').src = recipe.gambar;
  document.getElementById('modal-image').alt = recipe.nama;
  document.getElementById('modal-title').textContent = recipe.nama;

  // Meta row
  document.getElementById('modal-meta').innerHTML = `
    <span class="modal__meta-tag">🏷️ ${recipe.kategori}</span>
    <span class="modal__meta-tag">⏱️ ${recipe.waktuMasak}</span>
    <span class="modal__meta-tag">👥 ${recipe.porsi}</span>
    <span class="modal__meta-tag">💰 Rp ${formatNumber(recipe.estimasiHarga)}</span>
  `;

  // Nutrition grid
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

  // Ingredients
  document.getElementById('modal-ingredients').innerHTML = recipe.bahan
    .map(b => `<li>${b}</li>`).join('');

  // Steps
  document.getElementById('modal-steps').innerHTML = recipe.caraMasak
    .map(s => `<li>${s}</li>`).join('');

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeRecipeModal() {
  const modal = document.getElementById('recipe-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ===================================
// B. Budget Calculator
// ===================================
function calculateBudget() {
  const kecamatan = document.getElementById('budget-kecamatan').value;
  const budgetInput = parseInt(document.getElementById('budget-amount').value);

  if (!budgetInput || budgetInput < 5000) {
    alert('Masukkan anggaran minimal Rp 5.000');
    return;
  }

  // Filter recipes by kecamatan if selected
  let available = recipesData.filter(r => {
    return !kecamatan || r.kecamatan.includes(kecamatan);
  });

  // Sort by price ascending
  available.sort((a, b) => a.estimasiHarga - b.estimasiHarga);

  // Greedy algorithm: try to fit as many recipes as possible within budget
  let selected = [];
  let totalCost = 0;

  // Try to get a balanced set: prioritize different categories
  const categoryPriority = ['Sarapan', 'Makan Siang', 'Makan Malam', 'Lauk', 'Camilan'];
  let usedCategories = new Set();

  // First pass: one of each category
  for (const cat of categoryPriority) {
    const candidates = available.filter(r =>
      r.kategori === cat &&
      !selected.includes(r) &&
      totalCost + r.estimasiHarga <= budgetInput
    );
    if (candidates.length > 0) {
      const pick = candidates[0];
      selected.push(pick);
      totalCost += pick.estimasiHarga;
      usedCategories.add(cat);
    }
  }

  // If still have budget, add more
  for (const recipe of available) {
    if (selected.includes(recipe)) continue;
    if (totalCost + recipe.estimasiHarga <= budgetInput) {
      selected.push(recipe);
      totalCost += recipe.estimasiHarga;
    }
    if (selected.length >= 5) break; // Max 5 items
  }

  // Display results
  const resultsContainer = document.getElementById('budget-results');
  const resultsList = document.getElementById('budget-results-list');
  const totalEl = document.getElementById('budget-total');

  if (selected.length === 0) {
    resultsList.innerHTML = `
      <div class="budget__result-card">
        <div class="budget__result-card__header">
          <span class="budget__result-card__title">😔 Budget terlalu kecil</span>
        </div>
        <p style="color: rgba(255,255,255,0.6); font-size: 0.875rem;">
          Coba naikkan budget Anda. Resep termurah kami mulai dari Rp ${formatNumber(available.length > 0 ? available[0].estimasiHarga : 5000)}.
        </p>
      </div>
    `;
    totalEl.innerHTML = '';
  } else {
    resultsList.innerHTML = selected.map(r => `
      <div class="budget__result-card">
        <div class="budget__result-card__header">
          <span class="budget__result-card__title">${r.nama}</span>
          <span class="budget__result-card__price">Rp ${formatNumber(r.estimasiHarga)}</span>
        </div>
        <div class="budget__result-card__nutrients">
          <span class="budget__nutrient-tag">🏷️ ${r.kategori}</span>
          <span class="budget__nutrient-tag">🔥 ${r.kandunganGizi.kalori} kkal</span>
          <span class="budget__nutrient-tag">💪 ${r.kandunganGizi.protein}g protein</span>
          <span class="budget__nutrient-tag">⚡ ${r.kandunganGizi.zatBesi}mg zat besi</span>
        </div>
      </div>
    `).join('');

    const sisa = budgetInput - totalCost;
    totalEl.innerHTML = `
      <span class="budget__total-label">Total: ${selected.length} menu</span>
      <span class="budget__total-value">Rp ${formatNumber(totalCost)} <small style="font-size:0.7em;opacity:0.7;">(sisa Rp ${formatNumber(sisa)})</small></span>
    `;
  }

  resultsContainer.classList.add('active');

  // Smooth scroll to results
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===================================
// C. Stunting Screening
// ===================================

/**
 * Simplified WHO/Kemenkes growth standards (approximate median values)
 * For a more accurate MVP, we use simplified reference tables.
 * 
 * Format: { month: { L: { median_height, median_weight }, P: { ... } } }
 */
const growthStandards = {
  // Boys (L) and Girls (P) - median values at key ages
  // Height in cm, Weight in kg
  0:  { L: { h: 49.9, w: 3.3 }, P: { h: 49.1, w: 3.2 } },
  3:  { L: { h: 61.4, w: 6.4 }, P: { h: 59.8, w: 5.8 } },
  6:  { L: { h: 67.6, w: 7.9 }, P: { h: 65.7, w: 7.3 } },
  9:  { L: { h: 72.0, w: 8.9 }, P: { h: 70.1, w: 8.2 } },
  12: { L: { h: 75.7, w: 9.6 }, P: { h: 74.0, w: 8.9 } },
  15: { L: { h: 79.1, w: 10.3 }, P: { h: 77.5, w: 9.6 } },
  18: { L: { h: 82.3, w: 10.9 }, P: { h: 80.7, w: 10.2 } },
  21: { L: { h: 85.1, w: 11.5 }, P: { h: 83.7, w: 10.9 } },
  24: { L: { h: 87.8, w: 12.2 }, P: { h: 86.4, w: 11.5 } },
  30: { L: { h: 92.4, w: 13.3 }, P: { h: 91.2, w: 12.7 } },
  36: { L: { h: 96.1, w: 14.3 }, P: { h: 95.1, w: 13.9 } },
  42: { L: { h: 99.9, w: 15.3 }, P: { h: 99.0, w: 15.0 } },
  48: { L: { h: 103.3, w: 16.3 }, P: { h: 102.7, w: 16.1 } },
  54: { L: { h: 106.7, w: 17.3 }, P: { h: 106.2, w: 17.2 } },
  60: { L: { h: 110.0, w: 18.3 }, P: { h: 109.4, w: 18.2 } }
};

function getGrowthReference(ageMonths, gender) {
  const ages = Object.keys(growthStandards).map(Number).sort((a, b) => a - b);
  
  // Find the two closest ages for interpolation
  let lowerAge = ages[0];
  let upperAge = ages[ages.length - 1];

  for (let i = 0; i < ages.length - 1; i++) {
    if (ageMonths >= ages[i] && ageMonths <= ages[i + 1]) {
      lowerAge = ages[i];
      upperAge = ages[i + 1];
      break;
    }
  }

  if (ageMonths <= ages[0]) {
    lowerAge = ages[0];
    upperAge = ages[0];
  }
  if (ageMonths >= ages[ages.length - 1]) {
    lowerAge = ages[ages.length - 1];
    upperAge = ages[ages.length - 1];
  }

  const lowerData = growthStandards[lowerAge][gender];
  const upperData = growthStandards[upperAge][gender];

  if (lowerAge === upperAge) {
    return { h: lowerData.h, w: lowerData.w };
  }

  // Linear interpolation
  const ratio = (ageMonths - lowerAge) / (upperAge - lowerAge);
  return {
    h: lowerData.h + (upperData.h - lowerData.h) * ratio,
    w: lowerData.w + (upperData.w - lowerData.w) * ratio
  };
}

function checkStunting() {
  const gender = document.getElementById('screening-gender').value;
  const age = parseInt(document.getElementById('screening-age').value);
  const weight = parseFloat(document.getElementById('screening-weight').value);
  const height = parseFloat(document.getElementById('screening-height').value);

  // Validation
  if (!gender) { alert('Pilih jenis kelamin anak'); return; }
  if (!age && age !== 0) { alert('Masukkan umur anak dalam bulan'); return; }
  if (age < 0 || age > 60) { alert('Umur harus antara 0-60 bulan'); return; }
  if (!weight || weight <= 0) { alert('Masukkan berat badan anak'); return; }
  if (!height || height <= 0) { alert('Masukkan tinggi badan anak'); return; }

  const ref = getGrowthReference(age, gender);
  
  // Calculate deviation percentages
  const heightRatio = height / ref.h;
  const weightRatio = weight / ref.w;
  
  // Determine status
  // Using simplified Z-score approximation
  // Height-for-age: < 88% median = severely stunted, 88-95% = stunted/warning, > 95% = normal
  // Weight-for-age: < 80% median = severe underweight, 80-90% = underweight/warning, > 90% = normal
  
  let status, statusText, icon, details, cssClass;
  
  const heightPercent = (heightRatio * 100).toFixed(1);
  const weightPercent = (weightRatio * 100).toFixed(1);

  if (heightRatio >= 0.95 && weightRatio >= 0.90) {
    status = 'normal';
    cssClass = 'screening__result--normal';
    icon = '✅';
    statusText = 'Status: Normal';
    details = `
      <p><strong>Kabar baik!</strong> Berdasarkan data yang Anda masukkan, pertumbuhan anak Anda berada dalam rentang <strong>normal</strong>.</p>
      <p>📏 Tinggi badan anak: <strong>${height} cm</strong> (${heightPercent}% dari median ${ref.h.toFixed(1)} cm)</p>
      <p>⚖️ Berat badan anak: <strong>${weight} kg</strong> (${weightPercent}% dari median ${ref.w.toFixed(1)} kg)</p>
      <p>Terus pertahankan pola makan bergizi seimbang dan pantau tumbuh kembang anak secara rutin di Posyandu.</p>
    `;
  } else if (heightRatio >= 0.88 && weightRatio >= 0.80) {
    status = 'warning';
    cssClass = 'screening__result--warning';
    icon = '⚠️';
    statusText = 'Status: Perlu Perhatian';
    details = `
      <p><strong>Perhatian!</strong> Berdasarkan data yang Anda masukkan, pertumbuhan anak memerlukan perhatian lebih.</p>
      <p>📏 Tinggi badan anak: <strong>${height} cm</strong> (${heightPercent}% dari median ${ref.h.toFixed(1)} cm)</p>
      <p>⚖️ Berat badan anak: <strong>${weight} kg</strong> (${weightPercent}% dari median ${ref.w.toFixed(1)} kg)</p>
      <p><strong>Rekomendasi:</strong></p>
      <p>1. Tingkatkan asupan protein (telur, tempe, ikan) dan zat besi (daun kelor, bayam).</p>
      <p>2. Pastikan anak mendapat ASI eksklusif (jika < 6 bulan) atau MP-ASI yang berkualitas.</p>
      <p>3. Kunjungi Posyandu secara rutin untuk pemantauan lanjutan.</p>
    `;
  } else {
    status = 'danger';
    cssClass = 'screening__result--danger';
    icon = '🚨';
    statusText = 'Status: Waspada — Segera Konsultasi';
    details = `
      <p><strong>Peringatan!</strong> Berdasarkan data yang Anda masukkan, pertumbuhan anak menunjukkan indikasi risiko stunting.</p>
      <p>📏 Tinggi badan anak: <strong>${height} cm</strong> (${heightPercent}% dari median ${ref.h.toFixed(1)} cm)</p>
      <p>⚖️ Berat badan anak: <strong>${weight} kg</strong> (${weightPercent}% dari median ${ref.w.toFixed(1)} kg)</p>
      <p><strong>Langkah segera:</strong></p>
      <p>1. 🏥 <strong>Segera konsultasikan ke Puskesmas atau tenaga kesehatan terdekat.</strong></p>
      <p>2. Berikan makanan padat gizi tinggi protein dan zat besi setiap hari.</p>
      <p>3. Pastikan anak mendapat vitamin A dan imunisasi lengkap.</p>
    `;
  }

  const resultEl = document.getElementById('screening-result');
  resultEl.className = `screening__result active ${cssClass}`;
  document.getElementById('result-icon').textContent = icon;
  document.getElementById('result-status').textContent = statusText;
  document.getElementById('result-details').innerHTML = details;
  document.getElementById('result-cta').innerHTML = `
    <a href="#recipes" class="btn btn--primary btn--sm" onclick="scrollToRecipes()">
      🍽️ Lihat Rekomendasi Menu Padat Gizi
    </a>
  `;

  // Scroll to result
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function scrollToRecipes() {
  // Pre-filter for high-protein recipes
  document.getElementById('filter-kategori').value = '';
  document.getElementById('filter-budget').value = '';
  filterRecipes();
  document.getElementById('recipes').scrollIntoView({ behavior: 'smooth' });
}

// ===================================
// Utility Functions
// ===================================
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ===================================
// Header Scroll Effect
// ===================================
function initHeaderScroll() {
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

// ===================================
// Mobile Menu
// ===================================
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');

  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

  // Close menu on link click
  nav.querySelectorAll('.header__nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
    });
  });
}

// ===================================
// Scroll Reveal Animation
// ===================================
function initScrollReveal() {
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

// ===================================
// Active Nav Link
// ===================================
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('header__nav-link--active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('header__nav-link--active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-100px 0px -100px 0px'
  });

  sections.forEach(section => observer.observe(section));
}

// ===================================
// Event Listeners
// ===================================
function initEventListeners() {
  // Recipe filter button
  const btnFilter = document.getElementById('btn-filter-recipes');
  if (btnFilter) {
    btnFilter.addEventListener('click', filterRecipes);
  }

  // Also filter on Enter key in budget input
  const filterBudget = document.getElementById('filter-budget');
  if (filterBudget) {
    filterBudget.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') filterRecipes();
    });
  }

  // Budget calculator
  const btnBudget = document.getElementById('btn-calc-budget');
  if (btnBudget) {
    btnBudget.addEventListener('click', calculateBudget);
  }

  // Budget amount Enter key
  const budgetAmount = document.getElementById('budget-amount');
  if (budgetAmount) {
    budgetAmount.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') calculateBudget();
    });
  }

  // Stunting screening
  const btnStunting = document.getElementById('btn-check-stunting');
  if (btnStunting) {
    btnStunting.addEventListener('click', checkStunting);
  }

  // Modal close
  const modalClose = document.getElementById('modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', closeRecipeModal);
  }

  // Close modal on overlay click
  const modalOverlay = document.getElementById('recipe-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeRecipeModal();
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeRecipeModal();
  });
}

// ===================================
// Initialize App
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();
  initActiveNavLink();
  initEventListeners();
});
