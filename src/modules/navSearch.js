/*
NAMA: Modul Navigasi dan Pencarian Minuman
FUNGSI: Merender bilah navigasi, menu responsif HP, pencarian minuman aktif yang melompat ke parade, offset aman terhadap header tetap, dan tombol pembuka laci keranjang.
CARA MENGUBAH: Sesuaikan daftar tautan navigasi di fungsi getNavItems() atau teks ajakan pencarian di dalam initNavSearch().
CARA MENAMBAH: Item minuman baru di data/menu.js otomatis terbaca di pencarian tanpa mengubah file ini.
CARA MENGHAPUS: Jangan dihapus karena menyambungkan navigasi, pencarian, dan keranjang.
*/

import { menuItems } from '../../data/menu.js';
import { createIcon } from '../svg/icons.js';
import { formatRupiah } from '../utils/format.js';
import { scrollToTarget } from './smoothScroll.js';
import { getValidTestimonials } from './testimonials.js';

function getNavItems() {
  const items = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Menu', href: '#menu' },
    { label: 'Racik', href: '#racik' }
  ];

  // Tautan Tentang hanya tampil jika minimal satu testimoni asli yang valid sudah diisi.
  if (getValidTestimonials().length > 0) {
    items.push({ label: 'Tentang', href: '#tentang' });
  }

  items.push({ label: 'Kontak', href: '#kontak' });
  return items;
}

function matchDrinks(query) {
  const clean = query.trim().toLowerCase();
  if (!clean) return menuItems;

  return menuItems.filter((item) => {
    const haystack = [
      item.name,
      item.tag,
      item.description,
      ...(Array.isArray(item.keywords) ? item.keywords : [])
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(clean);
  });
}

export function initNavSearch() {
  const header = document.getElementById('situs-header');
  if (!header) return;

  const navItems = getNavItems();
  header.replaceChildren();

  const container = document.createElement('div');
  container.className = 'container';

  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('aria-label', 'Navigasi utama');

  // 1. Logo dua baris di sisi kiri.
  const logoLink = document.createElement('a');
  logoLink.href = '#beranda';
  logoLink.className = 'brand-logo';
  logoLink.setAttribute('aria-label', 'Brumbreo, kembali ke beranda');

  const logoTop = document.createElement('span');
  logoTop.textContent = 'brum';
  const logoSub = document.createElement('span');
  logoSub.className = 'brand-logo__sub';
  logoSub.textContent = 'breo.';
  logoLink.append(logoTop, logoSub);

  // 2. Daftar tautan tengah untuk desktop.
  const desktopList = document.createElement('ul');
  desktopList.className = 'nav-links';

  for (const item of navItems) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.href;
    a.className = 'nav-link';
    a.textContent = item.label;
    li.appendChild(a);
    desktopList.appendChild(li);
  }

  // 3. Kelompok aksi kanan: pencarian, tombol keranjang, dan tombol menu HP.
  const actions = document.createElement('div');
  actions.className = 'nav-actions';

  const searchWrap = document.createElement('div');
  searchWrap.className = 'nav-search';
  searchWrap.setAttribute('role', 'search');

  const mobileSearchBtn = document.createElement('button');
  mobileSearchBtn.type = 'button';
  mobileSearchBtn.className = 'nav-icon-btn nav-search-toggle';
  mobileSearchBtn.setAttribute('aria-label', 'Buka pencarian minuman');
  mobileSearchBtn.setAttribute('aria-expanded', 'false');
  mobileSearchBtn.appendChild(createIcon('search', { size: 19 }));

  const searchField = document.createElement('div');
  searchField.className = 'search-field';

  const searchLabel = document.createElement('label');
  searchLabel.htmlFor = 'cari-minuman';
  searchLabel.className = 'sr-only';
  searchLabel.textContent = 'Cari minuman Brumbreo';

  const searchIcon = createIcon('search', { size: 18, className: 'search-field__icon' });

  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.id = 'cari-minuman';
  searchInput.className = 'search-field__input';
  searchInput.placeholder = 'Cari minuman...';
  searchInput.autocomplete = 'off';
  searchInput.setAttribute('aria-controls', 'panel-hasil-cari');
  searchInput.setAttribute('aria-expanded', 'false');

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'search-field__clear';
  clearBtn.setAttribute('aria-label', 'Bersihkan pencarian');
  clearBtn.hidden = true;
  clearBtn.appendChild(createIcon('close', { size: 16 }));

  searchField.append(searchLabel, searchIcon, searchInput, clearBtn);

  const searchPanel = document.createElement('div');
  searchPanel.id = 'panel-hasil-cari';
  searchPanel.className = 'search-panel';
  searchPanel.hidden = true;

  searchWrap.append(mobileSearchBtn, searchField, searchPanel);

  // Tombol keranjang belanja.
  const cartBtn = document.createElement('button');
  cartBtn.type = 'button';
  cartBtn.className = 'nav-icon-btn nav-cart-btn';
  cartBtn.setAttribute('aria-label', 'Buka keranjang belanja');
  cartBtn.appendChild(createIcon('cart', { size: 19 }));

  const cartBadge = document.createElement('span');
  cartBadge.className = 'nav-cart-badge';
  cartBadge.hidden = true;
  cartBadge.textContent = '0';
  cartBtn.appendChild(cartBadge);

  // Tombol menu khusus tablet dan HP.
  const menuToggleBtn = document.createElement('button');
  menuToggleBtn.type = 'button';
  menuToggleBtn.className = 'nav-icon-btn nav-menu-toggle';
  menuToggleBtn.setAttribute('aria-label', 'Buka menu navigasi');
  menuToggleBtn.setAttribute('aria-expanded', 'false');
  menuToggleBtn.setAttribute('aria-controls', 'nav-mobile-panel');
  menuToggleBtn.appendChild(createIcon('menu', { size: 19 }));

  actions.append(searchWrap, cartBtn, menuToggleBtn);
  nav.append(logoLink, desktopList, actions);

  // Panel menu HP.
  const mobilePanel = document.createElement('div');
  mobilePanel.id = 'nav-mobile-panel';
  mobilePanel.className = 'mobile-nav-panel';
  mobilePanel.hidden = true;

  const mobileList = document.createElement('ul');
  mobileList.className = 'mobile-nav-list';
  for (const item of navItems) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.href;
    a.className = 'mobile-nav-link';
    a.textContent = item.label;
    li.appendChild(a);
    mobileList.appendChild(li);
  }
  mobilePanel.appendChild(mobileList);

  container.append(nav, mobilePanel);
  header.appendChild(container);

  let activeResultIndex = -1;
  let currentMatches = [];

  function closeMobileMenu() {
    mobilePanel.hidden = true;
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    menuToggleBtn.setAttribute('aria-label', 'Buka menu navigasi');
  }

  function openMobileMenu() {
    closeSearchPanel();
    mobilePanel.hidden = false;
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    menuToggleBtn.setAttribute('aria-label', 'Tutup menu navigasi');
  }

  function closeSearchPanel() {
    searchPanel.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
    searchWrap.classList.remove('is-mobile-open');
    mobileSearchBtn.setAttribute('aria-expanded', 'false');
    activeResultIndex = -1;
  }

  function jumpToDrink(drink) {
    const index = menuItems.findIndex((item) => item.id === drink.id);
    closeSearchPanel();
    closeMobileMenu();

    const jumpEvent = new CustomEvent('brumbreo:select-drink', {
      cancelable: true,
      detail: { id: drink.id, index }
    });
    const handledByParade = !window.dispatchEvent(jumpEvent);

    if (!handledByParade) {
      scrollToTarget('#menu');
    }
  }

  function renderSearchResults(query) {
    searchPanel.replaceChildren();
    currentMatches = matchDrinks(query);
    activeResultIndex = -1;

    const heading = document.createElement('p');
    heading.className = 'search-panel__heading';
    heading.textContent = query.trim()
      ? `Hasil untuk "${query.trim()}"`
      : 'Pilih minuman untuk langsung menuju menu';
    searchPanel.appendChild(heading);

    if (currentMatches.length === 0) {
      const emptyBox = document.createElement('div');
      emptyBox.className = 'search-empty';

      const msg = document.createElement('p');
      msg.textContent =
        'Minuman yang dicari belum ditemukan. Coba kata kunci lain seperti madu, stroberi, taro, atau matcha.';

      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'search-empty__reset';
      resetBtn.textContent = 'Tampilkan semua minuman';
      resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.hidden = true;
        renderSearchResults('');
        searchInput.focus();
      });

      emptyBox.append(msg, resetBtn);
      searchPanel.appendChild(emptyBox);
      return;
    }

    const list = document.createElement('ul');
    list.className = 'search-results';

    currentMatches.forEach((drink, idx) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'search-result-btn';
      btn.dataset.index = String(idx);

      const main = document.createElement('span');
      main.className = 'search-result-btn__main';

      const swatch = document.createElement('span');
      swatch.className = 'search-result-btn__swatch';
      swatch.style.backgroundColor = drink.bgColor;

      const textWrap = document.createElement('span');
      textWrap.className = 'search-result-btn__text';

      const name = document.createElement('span');
      name.className = 'search-result-btn__name';
      name.textContent = drink.name;

      const tag = document.createElement('span');
      tag.className = 'search-result-btn__tag';
      tag.textContent = drink.tag;

      textWrap.append(name, tag);
      main.append(swatch, textWrap);

      const price = document.createElement('span');
      price.className = 'search-result-btn__price';
      price.textContent = formatRupiah(drink.price);

      btn.append(main, price);
      btn.addEventListener('click', () => jumpToDrink(drink));
      li.appendChild(btn);
      list.appendChild(li);
    });

    searchPanel.appendChild(list);
  }

  function highlightActiveResult() {
    const buttons = searchPanel.querySelectorAll('.search-result-btn');
    buttons.forEach((btn, idx) => {
      const active = idx === activeResultIndex;
      btn.classList.toggle('is-active', active);
      if (active) {
        btn.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  function openSearchPanel() {
    closeMobileMenu();
    renderSearchResults(searchInput.value);
    searchPanel.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
  }

  searchInput.addEventListener('focus', openSearchPanel);
  searchInput.addEventListener('input', () => {
    clearBtn.hidden = searchInput.value.length === 0;
    openSearchPanel();
  });

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSearchPanel();
      searchInput.blur();
      return;
    }

    if (searchPanel.hidden || currentMatches.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeResultIndex = (activeResultIndex + 1) % currentMatches.length;
      highlightActiveResult();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeResultIndex = (activeResultIndex - 1 + currentMatches.length) % currentMatches.length;
      highlightActiveResult();
    } else if (event.key === 'Enter' && activeResultIndex >= 0) {
      event.preventDefault();
      jumpToDrink(currentMatches[activeResultIndex]);
    }
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.hidden = true;
    renderSearchResults('');
    searchInput.focus();
  });

  mobileSearchBtn.addEventListener('click', () => {
    const isOpen = searchWrap.classList.contains('is-mobile-open');
    if (isOpen) {
      closeSearchPanel();
    } else {
      closeMobileMenu();
      searchWrap.classList.add('is-mobile-open');
      mobileSearchBtn.setAttribute('aria-expanded', 'true');
      openSearchPanel();
      searchInput.focus();
    }
  });

  menuToggleBtn.addEventListener('click', () => {
    if (mobilePanel.hidden) {
      openMobileMenu();
    } else {
      closeMobileMenu();
    }
  });

  // Navigasi halus dengan offset aman agar bilah navigasi tetap tidak menutupi judul bagian tujuan.
  header.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const targetSelector = link.getAttribute('href');
    if (!targetSelector || targetSelector === '#') return;

    event.preventDefault();
    closeMobileMenu();
    closeSearchPanel();

    const needsHeaderOffset = targetSelector !== '#beranda' && targetSelector !== '#menu';
    scrollToTarget(targetSelector, { offset: needsHeaderOffset ? -72 : 0 });
  });

  cartBtn.addEventListener('click', () => {
    closeMobileMenu();
    closeSearchPanel();
    window.dispatchEvent(new CustomEvent('brumbreo:open-cart', { detail: { trigger: cartBtn } }));
  });

  window.addEventListener('brumbreo:cart-updated', (event) => {
    const totalQty = Number(event.detail?.totalQuantity || 0);
    cartBadge.textContent = totalQty > 99 ? '99+' : String(totalQty);
    cartBadge.hidden = totalQty <= 0;
    cartBtn.setAttribute(
      'aria-label',
      totalQty > 0 ? `Buka keranjang belanja, ${totalQty} item` : 'Buka keranjang belanja'
    );
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) {
      closeSearchPanel();
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (!mobilePanel.hidden) {
        closeMobileMenu();
        menuToggleBtn.focus();
      } else if (!searchPanel.hidden) {
        closeSearchPanel();
      }
    }
  });

  function syncScrollState() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  syncScrollState();
  window.addEventListener('scroll', syncScrollState, { passive: true });
}