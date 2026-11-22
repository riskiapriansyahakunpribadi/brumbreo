# Folder src/svg

Fungsi: Menghasilkan seluruh ilustrasi dan ikon antarmuka dalam bentuk SVG buatan sendiri tanpa gambar eksternal atau emoji.

## Daftar File

* `bearCup.js`: Merakit maskot gelas kepala beruang dari bagian terpisah (badan, pegangan, telinga bulat, pipi merah muda, permukaan minuman, ekspresi wajah, dan topping) agar warna dan bagiannya mudah diganti serta dianimasikan.
* `steam.js`: Menggambar kurva uap kopi untuk latar hero dan aksen penutup.
* `icons.js`: Kumpulan ikon fungsional kecil (pencarian, keranjang, tutup, tambah, kurang, hapus, lokasi, jam, serta ikon topping dan ekspresi builder).

## Hubungan Antar File

Dipakai oleh `src/modules/heroMotion.js`, `parade.js`, `builder.js`, `navSearch.js`, `cart.js`, dan `footer.js` untuk merender ilustrasi beruang dan ikon antarmuka dengan atribut dimensi serta aksesibilitas yang lengkap.