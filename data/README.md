# Folder data

Fungsi: Pusat seluruh konten dan konfigurasi bisnis Brumbreo agar pemilik cukup mengedit file di folder ini untuk memperbarui menu, harga, kontak, atau ulasan.

## Daftar File

* `business.js`: Nama kedai, alamat, tautan peta, jam buka harian, nomor WhatsApp pemesanan, dan daftar tautan media sosial.
* `menu.js`: Daftar empat minuman utama untuk parade, termasuk nama, label rasa, deskripsi, harga, warna latar pastel, warna cairan gelas, dan ekspresi bawaan beruang.
* `builder.js`: Daftar pilihan kustomisasi pembuat cangkir (warna gelas, dasar minuman, ekspresi wajah beruang, dan topping beserta tambahan harga).
* `testimonials.js`: Daftar ulasan asli pelanggan. Jika daftar kosong, bagian testimoni otomatis tidak ditampilkan di halaman.

## Hubungan Antar File

Diimpor oleh modul-modul di `src/modules/` (`navSearch.js`, `parade.js`, `builder.js`, `testimonials.js`, `footer.js`) serta `src/utils/openHours.js` dan `src/utils/whatsapp.js`.