import { recipesData } from './state.js';
import { formatNumber } from './utils.js';

// ─── Budget Slider Setup (Main Budget Section) ───────────────────────────────
export function initMainBudgetSlider() {
  const slider = document.getElementById('budget-slider');
  const valueDisplay = document.getElementById('budget-slider-value');

  if (!slider || !valueDisplay) return;

  const updateSlider = () => {
    const val = parseInt(slider.value);
    const min = parseInt(slider.min);
    const max = parseInt(slider.max);
    const pct = ((val - min) / (max - min)) * 100;
    valueDisplay.textContent = `Rp ${formatNumber(val)}`;
    valueDisplay.textContent = `Rp ${formatNumber(val)}`;
    slider.style.background = `linear-gradient(to right, var(--color-accent-400) ${pct}%, rgba(255,255,255,0.2) ${pct}%)`;
  };

  slider.addEventListener('input', updateSlider);
  updateSlider(); // Initial render
}

// ─── Budget Calculator (Personalized Recommendation Engine) ────────────────────
export function calculateBudget() {
  const kecamatan = document.getElementById('budget-kecamatan')?.value || '';
  const kategoriGizi = document.getElementById('budget-kategori-gizi')?.value || '';
  const anggota = parseInt(document.getElementById('budget-anggota')?.value || '3');
  const slider = document.getElementById('budget-slider');
  const budgetWeekly = slider ? parseInt(slider.value) : 200000;

  // Filter available recipes by kecamatan and kategoriGizi
  let available = recipesData.filter(r => {
    const matchKec = !kecamatan || r.kecamatan.includes(kecamatan);
    const matchGizi = !kategoriGizi || (r.kategoriGizi && r.kategoriGizi.includes(kategoriGizi));
    return matchKec && matchGizi;
  });

  // Calculate personalization score for each recipe:
  // Score = (Protein + Zat Besi * 2 + Kalori/10) / Cost * (Local Commodity Bonus)
  available.forEach(r => {
    const gizi = r.kandunganGizi || { kalori: 0, protein: 0, zatBesi: 0 };
    const nutrientScore = (gizi.protein * 2) + (gizi.zatBesi * 3) + (gizi.kalori / 20);
    const costPerPortion = r.estimasiHargaPerMinggu;
    const isLocal = kecamatan && r.kecamatan.includes(kecamatan) ? 1.3 : 1.0;
    const giziMatch = kategoriGizi && r.kategoriGizi?.includes(kategoriGizi) ? 1.25 : 1.0;
    r.__score = (nutrientScore / Math.max(costPerPortion, 1000)) * 100000 * isLocal * giziMatch;
  });

  // Sort by personalized score descending
  available.sort((a, b) => b.__score - a.__score);

  // Personalized selection ensuring category diversity
  let selected = [];
  let totalCost = 0;
  const categoryPriority = ['Sarapan', 'Makan Siang', 'Makan Malam', 'Lauk', 'Camilan'];

  for (const cat of categoryPriority) {
    const candidate = available.find(r =>
      r.kategoriMakanan === cat &&
      !selected.includes(r) &&
      totalCost + r.estimasiHargaPerMinggu <= budgetWeekly
    );
    if (candidate) {
      selected.push(candidate);
      totalCost += candidate.estimasiHargaPerMinggu;
    }
  }

  // Fill remaining budget with highest scoring recipes
  for (const recipe of available) {
    if (selected.includes(recipe)) continue;
    if (totalCost + recipe.estimasiHargaPerMinggu <= budgetWeekly) {
      selected.push(recipe);
      totalCost += recipe.estimasiHargaPerMinggu;
    }
    if (selected.length >= 7) break;
  }

  renderBudgetResults(selected, budgetWeekly, totalCost, anggota);
}

// ─── Render Budget Results ────────────────────────────────────────────────────
function renderBudgetResults(selected, budgetWeekly, totalCost, anggota = 3) {
  const resultsContainer = document.getElementById('budget-results');
  const resultsList = document.getElementById('budget-results-list');
  const totalEl = document.getElementById('budget-total');
  if (!resultsContainer || !resultsList) return;

  if (selected.length === 0) {
    resultsList.innerHTML = `
      <div class="budget__result-card">
        <div class="budget__result-card__header">
          <span class="budget__result-card__title">😔 Budget terlalu kecil</span>
        </div>
        <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-top: 0.5rem;">
          Coba naikkan budget Anda. Resep termurah dimulai dari Rp ${formatNumber(recipesData.length > 0 ? recipesData.reduce((a,b) => a.estimasiHargaPerMinggu < b.estimasiHargaPerMinggu ? a : b).estimasiHargaPerMinggu : 35000)}/minggu.
        </p>
      </div>
    `;
    if (totalEl) totalEl.innerHTML = '';
  } else {
    // Calculate totals gizi
    const totalKalori = selected.reduce((sum, r) => sum + r.kandunganGizi.kalori, 0);
    const totalProtein = selected.reduce((sum, r) => sum + r.kandunganGizi.protein, 0);
    const totalZatBesi = selected.reduce((sum, r) => sum + r.kandunganGizi.zatBesi, 0);
    const costPerHead = Math.round(totalCost / anggota);

    resultsList.innerHTML = selected.map(r => `
      <div class="budget__result-card">
        <div class="budget__result-card__header">
          <span class="budget__result-card__title">${r.nama}</span>
          <span class="budget__result-card__price">Rp ${formatNumber(r.estimasiHargaPerMinggu)}/minggu</span>
        </div>
        <div class="budget__result-card__nutrients">
          <span class="budget__nutrient-tag">🏷️ ${r.kategoriMakanan}</span>
          <span class="budget__nutrient-tag">🔥 ${r.kandunganGizi.kalori} kkal</span>
          <span class="budget__nutrient-tag">💪 ${r.kandunganGizi.protein}g protein</span>
          <span class="budget__nutrient-tag">⚡ ${r.kandunganGizi.zatBesi}mg zat besi</span>
        </div>
      </div>
    `).join('');

    const sisa = budgetWeekly - totalCost;
    if (totalEl) totalEl.innerHTML = `
      <div class="budget__total-summary">
        <div class="budget__total-row">
          <span class="budget__total-label">📦 Kombinasi Menu</span>
          <span class="budget__total-value">${selected.length} menu rekomendasi</span>
        </div>
        <div class="budget__total-row">
          <span class="budget__total-label">👨‍👩‍👧‍👦 Alokasi Keluarga</span>
          <span class="budget__total-value">${anggota} anggota (~Rp ${formatNumber(costPerHead)}/orang)</span>
        </div>
        <div class="budget__total-row">
          <span class="budget__total-label">💰 Total Biaya Mingguan</span>
          <span class="budget__total-value">Rp ${formatNumber(totalCost)}</span>
        </div>
        <div class="budget__total-row">
          <span class="budget__total-label">💵 Sisa Anggaran</span>
          <span class="budget__total-value budget__total-value--sisa">Rp ${formatNumber(sisa)}</span>
        </div>
        <div class="budget__total-gizi">
          <span class="budget__nutrient-tag budget__nutrient-tag--lg">🔥 ${totalKalori} kkal</span>
          <span class="budget__nutrient-tag budget__nutrient-tag--lg">💪 ${totalProtein.toFixed(1)}g protein</span>
          <span class="budget__nutrient-tag budget__nutrient-tag--lg">⚡ ${totalZatBesi.toFixed(1)}mg zat besi</span>
        </div>
      </div>
    `;
  }

  resultsContainer.classList.add('active');
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
