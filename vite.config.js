/*
NAMA: Konfigurasi Vite
FUNGSI: Mengatur proses pengembangan lokal dan build statis agar hasilnya siap dipasang di Vercel.
CARA MENGUBAH: Ubah properti di objek build atau server jika butuh port lokal berbeda.
CARA MENAMBAH: Tambahkan plugin Vite di properti plugins bila diperlukan di masa depan.
CARA MENGHAPUS: Jangan dihapus karena Vite memakai berkas ini untuk mengatur folder keluaran dist.
*/

import { defineConfig } from 'vite';

export default defineConfig({
  // Hasil build selalu ditaruh di folder dist agar cocok dengan bawaan Vercel.
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020'
  },
  server: {
    port: 5173,
    strictPort: false
  }
});