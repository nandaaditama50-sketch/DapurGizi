import { filterRecipes } from './recipes.js';

export const growthStandards = {
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

export function getGrowthReference(ageMonths, gender) {
  const ages = Object.keys(growthStandards).map(Number).sort((a, b) => a - b);
  
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

  const ratio = (ageMonths - lowerAge) / (upperAge - lowerAge);
  return {
    h: lowerData.h + (upperData.h - lowerData.h) * ratio,
    w: lowerData.w + (upperData.w - lowerData.w) * ratio
  };
}

export function checkStunting() {
  const gender = document.getElementById('screening-gender').value;
  const age = parseInt(document.getElementById('screening-age').value);
  const weight = parseFloat(document.getElementById('screening-weight').value);
  const height = parseFloat(document.getElementById('screening-height').value);

  if (!gender) { alert('Pilih jenis kelamin anak'); return; }
  if (!age && age !== 0) { alert('Masukkan umur anak dalam bulan'); return; }
  if (age < 0 || age > 60) { alert('Umur harus antara 0-60 bulan'); return; }
  if (!weight || weight <= 0) { alert('Masukkan berat badan anak'); return; }
  if (!height || height <= 0) { alert('Masukkan tinggi badan anak'); return; }

  const ref = getGrowthReference(age, gender);
  
  const heightRatio = height / ref.h;
  const weightRatio = weight / ref.w;
  
  let statusText, icon, details, cssClass;
  
  const heightPercent = (heightRatio * 100).toFixed(1);
  const weightPercent = (weightRatio * 100).toFixed(1);

  if (heightRatio >= 0.95 && weightRatio >= 0.90) {
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
  
  const ctaBtn = document.getElementById('result-cta');
  ctaBtn.innerHTML = `
    <button class="btn btn--primary btn--sm" id="btn-scroll-recipes">
      🍽️ Lihat Rekomendasi Menu Padat Gizi
    </button>
  `;
  document.getElementById('btn-scroll-recipes')?.addEventListener('click', scrollToRecipes);

  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function scrollToRecipes() {
  filterRecipes();
  document.getElementById('recipes').scrollIntoView({ behavior: 'smooth' });
}
