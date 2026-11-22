# Folder src

Fungsi: Menyimpan seluruh kode sumber frontend Brumbreo mulai dari titik masuk aplikasi, lembar gaya, komponen SVG, modul fitur per bagian halaman, hingga fungsi bantu.

## Daftar File dan Subfolder

* `main.js`: Titik masuk utama yang menginisialisasi scroll halus, merender tiap bagian dari folder `data/`, dan menghubungkan seluruh modul interaksi.
* `styles/`: Lembar gaya CSS terpisah berdasarkan token desain, fondasi, dan bagian halaman.
* `svg/`: Generator komponen SVG murni untuk maskot gelas beruang, uap kopi, dan ikon antarmuka.
* `modules/`: Logika interaksi dan animasi GSAP untuk setiap bagian halaman.
* `utils/`: Fungsi bantu murni untuk format rupiah, perhitungan status jam buka, penyimpanan keranjang tervalidasi, dan pembuat tautan WhatsApp.

## Hubungan Antar File

`index.html` memuat `src/main.js`. Dari sana `main.js` mengimpor lembar gaya di `src/styles/` dan menjalankan inisialisasi modul di `src/modules/` yang saling berbagi utilitas di `src/utils/` serta ilustrasi di `src/svg/`.