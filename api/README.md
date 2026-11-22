# Folder api

Fungsi: Menyimpan endpoint serverless Vercel yang berjalan di sisi server untuk kebutuhan yang tidak boleh memaparkan rahasia di browser.

## Daftar File

* `newsletter.js`: Menerima pendaftaran email buletin melalui POST, menjalankan validasi format email, pengecekan kolom honeypot anti-bot, pembatasan laju permintaan, dan mengembalikan respons aman tanpa membocorkan detail galat internal.

## Hubungan Antar File

Dipanggil oleh `src/modules/footer.js` melalui permintaan `fetch('/api/newsletter')`. Header keamanan dan peruteannya diatur bersama `vercel.json`.