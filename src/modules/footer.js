/*
NAMA: Modul Penutup dan Footer Brumbreo
FUNGSI: Merender bagian penutup berlatar cokelat espresso, status buka/tutup dari jam nyata, kartu lokasi, jam buka, formulir buletin terhubung ke /api/newsletter, tautan sosial, teks raksasa brumbreo. dengan gelas beruang mengintip, serta animasi transisi masuk GSAP.
CARA MENGUBAH: Ubah teks sapaan atau keterangan kartu buletin di dalam fungsi initFooter().
CARA MENAMBAH: Untuk menampilkan kartu lokasi dan jam buka, cukup isi address dan hours di data/business.js tanpa menyentuh file ini.
CARA MENGHAPUS: Jika elemen footer diganti, hapus pemanggilan initFooter() di src/main.js.
*/

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { business } from '../../data/business.js';
import { createBearCup } from '../svg/bearCup.js';
import { createIcon } from '../svg/icons.js';
import { createSteamSvg } from '../svg/steam.js';
import { getOpenStatus } from '../utils/openHours.js';
import { createWhatsappUrl, isWhatsappReady } from '../utils/whatsapp.js';
import { prefersReducedMotion, scrollToTarget } from './smoothScroll.js';

gsap.registerPlugin(ScrollTrigger);

const CLIENT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isSafeExternalUrl(url) {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('mailto:')
  );
}

function buildLocationCard() {
  const address = typeof business.address === 'string' ? business.address.trim() : '';
  if (!address) return null;

  const card = document.createElement('article');
  card.className = 'footer-card';

  const head = document.createElement('div');
  head.className = 'footer-card__head';

  const iconWrap = document.createElement('span');
  iconWrap.className = 'footer-card__icon';
  iconWrap.appendChild(createIcon('pin', { size: 18 }));

  const title = document.createElement('h3');
  title.className = 'footer-card__title';
  title.textContent = 'Lokasi kedai';

  head.append(iconWrap, title);

  const addrText = document.createElement('p');
  addrText.className = 'footer-card__text';
  addrText.textContent = address;

  card.append(head, addrText);

  const note = typeof business.addressNote === 'string' ? business.addressNote.trim() : '';
  if (note) {
    const noteEl = document.createElement('p');
    noteEl.className = 'footer-card__note';
    noteEl.textContent = note;
    card.appendChild(noteEl);
  }

  if (isSafeExternalUrl(business.mapUrl)) {
    const mapLink = document.createElement('a');
    mapLink.className = 'footer-card__link';
    mapLink.href = business.mapUrl.trim();
    mapLink.target = '_blank';
    mapLink.rel = 'noopener noreferrer';
    mapLink.textContent = 'Buka petunjuk peta';
    card.appendChild(mapLink);
  }

  return card;
}

function buildHoursCard() {
  if (!Array.isArray(business.hours) || business.hours.length === 0) {
    return null;
  }

  const validRows = business.hours.filter(
    (item) => item && item.label && item.open && item.close
  );
  if (validRows.length === 0) return null;

  const card = document.createElement('article');
  card.className = 'footer-card';

  const head = document.createElement('div');
  head.className = 'footer-card__head';

  const iconWrap = document.createElement('span');
  iconWrap.className = 'footer-card__icon';
  iconWrap.appendChild(createIcon('clock', { size: 18 }));

  const title = document.createElement('h3');
  title.className = 'footer-card__title';
  title.textContent = 'Jam buka';

  head.append(iconWrap, title);

  const list = document.createElement('ul');
  list.className = 'footer-hours-list';

  validRows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'footer-hours-row';

    const day = document.createElement('span');
    day.className = 'footer-hours-row__day';
    day.textContent = row.label;

    const time = document.createElement('span');
    time.className = 'footer-hours-row__time';
    time.textContent = `${row.open} sampai ${row.close}`;

    li.append(day, time);
    list.appendChild(li);
  });

  card.append(head, list);
  return card;
}

function buildNewsletterCard() {
  const card = document.createElement('article');
  card.className = 'footer-card';

  const head = document.createElement('div');
  head.className = 'footer-card__head';

  const iconWrap = document.createElement('span');
  iconWrap.className = 'footer-card__icon';
  iconWrap.appendChild(createIcon('mail', { size: 18 }));

  const title = document.createElement('h3');
  title.className = 'footer-card__title';
  title.textContent = 'Kabar menu baru';

  head.append(iconWrap, title);

  const desc = document.createElement('p');
  desc.className = 'footer-card__text';
  desc.textContent =
    'Tinggalkan emailmu untuk menerima kabar rasa musiman dan cangkir edisi terbatas dari Brumbreo.';

  const form = document.createElement('form');
  form.className = 'newsletter-form';
  form.noValidate = true;

  // Kolom honeypot anti-bot: tidak terlihat oleh pengguna manusia, tetapi memancing bot otomatis.
  const hpWrap = document.createElement('div');
  hpWrap.className = 'newsletter-hp';
  hpWrap.setAttribute('aria-hidden', 'true');

  const hpLabel = document.createElement('label');
  hpLabel.htmlFor = 'buletin-company';
  hpLabel.textContent = 'Biarkan kolom ini kosong';

  const hpInput = document.createElement('input');
  hpInput.type = 'text';
  hpInput.id = 'buletin-company';
  hpInput.name = 'company';
  hpInput.tabIndex = -1;
  hpInput.autocomplete = 'off';
  hpWrap.append(hpLabel, hpInput);

  const emailLabel = document.createElement('label');
  emailLabel.htmlFor = 'buletin-email';
  emailLabel.className = 'newsletter-label';
  emailLabel.textContent = 'Alamat email';

  const inputGroup = document.createElement('div');
  inputGroup.className = 'newsletter-input-group';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'buletin-email';
  emailInput.name = 'email';
  emailInput.className = 'newsletter-input';
  emailInput.placeholder = 'nama@domain.com';
  emailInput.autocomplete = 'email';
  emailInput.inputMode = 'email';
  emailInput.required = true;
  emailInput.setAttribute('aria-describedby', 'buletin-status');

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn--primary newsletter-submit';
  submitBtn.textContent = 'Daftar buletin';

  const statusText = document.createElement('p');
  statusText.id = 'buletin-status';
  statusText.className = 'newsletter-status';
  statusText.setAttribute('role', 'status');
  statusText.setAttribute('aria-live', 'polite');

  inputGroup.append(emailInput, submitBtn);
  form.append(hpWrap, emailLabel, inputGroup, statusText);

  function setFeedback(kind, message) {
    statusText.className = 'newsletter-status';
    if (kind === 'success') {
      statusText.classList.add('is-success');
    } else if (kind === 'error') {
      statusText.classList.add('is-error');
    }
    statusText.textContent = message;
  }

  emailInput.addEventListener('input', () => {
    if (emailInput.getAttribute('aria-invalid') === 'true') {
      emailInput.removeAttribute('aria-invalid');
      setFeedback('idle', '');
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const emailValue = emailInput.value.trim();
    if (!emailValue) {
      emailInput.setAttribute('aria-invalid', 'true');
      setFeedback('error', 'Masukkan alamat emailmu lebih dulu sebelum mendaftar.');
      emailInput.focus();
      return;
    }

    if (!CLIENT_EMAIL_PATTERN.test(emailValue)) {
      emailInput.setAttribute('aria-invalid', 'true');
      setFeedback('error', 'Format email belum sesuai. Periksa lagi bagian @ dan domainnya.');
      emailInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';
    setFeedback('loading', 'Sedang mencatat alamat emailmu...');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailValue,
          company: hpInput.value
        })
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.ok && data?.ok) {
        emailInput.value = '';
        emailInput.removeAttribute('aria-invalid');
        setFeedback(
          'success',
          data.message || 'Terima kasih, alamat emailmu sudah dicatat untuk kabar menu baru Brumbreo.'
        );
      } else if (response.status === 404) {
        setFeedback(
          'error',
          'Layanan buletin aktif setelah situs dipasang di Vercel atau dijalankan lewat Vercel CLI. Coba kirim ulang nanti.'
        );
      } else {
        setFeedback(
          'error',
          data?.message || 'Pendaftaran belum berhasil. Periksa alamat emailmu lalu coba lagi.'
        );
      }
    } catch {
      setFeedback(
        'error',
        'Koneksi sedang terputus. Periksa jaringan internetmu lalu kirim ulang formulir.'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Daftar buletin';
    }
  });

  card.append(head, desc, form);
  return card;
}

export function initFooter() {
  const footer = document.getElementById('kontak');
  if (!footer) return;

  const reduced = prefersReducedMotion();
  footer.replaceChildren();

  // 1. Lapisan lengkung uap kopi lembut di latar atas footer.
  const steamLayer = document.createElement('div');
  steamLayer.className = 'footer-steam-layer';
  steamLayer.setAttribute('aria-hidden', 'true');
  steamLayer.appendChild(createSteamSvg({ variant: 'footer', className: 'footer-steam-svg' }));

  const inner = document.createElement('div');
  inner.className = 'container footer-inner';

  // 2. Judul sapaan dan status buka nyata (hanya muncul bila jadwal hours sudah diisi).
  const head = document.createElement('div');
  head.className = 'footer-head';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'footer-eyebrow';
  eyebrow.textContent = 'Tetap terhubung';

  const heading = document.createElement('h2');
  heading.className = 'section-title footer-heading';
  heading.append('Mampir dan sapa');

  const pill = document.createElement('span');
  pill.className = 'title-pill title-pill--pink footer-heading__pill';
  pill.textContent = business.brandName;
  heading.appendChild(pill);

  head.append(eyebrow, heading);

  const openStatus = getOpenStatus(business.hours, business.timezone);
  if (openStatus.configured) {
    const statusPill = document.createElement('p');
    statusPill.className = `footer-status ${openStatus.isOpen ? 'is-open' : 'is-closed'}`;

    const icon = createIcon('clock', { size: 15 });
    const label = document.createElement('span');
    label.textContent = openStatus.label;
    statusPill.append(icon, label);

    if (openStatus.detail) {
      const detail = document.createElement('span');
      detail.className = 'footer-status__detail';
      detail.textContent = `(${openStatus.detail})`;
      statusPill.appendChild(detail);
    }

    head.appendChild(statusPill);
  }

  // 3. Tiga kartu (lokasi, jam buka, buletin): hanya kartu dengan data valid yang dirender.
  const cards = [buildLocationCard(), buildHoursCard(), buildNewsletterCard()].filter(Boolean);

  const cardsGrid = document.createElement('div');
  cardsGrid.className = `footer-cards is-count-${cards.length}`;

  cards.forEach((cardEl, idx) => {
    if (cards.length === 3) {
      if (idx === 0) cardEl.classList.add('footer-card--tilt-left');
      if (idx === 1) cardEl.classList.add('footer-card--center');
      if (idx === 2) cardEl.classList.add('footer-card--tilt-right');
    }
    cardsGrid.appendChild(cardEl);
  });

  // 4. Deretan tautan media sosial resmi dan WhatsApp jika terkonfigurasi.
  const socialItems = [];

  if (Array.isArray(business.socials)) {
    business.socials.forEach((item) => {
      if (item && item.name && isSafeExternalUrl(item.url)) {
        socialItems.push({
          name: item.name,
          handle: item.handle || '',
          url: item.url.trim(),
          external: !item.url.trim().startsWith('mailto:')
        });
      }
    });
  }

  if (isWhatsappReady()) {
    const waUrl = createWhatsappUrl(`Halo ${business.brandName}, saya ingin bertanya soal menu.`);
    if (waUrl) {
      socialItems.unshift({
        name: 'WhatsApp',
        handle: 'Chat langsung',
        url: waUrl,
        external: true
      });
    }
  }

  let socialsNav = null;
  if (socialItems.length > 0) {
    socialsNav = document.createElement('nav');
    socialsNav.className = 'footer-socials';
    socialsNav.setAttribute('aria-label', 'Tautan kontak dan media sosial');

    socialItems.forEach((item) => {
      const link = document.createElement('a');
      link.className = 'social-pill';
      link.href = item.url;
      if (item.external) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }

      const nameSpan = document.createElement('span');
      nameSpan.textContent = item.name;
      link.appendChild(nameSpan);

      if (item.handle) {
        const handleSpan = document.createElement('span');
        handleSpan.className = 'social-pill__handle';
        handleSpan.textContent = item.handle;
        link.appendChild(handleSpan);
      }

      socialsNav.appendChild(link);
    });
  }

  // 5. Teks raksasa brumbreo. dengan maskot gelas beruang mengintip dari balik atas huruf.
  const wordmarkStage = document.createElement('div');
  wordmarkStage.className = 'footer-wordmark-stage';

  const peekCupWrap = document.createElement('div');
  peekCupWrap.className = 'footer-peek-cup';

  const peekCupSvg = createBearCup({
    cupColor: '#FFFDF9',
    liquidColor: '#9B6542',
    expression: 'kedip',
    topping: 'tanpa-topping',
    showHandle: true,
    size: 320,
    label: 'Maskot gelas beruang Brumbreo mengintip dari atas nama merek'
  });
  peekCupWrap.appendChild(peekCupSvg);

  const wordmark = document.createElement('p');
  wordmark.className = 'footer-wordmark';
  wordmark.setAttribute('aria-hidden', 'true');
  wordmark.append(business.brandName.toLowerCase());

  const dot = document.createElement('span');
  dot.className = 'footer-wordmark__dot';
  dot.textContent = '.';
  wordmark.appendChild(dot);

  wordmarkStage.append(peekCupWrap, wordmark);

  // 6. Baris hak cipta dan tautan kembali ke puncak halaman.
  const bottomBar = document.createElement('div');
  bottomBar.className = 'footer-bottom';

  const copyright = document.createElement('p');
  const year = Number(business.copyrightYear) || new Date().getFullYear();
  copyright.textContent = `Hak cipta ${year} ${business.brandName}. Seluruh hak dilindungi.`;

  const backToTop = document.createElement('a');
  backToTop.href = '#beranda';
  backToTop.className = 'footer-top-link';
  backToTop.textContent = 'Kembali ke atas';
  backToTop.addEventListener('click', (event) => {
    event.preventDefault();
    scrollToTarget('#beranda');
  });

  bottomBar.append(copyright, backToTop);

  inner.append(head, cardsGrid);
  if (socialsNav) {
    inner.appendChild(socialsNav);
  }
  inner.append(wordmarkStage, bottomBar);
  footer.append(steamLayer, inner);

  if (reduced) return;

  // Transisi dari bagian sebelumnya: konten bagian tepat di atas footer memudar halus saat penutup mengambil alih layar.
  const testimonialsEl = document.getElementById('tentang');
  const prevSection =
    testimonialsEl && !testimonialsEl.hidden
      ? testimonialsEl
      : document.getElementById('racik');

  if (prevSection) {
    gsap.to(prevSection.children, {
      opacity: 0.48,
      y: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: footer,
        start: 'top 76%',
        end: 'top 22%',
        scrub: true
      }
    });
  }

  // Kartu dan tajuk masuk beruntun dengan tenang.
  gsap.from(head.children, {
    y: 24,
    opacity: 0,
    duration: 0.65,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: footer,
      start: 'top 80%',
      once: true
    }
  });

  gsap.from(cards, {
    y: 30,
    opacity: 0,
    duration: 0.65,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: cardsGrid,
      start: 'top 84%',
      once: true
    }
  });

  // Gelas beruang naik perlahan mengintip dari balik teks raksasa brumbreo.
  gsap.fromTo(
    peekCupWrap,
    { yPercent: 48, rotation: -3 },
    {
      yPercent: 0,
      rotation: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: wordmarkStage,
        start: 'top 95%',
        end: 'bottom 92%',
        scrub: 0.7
      }
    }
  );

  // Alunan uap lembut di latar footer.
  steamLayer.querySelectorAll('.steam-strand').forEach((strand, idx) => {
    gsap.to(strand, {
      y: idx % 2 === 0 ? -14 : -20,
      x: idx % 2 === 0 ? 6 : -6,
      duration: 5 + idx * 0.7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });
}