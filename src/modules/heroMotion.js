/*
NAMA: Modul Hero, Adegan Animasi Minuman, dan Gerak Karakter Beruang
FUNGSI: Memasang maskot gelas beruang utuh dan uap kopi SVG di Hero, menjalankan adegan animasi penyajian empat minuman secara otomatis (tuang cairan, topping jatuh membal dengan percikan, goyang telinga, kedip mata, dan pergantian lingkaran pastel), mengganti rasa langsung saat cangkir diklik, serta parallax kursor desktop dan gerak miring scroll HP.
CARA MENGUBAH: Ubah durasi jeda pergantian rasa pada SCENE_DURATION_SEC atau urutan animasi di fungsi playDrinkScene().
CARA MENAMBAH: Minuman baru di data/menu.js otomatis ikut berputar di adegan animasi Hero tanpa mengubah file ini.
CARA MENGHAPUS: Jika dihapus, maskot beruang dan adegan minuman tidak akan muncul di bagian beranda.
*/

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { menuItems } from '../../data/menu.js';
import { createBearCup, updateBearCup } from '../svg/bearCup.js';
import { createSteamSvg } from '../svg/steam.js';
import { prefersReducedMotion } from './smoothScroll.js';

gsap.registerPlugin(ScrollTrigger);

const SCENE_DURATION_SEC = 4.4;

export function initHero() {
  const heroSection = document.getElementById('beranda');
  const steamHost = document.getElementById('hero-steam');
  const stageRing = document.getElementById('hero-stage-ring');
  const mascotTilt = document.getElementById('hero-mascot-tilt');

  if (!heroSection || !steamHost || !mascotTilt) return;

  const drinks =
    Array.isArray(menuItems) && menuItems.length > 0
      ? menuItems
      : [
          {
            id: 'madu-kodiak',
            name: 'Madu Kodiak',
            tag: 'Klasik',
            bgColor: '#F3E6D8',
            cupColor: '#FFFDF9',
            liquidColor: '#9B6542',
            expression: 'senyum',
            topping: 'krim-kocok'
          }
        ];

  const reduced = prefersReducedMotion();
  let activeIndex = 0;
  let isInView = true;
  let sceneTimeline = null;

  // 1. Pasang pita uap kopi SVG di latar krem hangat.
  steamHost.replaceChildren(createSteamSvg({ variant: 'hero', className: 'hero-steam-svg' }));

  // 2. Pasang maskot gelas kepala beruang di dalam tombol interaktif agar bisa diklik atau diaktifkan keyboard.
  const firstDrink = drinks[0];
  if (stageRing) {
    stageRing.style.backgroundColor = firstDrink.bgColor;
  }

  const cupButton = document.createElement('button');
  cupButton.type = 'button';
  cupButton.className = 'hero-cup-btn';
  cupButton.setAttribute(
    'aria-label',
    `Gelas beruang ${firstDrink.name}. Ketuk untuk mengganti rasa minuman`
  );

  const bearSvg = createBearCup({
    cupColor: firstDrink.cupColor,
    liquidColor: firstDrink.liquidColor,
    expression: firstDrink.expression,
    topping: firstDrink.topping,
    showHandle: true,
    size: 420,
    label: `Animasi minuman ${firstDrink.name} di cangkir beruang Brumbreo`
  });

  cupButton.appendChild(bearSvg);
  mascotTilt.replaceChildren(cupButton);

  function applyDrinkVisuals(drink) {
    updateBearCup(bearSvg, {
      cupColor: drink.cupColor,
      liquidColor: drink.liquidColor,
      expression: drink.expression,
      topping: drink.topping
    });

    bearSvg.setAttribute(
      'aria-label',
      `Animasi minuman ${drink.name} di cangkir beruang Brumbreo`
    );
    cupButton.setAttribute(
      'aria-label',
      `Gelas beruang ${drink.name}. Ketuk untuk mengganti rasa minuman`
    );
  }

  // Adegan animasi penyajian satu minuman lalu berpindah otomatis ke rasa berikutnya.
  function playDrinkScene(index, options = {}) {
    activeIndex = (index + drinks.length) % drinks.length;
    const drink = drinks[activeIndex];

    if (sceneTimeline) {
      sceneTimeline.kill();
      sceneTimeline = null;
    }

    applyDrinkVisuals(drink);

    if (reduced) {
      if (stageRing) {
        stageRing.style.backgroundColor = drink.bgColor;
      }
      return;
    }

    const liquidInner = bearSvg.querySelector('[data-part="liquid-inner"]');
    const toppingPart = bearSvg.querySelector('[data-part="topping"]');
    const splashPart = bearSvg.querySelector('[data-part="splash"]');
    const earLeft = bearSvg.querySelector('[data-part="ear-left"]');
    const earRight = bearSvg.querySelector('[data-part="ear-right"]');
    const eyesPart = bearSvg.querySelector('[data-part="eyes"]');
    const cheeksPart = bearSvg.querySelector('[data-part="cheeks"]');

    sceneTimeline = gsap.timeline({
      onComplete: () => {
        if (isInView && drinks.length > 1) {
          playDrinkScene(activeIndex + 1);
        }
      }
    });

    // Pergantian warna lingkaran panggung pastel serempak dengan rasa minuman.
    if (stageRing) {
      sceneTimeline.to(
        stageRing,
        {
          backgroundColor: drink.bgColor,
          scale: options.fromInteraction ? 1.05 : 1.02,
          duration: 0.42,
          ease: 'power2.out'
        },
        0
      );
      sceneTimeline.to(
        stageRing,
        {
          scale: 1,
          duration: 0.45,
          ease: 'power2.out'
        },
        0.42
      );
    }

    // 1. Gelas membal jenaka saat adegan dimulai.
    sceneTimeline.fromTo(
      bearSvg,
      { scaleX: 1.06, scaleY: 0.93, y: 6 },
      {
        scaleX: 1,
        scaleY: 1,
        y: 0,
        duration: 0.56,
        ease: 'elastic.out(1, 0.55)'
      },
      0
    );

    // 2. Cairan minuman terisi naik bergelombang dari dalam mulut gelas.
    if (liquidInner) {
      sceneTimeline.fromTo(
        liquidInner,
        { y: 46, opacity: 0.2 },
        { y: 0, opacity: 1, duration: 0.58, ease: 'power2.out' },
        0.06
      );
    }

    // 3. Topping turun membal dari atas disertai percikan tetes mikro.
    if (toppingPart) {
      sceneTimeline.fromTo(
        toppingPart,
        { y: -58, scale: 0.72, opacity: 0, svgOrigin: '210 145' },
        { y: 0, scale: 1, opacity: 1, duration: 0.62, ease: 'back.out(1.9)' },
        0.34
      );
    }

    if (splashPart) {
      sceneTimeline.fromTo(
        splashPart,
        { scale: 0.55, y: 12, opacity: 0, svgOrigin: '210 120' },
        { scale: 1.06, y: -4, opacity: 0.92, duration: 0.22, ease: 'power2.out' },
        0.54
      );
      sceneTimeline.to(
        splashPart,
        { scale: 1.18, y: -12, opacity: 0, duration: 0.28, ease: 'power1.in' },
        0.76
      );
    }

    // 4. Kedua telinga beruang berkedut gembira bergantian dan pipi merona hangat.
    if (earLeft) {
      sceneTimeline.to(
        earLeft,
        { rotation: -10, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out', svgOrigin: '118 112' },
        0.58
      );
    }
    if (earRight) {
      sceneTimeline.to(
        earRight,
        { rotation: 10, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out', svgOrigin: '302 112' },
        0.7
      );
    }
    if (cheeksPart) {
      sceneTimeline.to(
        cheeksPart,
        { scale: 1.12, opacity: 1, duration: 0.26, yoyo: true, repeat: 1, ease: 'sine.inOut', svgOrigin: '210 294' },
        0.62
      );
    }

    // 5. Kedipan mata alami dua kali selama adegan berlangsung.
    if (eyesPart && drink.expression !== 'nyaman') {
      sceneTimeline.to(
        eyesPart,
        { scaleY: 0.08, duration: 0.09, yoyo: true, repeat: 1, ease: 'power1.inOut', svgOrigin: '210 266' },
        1.7
      );
      sceneTimeline.to(
        eyesPart,
        { scaleY: 0.08, duration: 0.09, yoyo: true, repeat: 1, ease: 'power1.inOut', svgOrigin: '210 266' },
        3.15
      );
    }

    // Tahan akhir timeline sesuai durasi SCENE_DURATION_SEC sebelum berpindah ke minuman berikutnya.
    sceneTimeline.to({}, { duration: Math.max(0.4, SCENE_DURATION_SEC - sceneTimeline.duration()) });
  }

  // Klik langsung pada cangkir beruang memicu ganti rasa dan animasi tuang seketika.
  cupButton.addEventListener('click', () => {
    playDrinkScene(activeIndex + 1, { fromInteraction: true });
  });

  if (reduced) {
    return;
  }

  const lines = heroSection.querySelectorAll('.hero-line');
  const pill = heroSection.querySelector('.hero-pill');
  const subtitle = heroSection.querySelector('.hero-subtitle');
  const steamStrands = steamHost.querySelectorAll('.steam-strand');

  // Animasi masuk pembuka halaman lalu otomatis memulai adegan minuman pertama.
  const intro = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      playDrinkScene(0);
    }
  });

  intro
    .from(lines, {
      y: 26,
      opacity: 0,
      duration: 0.65,
      stagger: 0.09
    })
    .from(
      pill,
      {
        scale: 0.84,
        rotate: -5.5,
        duration: 0.58,
        ease: 'back.out(1.7)'
      },
      '-=0.46'
    )
    .from(
      subtitle,
      {
        y: 14,
        opacity: 0,
        duration: 0.48
      },
      '-=0.38'
    )
    .from(
      [stageRing, mascotTilt],
      {
        scale: 0.88,
        y: 36,
        opacity: 0,
        duration: 0.72,
        stagger: 0.06,
        ease: 'back.out(1.4)'
      },
      '-=0.46'
    );

  // Alunan uap kopi lembut di latar belakang.
  steamStrands.forEach((strand, idx) => {
    gsap.to(strand, {
      y: idx % 2 === 0 ? -18 : -24,
      x: idx % 2 === 0 ? 8 : -8,
      opacity: 0.82,
      duration: 4.4 + idx * 0.7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });

  // Gerak mengapung lembut pada wadah tombol gelas agar tidak bentrok dengan scaleX/scaleY di bearSvg.
  gsap.to(cupButton, {
    y: -7,
    duration: 2.9,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  // Jeda otomatis adegan Hero ketika pengguna sudah menggulir ke bawah agar hemat CPU dan baterai.
  ScrollTrigger.create({
    trigger: heroSection,
    start: 'top bottom',
    end: 'bottom top',
    onLeave: () => {
      isInView = false;
      sceneTimeline?.pause();
    },
    onEnterBack: () => {
      isInView = true;
      if (sceneTimeline) {
        sceneTimeline.resume();
      } else {
        playDrinkScene(activeIndex);
      }
    }
  });

  // Parallax kursor di desktop: gelas miring halus, wajah melirik kursor, uap bergerak berlawanan.
  const mm = gsap.matchMedia();

  mm.add('(hover: hover) and (pointer: fine)', () => {
    const moveCupX = gsap.quickTo(mascotTilt, 'x', { duration: 0.6, ease: 'power3.out' });
    const moveCupY = gsap.quickTo(mascotTilt, 'y', { duration: 0.6, ease: 'power3.out' });
    const rotateCup = gsap.quickTo(mascotTilt, 'rotation', { duration: 0.7, ease: 'power3.out' });
    const moveSteamX = gsap.quickTo(steamHost, 'x', { duration: 0.9, ease: 'power3.out' });
    const moveRingX = stageRing
      ? gsap.quickTo(stageRing, 'x', { duration: 0.75, ease: 'power3.out' })
      : null;

    function handlePointerMove(event) {
      const rect = heroSection.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const normX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      moveCupX(normX * 15);
      moveCupY(normY * 8);
      rotateCup(normX * 2.8);
      moveSteamX(normX * -14);
      if (moveRingX) {
        moveRingX(normX * -8);
      }

      const currentFace = bearSvg.querySelector('[data-part="face"]');
      const currentCheeks = bearSvg.querySelector('[data-part="cheeks"]');
      if (currentFace) {
        gsap.to(currentFace, { x: normX * 6, y: normY * 4, duration: 0.45, overwrite: 'auto' });
      }
      if (currentCheeks) {
        gsap.to(currentCheeks, { x: normX * 4, duration: 0.45, overwrite: 'auto' });
      }
    }

    function handlePointerLeave() {
      moveCupX(0);
      moveCupY(0);
      rotateCup(0);
      moveSteamX(0);
      if (moveRingX) {
        moveRingX(0);
      }
      const currentFace = bearSvg.querySelector('[data-part="face"]');
      const currentCheeks = bearSvg.querySelector('[data-part="cheeks"]');
      if (currentFace) {
        gsap.to(currentFace, { x: 0, y: 0, duration: 0.55, overwrite: 'auto' });
      }
      if (currentCheeks) {
        gsap.to(currentCheeks, { x: 0, duration: 0.55, overwrite: 'auto' });
      }
    }

    heroSection.addEventListener('pointermove', handlePointerMove);
    heroSection.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      heroSection.removeEventListener('pointermove', handlePointerMove);
      heroSection.removeEventListener('pointerleave', handlePointerLeave);
    };
  });

  // Di HP dan layar sentuh: gerak miring halus mengikuti scroll.
  mm.add('(hover: none), (max-width: 900px)', () => {
    gsap.to(mascotTilt, {
      rotation: 4,
      y: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8
      }
    });
  });

  // Transisi keluar halus saat pengguna menggulir meninggalkan Hero menuju Parade Minuman.
  gsap.to('.hero-heading-wrap', {
    y: 36,
    opacity: 0.18,
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}