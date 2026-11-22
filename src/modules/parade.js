/*
NAMA: Modul Parade Minuman
FUNGSI: Merender daftar minuman dari data/menu.js, menjalankan animasi pin dan scroll horizontal GSAP, mengubah warna latar serta teks raksasa secara sinkron, menangani lompatan dari pencarian, dan mengirim item ke keranjang.
CARA MENGUBAH: Ubah tulisan tajuk parade atau kecepatan jarak gulir pada properti end di konfigurasi ScrollTrigger.
CARA MENAMBAH: Cukup tambahkan objek minuman baru di data/menu.js; slide, warna latar, dan angka progres ikut menyesuaikan otomatis.
CARA MENGHAPUS: Jika bagian parade tidak dipakai, hapus pemanggilan initParade() di src/main.js.
*/

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { menuItems } from '../../data/menu.js';
import { createBearCup } from '../svg/bearCup.js';
import { createIcon } from '../svg/icons.js';
import { formatRupiah } from '../utils/format.js';
import { prefersReducedMotion, scrollToTarget } from './smoothScroll.js';

gsap.registerPlugin(ScrollTrigger);

function padTwo(num) {
  return String(num).padStart(2, '0');
}

export function initParade() {
  const section = document.getElementById('menu');
  if (!section) return;

  section.replaceChildren();

  // Keadaan kosong yang jelas bila seluruh minuman di data/menu.js dihapus.
  if (!Array.isArray(menuItems) || menuItems.length === 0) {
    const emptyWrap = document.createElement('div');
    emptyWrap.className = 'container parade-empty';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = 'Daftar minuman sedang disiapkan';

    const desc = document.createElement('p');
    desc.className = 'lead-text';
    desc.textContent = 'Belum ada minuman yang tercatat. Kamu tetap bisa meracik cangkirmu sendiri di bagian pembuat cangkir.';

    emptyWrap.append(title, desc);
    section.appendChild(emptyWrap);
    return;
  }

  const count = menuItems.length;
  const reduced = prefersReducedMotion();

  section.style.backgroundColor = menuItems[0].bgColor;

  const stage = document.createElement('div');
  stage.className = 'parade-stage';

  // 1. Tajuk bagian di sisi kiri atas.
  const headerWrap = document.createElement('div');
  headerWrap.className = 'container parade-header';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'parade-eyebrow';
  eyebrow.textContent = 'Pilihan utama';

  const heading = document.createElement('h2');
  heading.className = 'parade-heading';
  heading.append('Parade');

  const headingPill = document.createElement('span');
  headingPill.className = 'parade-heading__pill';
  headingPill.textContent = 'minuman';
  heading.appendChild(headingPill);

  headerWrap.append(eyebrow, heading);

  // 2. Jendela dan jalur horizontal slide minuman.
  const viewport = document.createElement('div');
  viewport.className = 'parade-viewport';

  const track = document.createElement('div');
  track.className = 'parade-track';

  const slideElements = [];
  const cupWrappers = [];
  const watermarks = [];

  menuItems.forEach((drink, idx) => {
    const slide = document.createElement('article');
    slide.className = 'parade-slide';
    slide.id = `menu-${drink.id}`;
    slide.dataset.drinkId = drink.id;
    slide.dataset.slideIndex = String(idx);

    if (reduced) {
      slide.style.backgroundColor = drink.bgColor;
    }

    const watermark = document.createElement('span');
    watermark.className = 'parade-watermark';
    watermark.setAttribute('aria-hidden', 'true');
    watermark.textContent = drink.name;
    watermarks.push(watermark);

    const inner = document.createElement('div');
    inner.className = 'container parade-slide__inner';

    const cupCol = document.createElement('div');
    cupCol.className = 'parade-cup-col';

    const cupWrap = document.createElement('div');
    cupWrap.className = 'parade-cup-wrap';

    const cupSvg = createBearCup({
      cupColor: drink.cupColor,
      liquidColor: drink.liquidColor,
      expression: drink.expression,
      topping: drink.topping,
      showHandle: true,
      size: 420,
      label: `Gelas beruang minuman ${drink.name}`
    });
    cupWrap.appendChild(cupSvg);
    cupWrappers.push(cupWrap);
    cupCol.appendChild(cupWrap);

    const info = document.createElement('div');
    info.className = 'parade-info';

    const tag = document.createElement('span');
    tag.className = 'parade-tag';
    tag.textContent = drink.tag;

    const name = document.createElement('h3');
    name.className = 'parade-name';
    name.textContent = drink.name;

    const desc = document.createElement('p');
    desc.className = 'parade-desc';
    desc.textContent = drink.description;

    const buyRow = document.createElement('div');
    buyRow.className = 'parade-buy-row';

    const price = document.createElement('p');
    price.className = 'parade-price';
    price.textContent = formatRupiah(drink.price);

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn--dark parade-add-btn';

    const plusIcon = createIcon('plus', { size: 16 });
    const btnText = document.createElement('span');
    btnText.textContent = 'Tambah ke keranjang';
    addBtn.append(plusIcon, btnText);

    let resetTimer = null;
    addBtn.addEventListener('click', () => {
      window.dispatchEvent(
        new CustomEvent('brumbreo:add-to-cart', {
          detail: {
            id: `menu-${drink.id}`,
            name: drink.name,
            note: drink.tag,
            price: drink.price,
            quantity: 1
          }
        })
      );

      addBtn.classList.add('is-added');
      btnText.textContent = 'Masuk keranjang';

      if (!reduced) {
        gsap.fromTo(
          cupWrap,
          { scale: 1 },
          { scale: 1.05, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' }
        );
      }

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        addBtn.classList.remove('is-added');
        btnText.textContent = 'Tambah ke keranjang';
      }, 1300);
    });

    buyRow.append(price, addBtn);
    info.append(tag, name, desc, buyRow);
    inner.append(cupCol, info);
    slide.append(watermark, inner);
    track.appendChild(slide);
    slideElements.push(slide);
  });

  viewport.appendChild(track);

  // 3. Penanda progres dan petunjuk scroll di bagian bawah panggung.
  const footerBar = document.createElement('div');
  footerBar.className = 'container parade-footer';

  const counter = document.createElement('p');
  counter.className = 'parade-counter';
  counter.setAttribute('aria-live', 'polite');
  counter.textContent = `01 dari ${padTwo(count)}`;

  const progressTrack = document.createElement('div');
  progressTrack.className = 'parade-progress-track';
  progressTrack.setAttribute('aria-hidden', 'true');

  const progressFill = document.createElement('div');
  progressFill.className = 'parade-progress-fill';
  progressFill.style.transform = `scaleX(${1 / count})`;
  progressTrack.appendChild(progressFill);

  const hint = document.createElement('p');
  hint.className = 'parade-hint';
  hint.textContent = 'Gulir untuk berganti';

  footerBar.append(counter, progressTrack, hint);

  stage.append(headerWrap, viewport, footerBar);
  section.appendChild(stage);

  let paradeTrigger = null;

  function goToSlideIndex(targetIdx) {
    const safeIdx = Math.max(0, Math.min(count - 1, Number(targetIdx) || 0));

    if (paradeTrigger && count > 1) {
      const progress = safeIdx / (count - 1);
      const targetY = paradeTrigger.start + progress * (paradeTrigger.end - paradeTrigger.start);
      scrollToTarget(targetY);
      return;
    }

    const slideEl = slideElements[safeIdx];
    if (slideEl) {
      scrollToTarget(slideEl, { offset: -88 });
    }
  }

  // Dengarkan pemilihan minuman dari bilah pencarian di navigasi.
  window.addEventListener('brumbreo:select-drink', (event) => {
    const index = event.detail?.index;
    if (typeof index === 'number' && index >= 0 && index < count) {
      event.preventDefault();
      goToSlideIndex(index);
    }
  });

  // Saat pengguna bernavigasi dengan Tab ke tombol di slide lain, gulir parade ke slide tersebut agar selalu tampak.
  slideElements.forEach((slide, idx) => {
    slide.addEventListener('focusin', () => {
      if (paradeTrigger && count > 1) {
        const currentProgress = paradeTrigger.progress;
        const activeIdx = Math.round(currentProgress * (count - 1));
        if (activeIdx !== idx) {
          goToSlideIndex(idx);
        }
      }
    });
  });

  if (reduced || count <= 1) {
    return;
  }

  // Gerak mengapung lembut yang seragam pada gelas di setiap slide.
  cupWrappers.forEach((wrap, idx) => {
    const svgNode = wrap.querySelector('svg');
    if (!svgNode) return;
    gsap.to(svgNode, {
      y: -7,
      duration: 2.7 + idx * 0.25,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });

  let activeSlideIndex = 0;

  // Timeline utama menyinkronkan geser horizontal, perubahan warna latar, gerak teks raksasa, kemiringan gelas, dan progres.
  const totalSteps = count - 1;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * (window.innerWidth <= 640 ? 2.5 : 3.2))}`,
      pin: stage,
      scrub: 0.75,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const nextIdx = Math.min(count - 1, Math.round(self.progress * totalSteps));
        if (nextIdx !== activeSlideIndex) {
          activeSlideIndex = nextIdx;
          counter.textContent = `${padTwo(activeSlideIndex + 1)} dari ${padTwo(count)}`;
        }
      }
    }
  });

  paradeTrigger = tl.scrollTrigger;

  // 1. Geser seluruh jalur minuman secara horizontal tepat selebar viewport per slide.
  tl.to(
    track,
    {
      x: () => -(totalSteps * viewport.clientWidth),
      ease: 'none',
      duration: totalSteps
    },
    0
  );

  // 2. Perbarui bilah progres dengan transform scaleX agar tidak memicu layout.
  tl.fromTo(
    progressFill,
    { scaleX: 1 / count },
    { scaleX: 1, ease: 'none', duration: totalSteps },
    0
  );

  // 3. Transisi halus warna latar belakang, teks raksasa parallax, dan kemiringan bermain tiap gelas.
  for (let i = 1; i < count; i += 1) {
    tl.to(
      section,
      {
        backgroundColor: menuItems[i].bgColor,
        ease: 'none',
        duration: 1
      },
      i - 1
    );
  }

  watermarks.forEach((mark, idx) => {
    const startOffset = idx === 0 ? 0 : 12;
    const endOffset = idx === count - 1 ? 0 : -12;
    tl.fromTo(
      mark,
      { xPercent: startOffset },
      { xPercent: endOffset, ease: 'none', duration: totalSteps },
      0
    );
  });

  cupWrappers.forEach((cup, idx) => {
    if (idx > 0) {
      tl.fromTo(
        cup,
        { rotation: 7, scale: 0.92 },
        { rotation: 0, scale: 1, ease: 'power1.out', duration: 0.65 },
        idx - 0.85
      );
    }
    if (idx < count - 1) {
      tl.to(
        cup,
        { rotation: -7, scale: 0.92, ease: 'power1.in', duration: 0.65 },
        idx + 0.2
      );
    }
  });
}