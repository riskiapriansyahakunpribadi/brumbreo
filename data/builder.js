/*
NAMA: Data Pembuat Cangkir
FUNGSI: Menyimpan daftar pilihan warna gelas, minuman, ekspresi wajah beruang, dan topping beserta harga tambahannya.
CARA MENGUBAH: Ubah label, kode warna hex, atau extraPrice pada tiap opsi sesuai kebutuhan menu.
CARA MENAMBAH: Tambahkan objek baru di dalam cupColors, drinks, expressions, atau toppings. Untuk ekspresi atau topping baru, tambahkan gambar SVG-nya di src/svg/bearCup.js.
CARA MENGHAPUS: Hapus objek pilihan yang tidak diperlukan; minimal sisakan satu opsi di setiap langkah.
*/

export const builderConfig = {
  // GANTI: sesuaikan harga dasar satu gelas racikan.
  basePrice: 26000,

  defaults: {
    cupColor: 'krem',
    drink: 'kopi-madu',
    expression: 'senyum',
    topping: 'krim-kocok'
  },

  cupColors: [
    {
      id: 'krem',
      label: 'Krem Susu',
      hex: '#FBF6EE',
      extraPrice: 0
    },
    {
      id: 'karamel',
      label: 'Karamel Hangat',
      hex: '#EED3B6',
      extraPrice: 0
    },
    {
      id: 'merah-muda',
      label: 'Merah Muda Permen',
      hex: '#F9D2DC',
      extraPrice: 0
    },
    {
      id: 'matcha',
      label: 'Hijau Daun',
      hex: '#D6ECDC',
      extraPrice: 0
    },
    {
      id: 'taro',
      label: 'Ungu Taro',
      hex: '#E4DAF7',
      extraPrice: 0
    }
  ],

  drinks: [
    {
      id: 'kopi-madu',
      label: 'Kopi Susu Madu',
      liquidHex: '#9B6542',
      // GANTI: sesuaikan tambahan harga bila perlu.
      extraPrice: 0
    },
    {
      id: 'latte-oat',
      label: 'Latte Susu Oat',
      liquidHex: '#B98B63',
      // GANTI: sesuaikan tambahan harga bila perlu.
      extraPrice: 6000
    },
    {
      id: 'cokelat-pekat',
      label: 'Cokelat Pekat',
      liquidHex: '#6D402C',
      // GANTI: sesuaikan tambahan harga bila perlu.
      extraPrice: 2000
    },
    {
      id: 'matcha-susu',
      label: 'Matcha Susu',
      liquidHex: '#84B78E',
      // GANTI: sesuaikan tambahan harga bila perlu.
      extraPrice: 5000
    },
    {
      id: 'susu-beri',
      label: 'Susu Stroberi',
      liquidHex: '#E58AA3',
      // GANTI: sesuaikan tambahan harga bila perlu.
      extraPrice: 4000
    }
  ],

  expressions: [
    {
      id: 'senyum',
      label: 'Senyum Hangat',
      extraPrice: 0
    },
    {
      id: 'kedip',
      label: 'Kedip Jahil',
      extraPrice: 0
    },
    {
      id: 'nyaman',
      label: 'Mata Terpejam',
      extraPrice: 0
    },
    {
      id: 'cerah',
      label: 'Berbinar',
      extraPrice: 0
    }
  ],

  toppings: [
    {
      id: 'tanpa-topping',
      label: 'Tanpa Topping',
      extraPrice: 0
    },
    {
      id: 'krim-kocok',
      label: 'Krim Kocok',
      // GANTI: sesuaikan tambahan harga topping.
      extraPrice: 4000
    },
    {
      id: 'boba-madu',
      label: 'Boba Madu',
      // GANTI: sesuaikan tambahan harga topping.
      extraPrice: 5000
    },
    {
      id: 'biskuit-beruang',
      label: 'Biskuit Beruang',
      // GANTI: sesuaikan tambahan harga topping.
      extraPrice: 5000
    },
    {
      id: 'taburan-kakao',
      label: 'Taburan Kakao',
      // GANTI: sesuaikan tambahan harga topping.
      extraPrice: 3000
    }
  ]
};