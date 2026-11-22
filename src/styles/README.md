# Folder src/styles

Fungsi: Mengatur tampilan visual, token desain, tata letak responsif, dan gaya aksesibilitas seluruh halaman secara terpisah per bagian.

## Daftar File

* `tokens.css`: Variabel CSS untuk warna, skala tipografi `clamp()`, jarak, radius sudut, bayangan terbatas, dan durasi transisi.
* `reset.css`: Penyetelan ulang gaya bawaan browser yang aman bagi aksesibilitas.
* `base.css`: Gaya dasar tipografi, fokus keyboard `:focus-visible`, aturan `prefers-reduced-motion`, wadah halaman, dan tombol standar.
* `nav.css`: Gaya bilah navigasi, menu responsif HP, panel hasil pencarian, dan tombol laci keranjang.
* `hero.css`: Gaya bagian pembuka, judul dengan kotak sorot warna, lapisan uap kopi, dan posisi maskot beruang.
* `parade.css`: Gaya bagian parade minuman ter-pin, teks raksasa latar belakang, kartu info, dan penanda progres.
* `builder.css`: Gaya bagian pembuat cangkir berlatar cokelat espresso, panggung lingkaran pratinjau, dan empat langkah pemilih.
* `testimonials.css`: Gaya jalur marquee miring dua arah dan kartu ulasan berwarna pastel.
* `footer.css`: Gaya bagian penutup berlatar cokelat espresso, kapsul status buka, tiga kartu miring ringan, tautan sosial, dan wordmark raksasa.
* `cart.css`: Gaya laci keranjang geser, daftar item, keadaan kosong, dan tombol pesan WhatsApp.

## Hubungan Antar File

Seluruh file diimpor secara berurutan di `src/main.js`, dimulai dari `tokens.css`, `reset.css`, dan `base.css` agar variabel dan fondasi tersedia untuk semua file bagian halaman.