# Product Requirements Document (PRD) - DapurGizi Nusantara

## 1. Ringkasan Eksekutif
**DapurGizi Nusantara** adalah aplikasi web berbasis *Minimum Viable Product* (MVP) yang dirancang untuk membantu keluarga mengoptimalkan pemenuhan gizi harian menggunakan bahan pangan lokal yang murah dan mudah didapat, dengan fokus awal pada wilayah Banjarnegara. Aplikasi ini juga dilengkapi dengan alat skrining mandiri sederhana untuk mendeteksi risiko stunting pada anak.

## 2. Objektif (Tujuan)
*   **Tujuan Utama:** Menyediakan platform rekomendasi resep padat gizi yang disesuaikan dengan anggaran (budget) keluarga dan ketersediaan bahan pangan lokal daerah.
*   **Target Lomba/Tenggat (15 Oktober):** Meluncurkan versi web responsif yang fungsional (MVP) dengan fitur kalkulator *budget*, filter resep lokal, dan form skrining tumbuh kembang anak.

## 3. Target Pengguna (User Persona)
*   **Ibu Rumah Tangga / Orang Tua:** Memiliki anak usia balita (0-5 tahun), mengelola keuangan dapur harian, dan membutuhkan inspirasi masakan bergizi dengan *budget* terbatas (misal: Rp 15.000 - Rp 30.000/hari).
*   **Kader Posyandu / Komunitas Desa:** Sebagai alat bantu edukasi kepada warga mengenai pemanfaatan pangan lokal untuk mencegah stunting.

## 4. Ruang Lingkup MVP (Fitur Utama)
Mengingat waktu pengembangan yang sangat singkat (8 hari), pengembangan akan difokuskan secara eksklusif pada 3 fitur inti berikut:

### A. Regional Ingredient Filter (Filter Pangan Lokal)
*   **Deskripsi:** Pengguna memilih lokasi/kecamatan (fokus: Banjarnegara), sistem menampilkan bahan pangan yang sedang musim atau melimpah di daerah tersebut (misal: singkong, ikan mujair, tempe, daun kelor).
*   **Spesifikasi:** Dropdown pilihan lokasi sederhana yang memicu kueri ke *database* resep berdasarkan bahan lokal dominan.

### B. Budget-to-Nutrition Calculator (Kalkulator Anggaran Dapur)
*   **Deskripsi:** Pengguna memasukkan anggaran makan harian (Contoh: Rp 20.000). Sistem akan memberikan 1-2 rekomendasi menu (Sarapan, Makan Siang/Malam) yang bisa dibuat dengan nominal tersebut menggunakan bahan lokal.
*   **Spesifikasi:** Form input angka (*integer*), logika pencocokan antara input pengguna dengan total estimasi harga bahan resep di *database*.

### C. Simple Family Profile (Kalkulator Risiko Stunting)
*   **Deskripsi:** Form sederhana untuk memasukkan data anak (Umur dalam bulan, Berat Badan, Tinggi Badan). Sistem membandingkan data dengan standar dasar WHO/Kemenkes untuk memberikan peringatan dini (Normal / Perlu Perhatian).
*   **Spesifikasi:** Tiga form input, tombol "Cek Risiko", dan *pop-up* atau teks hasil (Hijau, Kuning, Merah) beserta rekomendasi resep DapurGizi. *Catatan: Tidak menyimpan data permanen (tanpa login) untuk mempercepat rilis MVP.*

## 5. User Flow (Alur Pengguna)
1.  **Halaman Utama (Landing Page):** Pengguna melihat *headline* "Cegah Stunting dengan Pangan Lokal Banjarnegara".
2.  **Pilih Jalur:** Pengguna memilih antara "Cari Resep Sesuai Budget" atau "Cek Tumbuh Kembang Anak".
3.  **Jalur Resep:** 
    *   Pilih Kecamatan -> Masukkan Budget (Rp) -> Klik "Cari Menu".
    *   Melihat kartu resep (Bahan, Cara Buat, Estimasi Harga Total, Kandungan Gizi Utama).
4.  **Jalur Cek Tumbuh Kembang:**
    *   Masukkan Umur, BB, TB -> Klik "Cek".
    *   Melihat hasil status gizi anak -> Muncul tombol "Rekomendasi Menu Padat Gizi" yang mengarah kembali ke jalur resep.

## 6. Kebutuhan Non-Fungsional & Tech Stack
*   **Platform:** Web-based, dioptimalkan untuk tampilan *Mobile-First* (karena mayoritas ibu-ibu mengakses via HP).
*   **Performa:** Halaman harus dimuat di bawah 3 detik (gunakan optimasi gambar resep).
*   **Tech Stack Saran (Eksekusi Cepat):**
    *   *Front-end:* HTML/CSS/JS murni dengan Tailwind CSS (atau React.js jika developer sudah terbiasa).
    *   *Back-end & Database:* Firebase atau Supabase (untuk *database* resep dan API cepat), atau *hardcoded JSON* jika waktunya sangat kritis.
    *   *Hosting:* Vercel, Netlify, atau GitHub Pages.

## 7. Strategi Data (Database Mockup)
Untuk mengejar rilis 15 Oktober, tidak perlu menginput ribuan resep. Cukup buat *dummy data* sebanyak **10-15 resep** yang sudah dikurasi dengan baik, lengkap dengan estimasi harga dan foto (bisa menggunakan *stock photo* atau AI *generated image* sementara).

## 8. Kriteria Sukses (Success Metrics) untuk Lomba
*   Web dapat diakses publik via tautan (*link*).
*   Fungsi kalkulator *budget* berjalan normal (input angka, *output* resep yang sesuai *budget*).
*   Fungsi deteksi risiko stunting menampilkan hasil yang logis sesuai *input* angka.