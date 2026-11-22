# Folder src/utils

Fungsi: Menyimpan fungsi bantu murni yang dipakai ulang lintas modul agar logika format, waktu, penyimpanan, dan tautan tetap rapi dan mudah diuji.

## Daftar File

* `format.js`: Memformat angka harga ke format Rupiah yang ringkas dan konsisten.
* `openHours.js`: Menghitung status buka atau tutup kedai secara langsung berdasarkan jam perangkat dan jadwal di `data/business.js`.
* `storage.js`: Membaca dan menulis data keranjang non-sensitif ke `localStorage` disertai validasi struktur agar tahan terhadap data rusak.
* `whatsapp.js`: Menyusun tautan WhatsApp yang aman dan ter-encode untuk pesanan dari keranjang maupun cangkir racikan builder.

## Hubungan Antar File

Dipakai oleh modul-modul di `src/modules/` (`parade.js`, `builder.js`, `cart.js`, `footer.js`) tanpa ketergantungan langsung pada DOM.