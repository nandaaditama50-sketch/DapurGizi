# Status Pengembangan — DapurGizi Nusantara

> **Terakhir diperbarui:** 8 Oktober 2026, 14:48 WIB  
> **Auditor & Lead Dev:** Senior Frontend / UI/UX / QA Engineer  
> **Status:** Performance Optimization in Progress; deploy-time LCP issue under investigation for Netlify.

## Ringkasan

Project DapurGizi Nusantara saat ini fokus pada optimasi performa dan stabilitas produksi. Setelah audit awal selesai, perhatian utama berpindah ke pengurangan total blocking time, LCP, dan panjang critical path di deploy environment. Target utama saat ini adalah memastikan halaman utama dapat dimuat dengan cepat di Netlify, bukan hanya saat di localhost.

## Update Terkini

### Optimasi yang Sudah Dilakukan

| Area | Status | Catatan |
|---|---|---|
| CSS import chain | ✅ Selesai | CSS aggregator dihapus dan file style dipasang secara langsung agar browser tidak menunggu `@import` berantai. |
| Hero image LCP | ✅ Selesai | Gambar besar di hero sudah diganti ke versi responsif `.webp` yang lebih kecil dan diberi `fetchpriority="high"`. |
| Single CSS request | ✅ Selesai | Beberapa CSS file digabung menjadi satu `site.css` untuk mengurangi request overhead. |
| Asset cache headers | ✅ Selesai | File `netlify.toml` dibuat agar aset statis bisa disimpan di cache browser/CDN. |
| Dead render blockers | ✅ Selesai | Font import dari Google Fonts dihapus dari CSS base untuk menghindari network delay. |

### Masalah yang Masih Diperhatikan di Deploy

| Area | Status | Catatan |
|---|---|---|
| Netlify LCP | ⚠️ Masih diinvestigasi | Pengukuran di localhost cepat, tapi di deploy real network masih naik ke 3–4 detik karena runtime fetch component/data dan cold network latency. |
| Component loading via fetch | ⚠️ Masih ada | Halaman masih memakai dynamic include daripada static pre-rendered HTML, sehingga TTFB dan network layer masih berpengaruh nyata. |
| Data fetching runtime | ⚠️ Masih ada | `recipes.json` dan `kecamatan.json` dipanggil saat runtime, yang menambah critical path di deployment. |

---

## Prioritas Perbaikan Saat Ini

1. Menghilangkan runtime component fetch pada halaman utama untuk mempercepat first render.  
2. Mengubah struktur HTML menjadi lebih static / pre-rendered agar Netlify dapat menghasilkan response yang lebih cepat.  
3. Melakukan split data + deferred rendering bila memang diperlukan agar content utama tampil lebih cepat.  
4. Mengurangi penggunaan JS yang tidak diperlukan di initial load.  
5. Menjaga aset hero, CSS, dan file JSON tetap ter-cache dengan header yang tepat di Netlify.  

---

## Kondisi Proyek

- Frontend MVP: ✅ Stabil dan fungsional  
- Audit UI/UX awal: ✅ Selesai  
- Performa deploy production: ⚠️ Masih terus dioptimasi  
- Target utama: menurunkan LCP di Netlify ke bawah 1 detik dalam kondisi real deployment  

---

## Cara Menjalankan Aplikasi

Jalankan server lokal dari direktori project:

```powershell
python -m http.server 8000
# ATAU
npx serve -l 3000
```

Buka `http://localhost:8000` di browser.

---

## Struktur File Project

```text
d:\source code\web dev\
├── index.html              ← Entry point (Homepage)
├── team.html               ← Halaman Tim Kami
├── site.css                ← CSS bundle hasil optimasi
├── netlify.toml            ← Netlify cache header configuration
├── audit_report.md         ← Laporan Audit Lengkap
├── status.md               ← Laporan Status Pengawasan
├── assets/images/          ← Background, foto anggota (webp/jpg), dan resep
├── components/             ← Partial HTML (header, hero, features, recipes, budget, screening, footer, modal)
├── css/                    ← Modular styles (base, header, hero, features, recipes, budget, screening, team, footer, responsive)
├── data/                   ← Data JSON (recipes.json, kecamatan.json, kategori.json)
├── js/                     ← ES Modules (app.js, state.js, recipes.js, budget.js, screening.js, team-app.js, ui.js, utils.js)
└── index.css               ← File legacy; saat ini tidak digunakan untuk load utama
```
