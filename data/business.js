/*
NAMA: Data Identitas dan Kontak Bisnis
FUNGSI: Menyimpan seluruh informasi kontak, lokasi, jam buka, WhatsApp, dan media sosial Brumbreo.
CARA MENGUBAH: Ubah teks di dalam tanda kutip atau tambahkan baris jadwal sesuai operasional nyata kedai.
CARA MENAMBAH: Tambahkan objek baru di dalam array hours atau socials sesuai bentuk properti yang tertera.
CARA MENGHAPUS: Kosongkan string ("") atau array ([]) untuk menyembunyikan elemen terkait secara otomatis di halaman.
*/

export const business = {
  brandName: 'Brumbreo',
  pronunciation: 'brum-bre-o',
  tagline: 'Seduhan hangat berkarakter beruang.',

  // Format internasional tanpa tanda tambah atau spasi dari nomor 085771191325.
  whatsappNumber: '6285771191325',

  // Alamat email resmi memakai nama kedai.
  email: 'halo@brumbreo.id',

  // Isi alamat lengkap kedai dan tautan Google Maps jika sudah tersedia.
  // Jika address kosong, kartu lokasi di bagian penutup otomatis disembunyikan.
  address: '',
  addressNote: '',
  mapUrl: '',

  // Zona waktu IANA untuk menghitung status buka atau tutup dari jam nyata.
  timezone: 'Asia/Jakarta',

  // Isi jadwal buka harian dengan angka hari 0 (Minggu) sampai 6 (Sabtu) serta jam format 24 jam "HH:MM".
  // Bentuk setiap baris: { day: 1, label: 'Senin', open: '08:00', close: '21:00' }
  // Jika dibiarkan kosong, kartu jam buka dan status buka otomatis disembunyikan.
  hours: [],

  // Tautan akun media sosial memakai nama kedai Brumbreo.
  socials: [
    {
      name: 'Instagram',
      handle: '@brumbreo',
      url: 'https://instagram.com/brumbreo'
    },
    {
      name: 'TikTok',
      handle: '@brumbreo',
      url: 'https://tiktok.com/@brumbreo'
    },
    {
      name: 'Email',
      handle: 'halo@brumbreo.id',
      url: 'mailto:halo@brumbreo.id'
    }
  ],

  // Tahun berdirinya merek untuk baris hak cipta di bagian bawah.
  copyrightYear: 2026
};