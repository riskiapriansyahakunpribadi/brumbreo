# Folder src/modules

Fungsi: Menyimpan logika interaksi, penyajian DOM aman, dan animasi GSAP/ScrollTrigger untuk masing-masing bagian halaman.

## Daftar File

* `smoothScroll.js`: Mengatur Lenis, menyinkronkan dengan ScrollTrigger, dan menonaktifkan gerak berlebih saat `prefers-reduced-motion` aktif.
* `navSearch.js`: Mengatur menu navigasi HP, pencarian minuman secara langsung, lompatan halus ke minuman terpilih di parade, serta tombol buka keranjang.
* `heroMotion.js`: Menjalankan animasi masuk hero, gerak uap kopi, parallax kursor di desktop, dan kemiringan halus berbasis scroll di HP.
* `parade.js`: Merender empat minuman dari `data/menu.js`, mengatur pin scroll horizontal, transisi warna latar, teks raksasa, progres, dan aksi tambah ke keranjang.
* `builder.js`: Merender pratinjau gelas beruang dan empat langkah kustomisasi dari `data/builder.js`, memperbarui SVG serta harga secara langsung, dan mengirim ringkasan ke WhatsApp.
* `cart.js`: Mengelola status keranjang, laci geser dengan perangkap fokus keyboard, perubahan jumlah, keadaan kosong, dan pengiriman pesanan ke WhatsApp.
* `testimonials.js`: Merender dua baris marquee berlawanan arah dari `data/testimonials.js` dengan jeda saat kursor/sentuhan, atau menyembunyikan bagian bila data kosong.
* `footer.js`: Merender status buka/tutup nyata, kartu lokasi, jam buka, formulir buletin dengan keadaan memuat/sukses/gagal, tautan sosial, dan animasi masuk gelas mengintip.

## Hubungan Antar File

Seluruh modul dipanggil dari `src/main.js`. Modul `parade.js` dan `builder.js` berkomunikasi dengan `cart.js` untuk menambah item, sedangkan `navSearch.js` berkoordinasi dengan `parade.js` untuk melompat ke slide minuman yang dipilih.