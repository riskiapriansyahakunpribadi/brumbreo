# Brumbreo

Website satu halaman untuk kedai kopi Brumbreo (dibaca "brum-bre-o"). Dibangun sebagai situs statis dengan Vite, CSS modular, GSAP + ScrollTrigger, Lenis untuk scroll halus, serta satu fungsi serverless Vercel untuk formulir buletin.

## Peta Struktur Proyek

* `index.html`: Dokumen HTML utama dengan struktur landmark semantik untuk seluruh bagian halaman.
* `package.json`: Daftar skrip dan dependensi berversi terkunci (pin).
* `vite.config.js`: Konfigurasi build statis Vite.
* `vercel.json`: Header keamanan HTTP (CSP, HSTS, anti-clickjacking, referrer, permissions) dan rute fungsi API.
* `.env.example`: Daftar variabel lingkungan yang dibutuhkan saat produksi (tanpa nilai rahasia).
* `.gitignore`: Daftar folder dan file lokal yang tidak diunggah ke Git.
* `api/`: Fungsi serverless Vercel untuk pendaftaran buletin.
* `public/`: Aset statis publik seperti ikon tab browser.
* `data/`: Seluruh data bisnis (menu, builder, kontak, jam buka, testimoni) yang siap diubah pemilik.
* `src/`: Kode sumber antarmuka, gaya CSS, ilustrasi SVG, modul interaksi, dan fungsi utilitas.

## Cara Menjalankan Secara Lokal

1. Pastikan Node.js versi 20 atau lebih baru sudah terpasang.
2. Pasang dependensi dengan menjalankan `npm install`.
3. Jalankan server pengembangan lokal dengan `npm run dev`.
4. Buka alamat lokal yang muncul di terminal (biasanya `http://localhost:5173`).
5. Untuk menguji hasil produksi statis secara lokal, jalankan `npm run build` lalu `npm run preview`.

## Cara Mengubah Data Bisnis

Buka folder `data/`. Seluruh nama minuman, deskripsi, harga, alamat, jam buka, nomor WhatsApp, tautan media sosial, dan testimoni diatur di sana tanpa perlu menyentuh kode logika. Bidang yang dibiarkan kosong otomatis menyembunyikan elemennya di halaman.

## Cara Memasang ke Vercel

1. Unggah seluruh folder proyek ke repositori GitHub pribadi atau publik.
2. Masuk ke dasbor Vercel, pilih "Add New Project", lalu impor repositori Brumbreo.
3. Biarkan pengaturan build bawaan Vite (`Build Command: npm run build`, `Output Directory: dist`).
4. Tambahkan variabel lingkungan sesuai `.env.example` di menu Settings > Environment Variables jika memakai layanan buletin pihak ketiga.
5. Klik Deploy. Panduan rinci langkah demi langkah disiapkan pada Tahap 8.