# Status Pengembangan — DapurGizi Nusantara

> **Terakhir diperbarui:** 8 Oktober 2026, 11:24 WIB  
> **Auditor & Lead Dev:** Senior Frontend / UI/UX / QA Engineer  
> **Status:** Frontend MVP Siap Rilis; Perbaikan Audit 18 Masalah Selesai 100%.

## Ringkasan

Project DapurGizi Nusantara telah diaudit secara menyeluruh dan dilakukan 18 perbaikan pada seluruh temuan audit. Aplikasi berbasis HTML5, CSS3, JavaScript ES Modules, dan JSON statis tanpa dependensi framework eksternal. Semua fitur telah teruji dan berjalan lancar.

## Audit & Fitur yang Telah Diperbaiki

| Fitur / Komponen | Status Audit | Keterangan Perbaikan |
|---|---|---|
| Halaman Tim Kami (`team.html`) | ✅ Selesai | Halaman `team.html` telah dibangun lengkap dengan struktur hero, profil kelompok, daftar anggota, dan kartu ketua. Gambar ketua telah dikonversi dari format `.ppm` ke `.webp` & `.jpg`. Link di header/footer yang dulunya `admin.html` (404) telah diperbaiki. |
| Statistik Hero Dinamis | ✅ Selesai | Angka statistik pada hero tidak lagi hardcoded (`12+`, `Rp 5.000`, `8`, `5`) melainkan dihitung secara otomatis dari data state aplikasi. |
| Dropdown Kecamatan Mobile | ✅ Selesai | Pada tampilan mobile (≤768px), tombol kecamatan yang berderet diganti secara otomatis dengan elemen `<select>` dropdown yang responsif dan nyaman digunakan di layar sentuh. |
| Pemuatan Data & Kategori | ✅ Selesai | `kategori.json` kini di-load bersama `recipes.json` dan `kecamatan.json`. State terpusat di `state.js` mengelola seluruh data secara konsisten. |
| Debounce Budget Slider | ✅ Selesai | Slider anggaran pada bagian resep telah di-debounce untuk mencegah re-render berlebihan saat pengguna menggeser slider. |
| Rekomendasi Menu Personalisasi | ✅ Selesai | Kalkulator anggaran kini menyertakan input **Jumlah Anggota Keluarga** dan algoritma penilaian gizi berbasis skor nutrisi (protein, zat besi, kalori per rupiah) serta bonus komoditas lokal per kecamatan. |
| Alignment Kalkulator Anggaran Desktop | ✅ Selesai | Kolom penjelasan dan card “Hitung Menu Mingguan” disejajarkan dari atas. Sudah diuji setelah hasil rekomendasi tampil; posisi atas kedua kolom sama. |
| Disclaimer Medis Global | ✅ Selesai | Penafian medis profesional telah ditambahkan pada footer global dan formulir skrining stunting. |
| Tautan & Data Kontak | ✅ Selesai | Placeholder kontak palsu (`smkn1wanayasa@example.com`, `+62 812...`) telah dibersihkan. Status di footer diperbarui secara jujur dari "Live" menjadi "Development". |
| Perbaikan Bug UI & JS | ✅ Selesai | Fixed active nav link detection (`ui.js`), modal overlay click target (`app.js`), dead import `formatNumber`, serta penambahan `@keyframes float` di `animations.css`. |

---

## Ringkasan Fitur Aplikasi

- **Katalog Resep (12 Resep):** Lengkap dengan kandungan gizi (kalori, protein, karbohidrat, lemak, zat besi, vitamin A), harga per porsi & per minggu, waktu masak, porsi, info khusus anak kecil, serta filter interaktif.
- **Kalkulator Anggaran Personalisasi:** Rekomendasi menu mingguan otomatis disesuaikan dengan anggaran mingguan, kecamatan, kategori gizi utama, dan jumlah anggota keluarga.
- **Skrining Stunting Awal:** Kalkulator rasio antropometri sederhana untuk memberikan rekomendasi awal gizi anak.
- **Favorit (LocalStorage):** Simpan resep favorit secara persisten di browser.
- **Halaman Tim Kami (`team.html`):** Informasi kelompok 1, pembimbing, serta profil ketua dan anggota tim pengembang.

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
├── index.css               ← CSS Aggregator
├── audit_report.md         ← Laporan Audit Lengkap
├── status.md               ← Laporan Status Pengawasan
├── assets/images/          ← Background, foto anggota (webp/jpg), dan resep
├── components/             ← Partial HTML (header, hero, features, recipes, budget, screening, footer, modal)
├── css/                    ← Modular styles (base, header, hero, features, recipes, budget, screening, team, footer, responsive)
├── data/                   ← Data JSON (recipes.json, kecamatan.json, kategori.json)
└── js/                     ← ES Modules (app.js, state.js, recipes.js, budget.js, screening.js, team-app.js, ui.js, utils.js)
```
