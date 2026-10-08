# 🔍 Audit Report — DapurGizi Nusantara

**Tanggal audit:** 8 Oktober 2026  
**Auditor:** Senior Frontend / UI/UX / QA Engineer

---

## Ringkasan Struktur Project

```
d:\source code\web dev\
├── index.html              ← Entry point, component loader
├── index.css               ← CSS aggregator (@import)
├── status.md               ← Status development
├── product_requirements_document_prd.md
├── assets/images/
│   ├── hero-bg.jpg / .webp
│   ├── anggota/ketua.ppm   ← Foto ketua (format PPM, non-web)
│   └── recipes/            ← 5 resep × 2 format (jpg+webp)
├── components/
│   ├── header.html, hero.html, features.html
│   ├── recipes.html, budget.html, screening.html
│   ├── footer.html, modal.html
├── css/
│   ├── base.css, header.css, hero.css, buttons.css
│   ├── features.css, recipes.css, budget.css
│   ├── screening.css, modal.css, footer.css
│   ├── animations.css, responsive.css, extras.css
├── data/
│   ├── recipes.json    (12 resep)
│   ├── kecamatan.json  (8 kecamatan)
│   └── kategori.json   (5 kategori — TIDAK DIGUNAKAN di JS)
├── js/
│   ├── app.js       ← Bootstrap, event listeners
│   ├── state.js     ← Centralized state, data loading
│   ├── recipes.js   ← Filter, render, modal
│   ├── budget.js    ← Budget calculator
│   ├── screening.js ← Stunting screening
│   ├── ui.js        ← Header scroll, mobile menu, scroll reveal
│   └── utils.js     ← formatNumber()
```

---

## Temuan Audit

### 🔴 KRITIS (Harus diperbaiki)

| # | Masalah | File | Detail |
|---|---------|------|--------|
| 1 | **Tim Kami → 404** | `header.html`, `footer.html` | Link `admin.html` mengarah ke file yang tidak ada. Halaman Tim Kami belum dibuat. |
| 2 | **Placeholder kontak palsu** | `footer.html` | Email `smkn1wanayasa@example.com`, telepon `+62 812-3456-7890`, Instagram generic `instagram.com/`. Terlihat seperti data nyata padahal palsu. |
| 3 | **Footer status "Live" menyesatkan** | `footer.html:85` | Footer mengatakan `🟢 Status: Live` padahal `status.md` menyatakan deployment belum diverifikasi. |
| 4 | **Foto ketua format PPM** | `assets/images/anggota/ketua.ppm` | Format PPM tidak didukung browser. Perlu konversi ke webp/jpg/png. |

### 🟠 SEDANG (Perlu diperbaiki sebelum rilis)

| # | Masalah | File | Detail |
|---|---------|------|--------|
| 5 | **Statistik hero hardcoded** | `hero.html:39-55` | Angka `12+`, `Rp 5rb`, `8`, `5` ditulis tetap di HTML, bukan dari data. |
| 6 | **Kecamatan mobile masih horizontal scroll** | `responsive.css:102-117` | Di mobile, kecamatan buttons masih `overflow-x: auto` horizontal scroll, bukan dropdown. |
| 7 | **Semua data dimuat langsung** | `state.js:18-27` | `recipes.json` + `kecamatan.json` dimuat sekaligus saat init. Belum ada lazy loading. |
| 8 | **Budget slider auto-filter pada recipe section** | `recipes.js:296-309` | Slider budget di recipes section memicu `filterAndRender()` di setiap `input` event. Terlalu sering. |
| 9 | **Rekomendasi masih rule-based statis** | `budget.js:28-71` | Greedy algorithm sederhana tanpa personalisasi (jumlah orang, preferensi, bahan tersedia). |
| 10 | **`kategori.json` tidak digunakan** | `data/kategori.json` | File berisi 5 kategori dengan info detail tapi tidak diimport/digunakan di JS manapun. |
| 11 | **Tidak ada disclaimer medis global** | — | Disclaimer hanya ada di form skrining (`screening.html:77`). Belum ada disclaimer di level website. |

### 🟡 RENDAH (Perlu perbaikan)

| # | Masalah | File | Detail |
|---|---------|------|--------|
| 12 | **`formatNumber` diimport tapi tidak digunakan di `app.js`** | `app.js:6` | Dead import. |
| 13 | **CSS `.admin-members__grid` ada tapi tak ada HTML** | `responsive.css:228-230` | Referensi ke class yang belum ada (untuk halaman Tim Kami yang belum dibuat). |
| 14 | **Modal overlay click target salah** | `app.js:28-30` | `event.target.id === 'recipe-modal'` — harusnya click pada `.modal__overlay` bukan pada modal container. |
| 15 | **`float` animation tidak terdefinisi** | `hero.css:151,160` | `animation: float` dipakai di hero decor tapi `@keyframes float` tidak ditemukan di CSS manapun. |
| 16 | **5 gambar shared untuk 12 resep** | `recipes.json` | Beberapa resep menggunakan gambar yang sama (e.g. bubur-kacang.webp dipakai oleh 3 resep). |
| 17 | **Nav active link detection salah** | `ui.js:59` | Membandingkan `href === #${id}` tapi link menggunakan `index.html#hero`. Hanya match jika browsing via hash saja. |
| 18 | **Loading state tidak ada** | — | Tidak ada loading indicator saat fetch data. User melihat halaman kosong sesaat. |

---

## Rencana Perbaikan

Berdasarkan temuan di atas, saya akan melakukan perbaikan bertahap sesuai 20 phase yang diminta.
