/*
NAMA: Modul Scroll Halus dan Sinkronisasi GSAP
FUNGSI: Menginisialisasi Lenis yang tersinkronisasi dengan GSAP ScrollTrigger, mematikan gerak berlebih saat prefers-reduced-motion aktif atau diubah, dan menyegarkan posisi ScrollTrigger saat layar berubah orientasi.
CARA MENGUBAH: Ubah nilai duration atau touchMultiplier pada pengaturan Lenis untuk menyesuaikan rasa guliran.
CARA MENAMBAH: Tambahkan fungsi pembantu posisi scroll bila bagian baru butuh melompat ke koordinat piksel tertentu.
CARA MENGHAPUS: Jika dihapus, hapus impornya di src/main.js dan halaman kembali memakai scroll bawaan browser.
*/

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;
let tickerCallback = null;
let listenersBound = false;

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function bindGlobalScrollListeners() {
  if (listenersBound) return;
  listenersBound = true;

  // Matikan Lenis segera jika pengguna menyalakan pengaturan kurangi gerak saat halaman terbuka.
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (typeof reducedQuery.addEventListener === 'function') {
    reducedQuery.addEventListener('change', (event) => {
      if (event.matches) {
        destroySmoothScroll();
      }
    });
  }

  // Segarkan koordinat ScrollTrigger setelah rotasi layar atau perubahan lebar selesai.
  let resizeTimer = null;
  window.addEventListener(
    'resize',
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 180);
    },
    { passive: true }
  );
}

export function initSmoothScroll() {
  bindGlobalScrollListeners();

  if (prefersReducedMotion()) {
    return null;
  }

  if (lenisInstance) {
    return lenisInstance;
  }

  // Lenis dipilih agar scroll terasa halus seperti video sambil tetap ramah keyboard dan anchor native.
  lenisInstance = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  tickerCallback = (time) => {
    lenisInstance?.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function pauseSmoothScroll() {
  lenisInstance?.stop();
}

export function resumeSmoothScroll() {
  lenisInstance?.start();
}

export function scrollToTarget(target, options = {}) {
  const offset = Number(options.offset || 0);

  if (lenisInstance && !prefersReducedMotion()) {
    lenisInstance.scrollTo(target, {
      offset,
      duration: options.immediate ? 0 : 1.1
    });
    return;
  }

  if (typeof target === 'number') {
    window.scrollTo({ top: Math.max(0, target + offset), behavior: 'auto' });
    return;
  }

  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (element) {
    const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY + offset);
    window.scrollTo({ top, behavior: 'auto' });
  }
}

export function destroySmoothScroll() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}