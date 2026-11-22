/*
NAMA: Data Menu Parade Minuman
FUNGSI: Menyimpan empat minuman utama yang tampil di bagian parade dan dicari lewat bilah pencarian navigasi.
CARA MENGUBAH: Ubah nama, tag rasa, deskripsi, harga, atau kode warna pastel pada masing-masing objek minuman.
CARA MENAMBAH: Tambahkan objek minuman baru di dalam array menuItems dengan id unik; parade dan pencarian ikut menyesuaikan.
CARA MENGHAPUS: Hapus objek minuman yang tidak lagi dijual, minimal sisakan satu minuman agar parade tetap tampil.
*/

export const menuItems = [
  {
    id: 'madu-kodiak',
    name: 'Madu Kodiak',
    tag: 'Klasik',
    description:
      'Espresso pekat dipadu susu dingin lembut dan sirup madu hutan yang manisnya tenang di tenggorokan.',
    // GANTI: sesuaikan dengan harga jual asli di kedai.
    price: 28000,
    bgColor: '#F3E6D8',
    cupColor: '#FBF6EE',
    liquidColor: '#9B6542',
    expression: 'senyum',
    topping: 'krim-kocok',
    keywords: ['kopi', 'madu', 'susu', 'espresso', 'klasik', 'manis']
  },
  {
    id: 'beri-grizzly',
    name: 'Beri Grizzly',
    tag: 'Segar',
    description:
      'Susu dingin berpadu selai stroberi rumahan dan sentuhan espresso ringan yang segar sejak tegukan pertama.',
    // GANTI: sesuaikan dengan harga jual asli di kedai.
    price: 31000,
    bgColor: '#FBE1E8',
    cupColor: '#FFF6F8',
    liquidColor: '#E58AA3',
    expression: 'kedip',
    topping: 'biskuit-beruang',
    keywords: ['stroberi', 'beri', 'buah', 'segar', 'kopi', 'pink']
  },
  {
    id: 'taro-hibernasi',
    name: 'Taro Hibernasi',
    tag: 'Lembut',
    description:
      'Krim taro lembut tanpa kopi dengan aroma vanila panggang untuk menemani sore yang berjalan pelan.',
    // GANTI: sesuaikan dengan harga jual asli di kedai.
    price: 29000,
    bgColor: '#EAE2FA',
    cupColor: '#FAF7FF',
    liquidColor: '#B7A2DF',
    expression: 'nyaman',
    topping: 'boba-madu',
    keywords: ['taro', 'ungu', 'non kopi', 'tanpa kopi', 'vanila', 'lembut']
  },
  {
    id: 'matcha-hutan',
    name: 'Matcha Hutan',
    tag: 'Pekat',
    description:
      'Bubuk matcha pekat dikocok halus bersama susu segar, meninggalkan rasa teh panggang yang bersih di akhir.',
    // GANTI: sesuaikan dengan harga jual asli di kedai.
    price: 32000,
    bgColor: '#DFF2E4',
    cupColor: '#F6FBF7',
    liquidColor: '#84B78E',
    expression: 'cerah',
    topping: 'taburan-kakao',
    keywords: ['matcha', 'teh hijau', 'non kopi', 'hijau', 'pekat']
  }
];