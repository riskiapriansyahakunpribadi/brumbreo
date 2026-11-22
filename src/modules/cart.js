/*
NAMA: Modul Laci Keranjang Belanja
FUNGSI: Mengelola penyimpanan keranjang, menerima penambahan minuman dari parade dan builder, mengubah jumlah, mengosongkan keranjang, menghitung total, dan membuka tautan pesan WhatsApp.
CARA MENGUBAH: Ubah teks keadaan kosong atau label tombol pesan di fungsi renderCart().
CARA MENAMBAH: Untuk mengirim item dari bagian baru, panggil event kustom brumbreo:add-to-cart berisi id, name, note, price, dan quantity.
CARA MENGHAPUS: Jangan dihapus karena terhubung langsung dengan navigasi, parade minuman, dan pembuat cangkir.
*/

import { createIcon } from '../svg/icons.js';
import { formatRupiah } from '../utils/format.js';
import { loadCart, saveCart } from '../utils/storage.js';
import { buildCartWhatsappUrl, isWhatsappReady } from '../utils/whatsapp.js';
import { pauseSmoothScroll, resumeSmoothScroll, scrollToTarget } from './smoothScroll.js';

let cartItems = [];

function emitCartCount() {
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  window.dispatchEvent(
    new CustomEvent('brumbreo:cart-updated', { detail: { totalQuantity } })
  );
}

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hidden && el.offsetParent !== null);
}

export function initCart() {
  const root = document.getElementById('laci-keranjang');
  if (!root) return;

  cartItems = loadCart();
  root.replaceChildren();

  // Pemberitahuan non-visual khusus pembaca layar setiap kali isi keranjang berubah.
  const liveAnnouncer = document.createElement('p');
  liveAnnouncer.className = 'sr-only';
  liveAnnouncer.setAttribute('aria-live', 'polite');

  const backdrop = document.createElement('div');
  backdrop.className = 'cart-backdrop';

  const drawer = document.createElement('aside');
  drawer.className = 'cart-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-labelledby', 'judul-keranjang');
  drawer.hidden = true;

  const header = document.createElement('div');
  header.className = 'cart-header';

  const title = document.createElement('h2');
  title.id = 'judul-keranjang';
  title.className = 'cart-title';
  title.textContent = 'Keranjang';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'cart-close-btn';
  closeBtn.setAttribute('aria-label', 'Tutup keranjang belanja');
  closeBtn.appendChild(createIcon('close', { size: 18 }));

  header.append(title, closeBtn);

  const body = document.createElement('div');
  body.className = 'cart-body';

  const footer = document.createElement('div');
  footer.className = 'cart-footer';
  footer.hidden = true;

  drawer.append(header, body, footer);
  root.append(liveAnnouncer, backdrop, drawer);

  let lastTrigger = null;

  function announce(message) {
    liveAnnouncer.textContent = '';
    requestAnimationFrame(() => {
      liveAnnouncer.textContent = message;
    });
  }

  function persistAndRender() {
    saveCart(cartItems);
    emitCartCount();
    renderCart();
  }

  function addItem(payload) {
    if (!payload || !payload.id || !payload.name) return;

    const existing = cartItems.find((item) => item.id === payload.id);
    const addQty = Math.max(1, Math.floor(Number(payload.quantity) || 1));

    if (existing) {
      existing.quantity = Math.min(99, existing.quantity + addQty);
    } else {
      cartItems.push({
        id: String(payload.id).slice(0, 80),
        name: String(payload.name).slice(0, 100),
        note: payload.note ? String(payload.note).slice(0, 180) : '',
        price: Math.max(0, Math.round(Number(payload.price) || 0)),
        quantity: Math.min(99, addQty)
      });
    }

    persistAndRender();
    announce(`${payload.name} masuk ke keranjang.`);
  }

  function updateQuantity(id, delta) {
    const target = cartItems.find((item) => item.id === id);
    if (!target) return;

    const nextQty = target.quantity + delta;
    if (nextQty <= 0) {
      cartItems = cartItems.filter((item) => item.id !== id);
      announce(`${target.name} dihapus dari keranjang.`);
    } else {
      target.quantity = Math.min(99, nextQty);
      announce(`Jumlah ${target.name} menjadi ${target.quantity}.`);
    }
    persistAndRender();
  }

  function removeItem(id) {
    const target = cartItems.find((item) => item.id === id);
    cartItems = cartItems.filter((item) => item.id !== id);
    persistAndRender();
    if (target) {
      announce(`${target.name} dihapus dari keranjang.`);
    }
  }

  function clearCart() {
    cartItems = [];
    persistAndRender();
    announce('Semua isi keranjang telah dikosongkan.');
  }

  function renderCart() {
    body.replaceChildren();
    footer.replaceChildren();

    if (cartItems.length === 0) {
      footer.hidden = true;

      const empty = document.createElement('div');
      empty.className = 'cart-empty';

      const heading = document.createElement('p');
      heading.className = 'cart-empty__title';
      heading.textContent = 'Keranjangmu masih kosong';

      const desc = document.createElement('p');
      desc.className = 'cart-empty__desc';
      desc.textContent =
        'Pilih minuman dari parade menu atau racik cangkirmu sendiri untuk mulai memesan.';

      const goMenuBtn = document.createElement('button');
      goMenuBtn.type = 'button';
      goMenuBtn.className = 'btn btn--dark';
      goMenuBtn.textContent = 'Lihat parade minuman';
      goMenuBtn.addEventListener('click', () => {
        closeDrawer();
        scrollToTarget('#menu');
      });

      empty.append(heading, desc, goMenuBtn);
      body.appendChild(empty);
      return;
    }

    const list = document.createElement('ul');
    list.className = 'cart-list';

    let grandTotal = 0;

    cartItems.forEach((item) => {
      const subtotal = item.price * item.quantity;
      grandTotal += subtotal;

      const li = document.createElement('li');
      li.className = 'cart-item';

      const top = document.createElement('div');
      top.className = 'cart-item__top';

      const info = document.createElement('div');
      const nameEl = document.createElement('p');
      nameEl.className = 'cart-item__name';
      nameEl.textContent = item.name;
      info.appendChild(nameEl);

      if (item.note) {
        const noteEl = document.createElement('p');
        noteEl.className = 'cart-item__note';
        noteEl.textContent = item.note;
        info.appendChild(noteEl);
      }

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'cart-item__remove';
      removeBtn.setAttribute('aria-label', `Hapus ${item.name} dari keranjang`);
      removeBtn.appendChild(createIcon('trash', { size: 17 }));
      removeBtn.addEventListener('click', () => removeItem(item.id));

      top.append(info, removeBtn);

      const bottom = document.createElement('div');
      bottom.className = 'cart-item__bottom';

      const qtyBox = document.createElement('div');
      qtyBox.className = 'cart-qty';

      const decBtn = document.createElement('button');
      decBtn.type = 'button';
      decBtn.className = 'cart-qty__btn';
      decBtn.setAttribute('aria-label', `Kurangi jumlah ${item.name}`);
      decBtn.appendChild(createIcon('minus', { size: 15 }));
      decBtn.addEventListener('click', () => updateQuantity(item.id, -1));

      const qtyVal = document.createElement('span');
      qtyVal.className = 'cart-qty__value';
      qtyVal.textContent = String(item.quantity);

      const incBtn = document.createElement('button');
      incBtn.type = 'button';
      incBtn.className = 'cart-qty__btn';
      incBtn.setAttribute('aria-label', `Tambah jumlah ${item.name}`);
      incBtn.appendChild(createIcon('plus', { size: 15 }));
      incBtn.addEventListener('click', () => updateQuantity(item.id, 1));

      qtyBox.append(decBtn, qtyVal, incBtn);

      const subEl = document.createElement('p');
      subEl.className = 'cart-item__subtotal';
      subEl.textContent = formatRupiah(subtotal);

      bottom.append(qtyBox, subEl);
      li.append(top, bottom);
      list.appendChild(li);
    });

    body.appendChild(list);

    footer.hidden = false;

    const totalRow = document.createElement('div');
    totalRow.className = 'cart-total-row';

    const totalLabel = document.createElement('span');
    totalLabel.className = 'cart-total-label';
    totalLabel.textContent = 'Total pesanan';

    const totalAmount = document.createElement('span');
    totalAmount.className = 'cart-total-amount';
    totalAmount.textContent = formatRupiah(grandTotal);

    totalRow.append(totalLabel, totalAmount);
    footer.appendChild(totalRow);

    if (isWhatsappReady()) {
      const waLink = document.createElement('a');
      waLink.className = 'btn btn--primary cart-checkout-btn';
      waLink.href = buildCartWhatsappUrl(cartItems) || '#kontak';
      waLink.target = '_blank';
      waLink.rel = 'noopener noreferrer';
      waLink.textContent = 'Pesan lewat WhatsApp';
      footer.appendChild(waLink);
    } else {
      const notice = document.createElement('p');
      notice.className = 'cart-wa-notice';
      notice.textContent =
        'Pemesanan WhatsApp belum aktif saat ini. Silakan pesan langsung di meja kasir.';
      footer.appendChild(notice);
    }

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'cart-clear-btn';
    clearBtn.textContent = 'Kosongkan keranjang';
    clearBtn.addEventListener('click', clearCart);
    footer.appendChild(clearBtn);
  }

  function openDrawer(triggerEl) {
    lastTrigger = triggerEl || document.activeElement;
    renderCart();
    drawer.hidden = false;
    requestAnimationFrame(() => {
      root.classList.add('is-open');
    });
    pauseSmoothScroll();
    closeBtn.focus();
  }

  function closeDrawer() {
    root.classList.remove('is-open');
    resumeSmoothScroll();
    window.setTimeout(() => {
      if (!root.classList.contains('is-open')) {
        drawer.hidden = true;
      }
    }, 320);

    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
  }

  closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Jaga navigasi Tab tetap di dalam laci saat terbuka dan tutup dengan tombol Escape.
  document.addEventListener('keydown', (event) => {
    if (!root.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeDrawer();
      return;
    }

    if (event.key === 'Tab') {
      const focusables = getFocusableElements(drawer);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener('brumbreo:open-cart', (event) => {
    openDrawer(event.detail?.trigger);
  });

  window.addEventListener('brumbreo:add-to-cart', (event) => {
    addItem(event.detail);
  });

  emitCartCount();
}