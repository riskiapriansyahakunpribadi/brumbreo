/*
NAMA: Modul Testimoni Marquee Dua Arah
FUNGSI: Memvalidasi ulasan asli dari data/testimonials.js, menyembunyikan bagian bila kosong, dan merender dua baris kartu pastel miring yang bergerak berlawanan arah serta berhenti saat disorot, disentuh, atau dijeda.
CARA MENGUBAH: Ubah sudut kemiringan kartu pada TILT_ANGLES atau urutan warna bawaan di TONE_ORDER.
CARA MENAMBAH: Cukup masukkan ulasan asli baru ke data/testimonials.js dengan bidang author dan quote; bagian ini dan tautan Tentang akan tampil otomatis.
CARA MENGHAPUS: Kosongkan array di data/testimonials.js untuk menyembunyikan bagian ini secara bersih tanpa menghapus kode.
*/

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { testimonials } from '../../data/testimonials.js';
import { createIcon } from '../svg/icons.js';
import { prefersReducedMotion } from './smoothScroll.js';

gsap.registerPlugin(ScrollTrigger);

const ALLOWED_TONES = new Set(['cream', 'pink', 'lavender', 'mint']);
const TONE_ORDER = ['cream', 'pink', 'lavender', 'mint'];
const TILT_ANGLES = [-2.1, 1.7, -1.4, 2.2, -1.8, 1.5];

export function getValidTestimonials() {
  if (!Array.isArray(testimonials)) return [];

  return testimonials
    .filter(
      (item) =>
        item &&
        typeof item.author === 'string' &&
        item.author.trim().length > 0 &&
        typeof item.quote === 'string' &&
        item.quote.trim().length > 0
    )
    .map((item, idx) => {
      const tone = ALLOWED_TONES.has(item.tone)
        ? item.tone
        : TONE_ORDER[idx % TONE_ORDER.length];

      return {
        id: item.id ? String(item.id) : `ulasan-${idx + 1}`,
        author: item.author.trim(),
        quote: item.quote.trim(),
        role: typeof item.role === 'string' ? item.role.trim() : '',
        tone
      };
    });
}

function getInitials(name) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'B';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function createCardElement(item, index) {
  const card = document.createElement('article');
  card.className = `testimonial-card tone-${item.tone}`;
  card.style.setProperty('--card-tilt', `${TILT_ANGLES[index % TILT_ANGLES.length]}deg`);

  const quote = document.createElement('blockquote');
  quote.className = 'testimonial-quote';
  quote.textContent = `"${item.quote}"`;

  const footer = document.createElement('div');
  footer.className = 'testimonial-author';

  const avatar = document.createElement('span');
  avatar.className = 'testimonial-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = getInitials(item.author);

  const meta = document.createElement('div');
  meta.className = 'testimonial-author-meta';

  const name = document.createElement('p');
  name.className = 'testimonial-name';
  name.textContent = item.author;
  meta.appendChild(name);

  if (item.role) {
    const role = document.createElement('p');
    role.className = 'testimonial-role';
    role.textContent = item.role;
    meta.appendChild(role);
  }

  footer.append(avatar, meta);
  card.append(quote, footer);
  return card;
}

/* Memastikan satu kelompok marquee cukup panjang untuk layar lebar tanpa celah kosong. */
function expandRowItems(items) {
  const targetCount = Math.max(4, items.length);
  const result = [];
  for (let i = 0; i < targetCount; i += 1) {
    result.push({
      item: items[i % items.length],
      isExtraRepeat: i >= items.length
    });
  }
  return result;
}

function buildMarqueeRow(items, options = {}) {
  const { reverse = false, rowOffset = 0, reduced = false } = options;

  const row = document.createElement('div');
  row.className = reverse ? 'marquee-row is-reverse' : 'marquee-row';

  const track = document.createElement('div');
  track.className = 'marquee-track';

  const sequence = reduced
    ? items.map((item) => ({ item, isExtraRepeat: false }))
    : expandRowItems(items);

  // Kecepatan dijaga tenang agar teks mudah dibaca sambil bergerak.
  const durationSeconds = Math.max(26, sequence.length * 7);
  track.style.setProperty('--marquee-duration', `${durationSeconds}s`);

  const primaryGroup = document.createElement('div');
  primaryGroup.className = 'marquee-group';

  sequence.forEach((entry, idx) => {
    const card = createCardElement(entry.item, idx + rowOffset);
    if (entry.isExtraRepeat) {
      card.setAttribute('aria-hidden', 'true');
    }
    primaryGroup.appendChild(card);
  });

  track.appendChild(primaryGroup);

  if (!reduced) {
    const cloneGroup = document.createElement('div');
    cloneGroup.className = 'marquee-group is-clone';
    cloneGroup.setAttribute('aria-hidden', 'true');

    sequence.forEach((entry, idx) => {
      cloneGroup.appendChild(createCardElement(entry.item, idx + rowOffset));
    });

    track.appendChild(cloneGroup);
  }

  row.appendChild(track);
  return row;
}

export function initTestimonials() {
  const section = document.getElementById('tentang');
  if (!section) return;

  const validItems = getValidTestimonials();

  // Sesuai aturan data jujur: bagian testimoni tidak ditampilkan jika belum ada ulasan asli.
  if (validItems.length === 0) {
    section.hidden = true;
    section.replaceChildren();
    return;
  }

  const reduced = prefersReducedMotion();
  section.hidden = false;
  section.setAttribute('aria-labelledby', 'testimonials-judul');
  section.replaceChildren();

  // 1. Tajuk bagian dan tombol jeda aksesibel.
  const headerContainer = document.createElement('div');
  headerContainer.className = 'container testimonials-header';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'testimonials-eyebrow';
  eyebrow.textContent = 'Dari meja seduh kami';

  const heading = document.createElement('h2');
  heading.id = 'testimonials-judul';
  heading.className = 'section-title testimonials-title';
  heading.append('Cerita dari ');

  const pill = document.createElement('span');
  pill.className = 'title-pill testimonials-title-pill';
  pill.textContent = 'pelanggan';
  heading.appendChild(pill);

  const controls = document.createElement('div');
  controls.className = 'testimonials-controls';

  const pauseBtn = document.createElement('button');
  pauseBtn.type = 'button';
  pauseBtn.className = 'testimonials-pause-btn';
  pauseBtn.setAttribute('aria-pressed', 'false');

  const pauseBtnIconHost = document.createElement('span');
  pauseBtnIconHost.appendChild(createIcon('pause', { size: 15 }));

  const pauseBtnLabel = document.createElement('span');
  pauseBtnLabel.textContent = 'Jeda guliran';

  pauseBtn.append(pauseBtnIconHost, pauseBtnLabel);
  controls.appendChild(pauseBtn);

  headerContainer.append(eyebrow, heading, controls);

  // 2. Dua baris marquee berlawanan arah.
  const marqueeWrap = document.createElement('div');
  marqueeWrap.className = 'testimonials-marquee';

  let rowOneItems = [];
  let rowTwoItems = [];

  if (validItems.length === 1) {
    rowOneItems = validItems;
    rowTwoItems = reduced ? [] : validItems;
  } else {
    validItems.forEach((item, idx) => {
      if (idx % 2 === 0) {
        rowOneItems.push(item);
      } else {
        rowTwoItems.push(item);
      }
    });
  }

  marqueeWrap.appendChild(
    buildMarqueeRow(rowOneItems, { reverse: false, rowOffset: 0, reduced })
  );

  if (rowTwoItems.length > 0) {
    marqueeWrap.appendChild(
      buildMarqueeRow(rowTwoItems, { reverse: true, rowOffset: 3, reduced })
    );
  }

  section.append(headerContainer, marqueeWrap);

  // Kendali jeda lewat tombol untuk pengguna keyboard maupun sentuh.
  let userPaused = false;
  pauseBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    marqueeWrap.classList.toggle('is-user-paused', userPaused);
    pauseBtn.setAttribute('aria-pressed', String(userPaused));
    pauseBtnIconHost.replaceChildren(createIcon(userPaused ? 'play' : 'pause', { size: 15 }));
    pauseBtnLabel.textContent = userPaused ? 'Jalankan guliran' : 'Jeda guliran';
  });

  // Jeda otomatis saat area marquee disentuh di layar HP atau tablet.
  marqueeWrap.addEventListener(
    'touchstart',
    () => {
      marqueeWrap.classList.add('is-touch-paused');
    },
    { passive: true }
  );

  const releaseTouchPause = () => {
    marqueeWrap.classList.remove('is-touch-paused');
  };

  marqueeWrap.addEventListener('touchend', releaseTouchPause, { passive: true });
  marqueeWrap.addEventListener('touchcancel', releaseTouchPause, { passive: true });

  if (reduced) return;

  // Animasi masuk tenang pada tajuk bagian testimoni.
  gsap.from(headerContainer.children, {
    y: 24,
    opacity: 0,
    duration: 0.65,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      once: true
    }
  });
}