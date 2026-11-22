/*
NAMA: Titik Masuk Utama Brumbreo
FUNGSI: Memuat seluruh lembar gaya dan menginisialisasi scroll halus, navigasi pencarian, hero beruang, parade minuman, pembuat cangkir, testimoni, penutup footer, serta laci keranjang secara berurutan.
CARA MENGUBAH: Tambahkan impor CSS dan pemanggilan fungsi init modul setiap kali bagian halaman baru selesai dibangun.
CARA MENAMBAH: Impor modul baru di bagian atas lalu panggil di dalam fungsi bootstrap().
CARA MENGHAPUS: Hapus impor CSS dan pemanggilan modul dari bootstrap() jika fitur terkait dilepas.
*/

import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './styles/tokens.css';
import './styles/reset.css';
import './styles/base.css';
import './styles/nav.css';
import './styles/hero.css';
import './styles/parade.css';
import './styles/builder.css';
import './styles/testimonials.css';
import './styles/footer.css';
import './styles/cart.css';

import { initSmoothScroll } from './modules/smoothScroll.js';
import { initNavSearch } from './modules/navSearch.js';
import { initHero } from './modules/heroMotion.js';
import { initParade } from './modules/parade.js';
import { initBuilder } from './modules/builder.js';
import { initTestimonials } from './modules/testimonials.js';
import { initFooter } from './modules/footer.js';
import { initCart } from './modules/cart.js';

function bootstrap() {
  initSmoothScroll();
  initNavSearch();
  initHero();
  initParade();
  initBuilder();
  initTestimonials();
  initFooter();
  initCart();

  // Hitung ulang posisi ScrollTrigger setelah seluruh bagian dan font selesai dirender.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  } else {
    ScrollTrigger.refresh();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}