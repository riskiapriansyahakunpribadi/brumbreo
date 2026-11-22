/*
NAMA: Utilitas Format Harga dan Teks
FUNGSI: Mengubah angka menjadi format Rupiah rapi serta menyusun teks jumlah yang konsisten.
CARA MENGUBAH: Ubah mata uang atau locale pada fungsi formatRupiah jika kelak melayani mata uang lain.
CARA MENAMBAH: Tambahkan fungsi pemformatan murni lain (seperti tanggal) di bagian bawah file.
CARA MENGHAPUS: Pastikan tidak ada modul di src/modules/ yang mengimpor fungsi sebelum menghapusnya.
*/

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

export function formatRupiah(amount) {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return rupiahFormatter.format(0);
  }
  return rupiahFormatter.format(Math.round(numeric));
}

export function formatExtraPrice(amount) {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return 'Termasuk';
  }
  return `+${formatRupiah(numeric)}`;
}