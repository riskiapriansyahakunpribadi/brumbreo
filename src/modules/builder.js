/*
NAMA: Modul Pembuat Cangkir (Builder)
FUNGSI: Merender panggung pratinjau gelas beruang dan empat langkah pilihan dari data/builder.js, memperbarui SVG dan harga secara langsung dengan animasi singkat, serta mengirim pesanan ke WhatsApp atau keranjang.
CARA MENGUBAH: Ubah tulisan judul langkah atau label tombol di fungsi initBuilder().
CARA MENAMBAH: Tambahkan opsi warna, minuman, ekspresi, atau topping di data/builder.js; tombol baru akan otomatis muncul.
CARA MENGHAPUS: Jika bagian pembuat cangkir dilepas, hapus pemanggilan initBuilder() di src/main.js.
*/

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { builderConfig } from '../../data/builder.js';
import { createBearCup, updateBearCup } from '../svg/bearCup.js';
import {
  createExpressionIcon,
  createIcon,
  createToppingIcon
} from '../svg/icons.js';
import { formatExtraPrice, formatRupiah } from '../utils/format.js';
import { buildCustomCupWhatsappUrl, isWhatsappReady } from '../utils/whatsapp.js';
import { prefersReducedMotion } from './smoothScroll.js';

gsap.registerPlugin(ScrollTrigger);

function findOption(list, id) {
  return list.find((item) => item.id === id) || list[0];
}

export function initBuilder() {
  const section = document.getElementById('racik');
  if (!section) return;

  section.replaceChildren();

  const { basePrice, defaults, cupColors, drinks, expressions, toppings } = builderConfig;
  const reduced = prefersReducedMotion();

  const state = {
    cupColor: findOption(cupColors, defaults.cupColor),
    drink: findOption(drinks, defaults.drink),
    expression: findOption(expressions, defaults.expression),
    topping: findOption(toppings, defaults.topping)
  };

  function calculateTotal() {
    return (
      basePrice +
      Number(state.cupColor.extraPrice || 0) +
      Number(state.drink.extraPrice || 0) +
      Number(state.expression.extraPrice || 0) +
      Number(state.topping.extraPrice || 0)
    );
  }

  const container = document.createElement('div');
  container.className = 'container';

  // 1. Tajuk bagian builder di tengah atas.
  const header = document.createElement('div');
  header.className = 'builder-header';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'builder-eyebrow';
  eyebrow.textContent = 'Racik sesuai seleramu';

  const heading = document.createElement('h2');
  heading.className = 'section-title builder-title';
  heading.append('Rancang ');

  const pill = document.createElement('span');
  pill.className = 'title-pill title-pill--pink builder-title__pill';
  pill.textContent = 'cangkir';
  heading.appendChild(pill);
  heading.append(' beruangmu');

  const lead = document.createElement('p');
  lead.className = 'builder-lead';
  lead.textContent =
    'Pilih warna gelas, isi minuman, ekspresi wajah, dan topping dalam empat langkah singkat.';

  header.append(eyebrow, heading, lead);

  // 2. Tata letak dua kolom: pratinjau gelas di kiri, empat langkah di kanan.
  const grid = document.createElement('div');
  grid.className = 'builder-grid';

  const previewCol = document.createElement('div');
  previewCol.className = 'builder-preview-col';

  const circleStage = document.createElement('div');
  circleStage.className = 'builder-stage-circle';

  const cupHost = document.createElement('div');
  cupHost.className = 'builder-cup-host';

  const cupSvg = createBearCup({
    cupColor: state.cupColor.hex,
    liquidColor: state.drink.liquidHex,
    expression: state.expression.id,
    topping: state.topping.id,
    showHandle: true,
    size: 420,
    label: 'Pratinjau cangkir beruang hasil racikanmu'
  });
  cupHost.appendChild(cupSvg);
  circleStage.appendChild(cupHost);

  const previewMeta = document.createElement('div');
  previewMeta.className = 'builder-preview-meta';
  previewMeta.setAttribute('aria-live', 'polite');

  const metaTitle = document.createElement('p');
  metaTitle.className = 'builder-preview-meta__title';

  const metaSpec = document.createElement('p');
  metaSpec.className = 'builder-preview-meta__spec';

  previewMeta.append(metaTitle, metaSpec);
  previewCol.append(circleStage, previewMeta);

  // Kolom kanan: empat langkah pilihan.
  const controls = document.createElement('div');
  controls.className = 'builder-controls';

  const activeLabels = {};
  const optionButtons = {
    cupColor: new Map(),
    drink: new Map(),
    expression: new Map(),
    topping: new Map()
  };

  function createStepShell(stepKey, titleText, initialLabel) {
    const fieldset = document.createElement('div');
    fieldset.className = 'builder-step';
    fieldset.setAttribute('role', 'group');
    fieldset.setAttribute('aria-labelledby', `builder-step-${stepKey}`);

    const head = document.createElement('div');
    head.className = 'builder-step__head';

    const title = document.createElement('h3');
    title.id = `builder-step-${stepKey}`;
    title.className = 'builder-step__label';
    title.textContent = titleText;

    const active = document.createElement('span');
    active.className = 'builder-step__active';
    active.textContent = initialLabel;
    activeLabels[stepKey] = active;

    head.append(title, active);
    fieldset.appendChild(head);
    return fieldset;
  }

  // Elemen harga dan tombol pesan yang diperbarui tiap ada pilihan baru.
  const checkoutBox = document.createElement('div');
  checkoutBox.className = 'builder-checkout';

  const priceRow = document.createElement('div');
  priceRow.className = 'builder-price-row';

  const priceLabel = document.createElement('span');
  priceLabel.className = 'builder-price-label';
  priceLabel.textContent = 'Total cangkir racikan';

  const priceValue = document.createElement('p');
  priceValue.className = 'builder-price-value';
  priceValue.setAttribute('aria-live', 'polite');

  priceRow.append(priceLabel, priceValue);

  const actionsRow = document.createElement('div');
  actionsRow.className = 'builder-actions';

  const waOrderBtn = document.createElement('a');
  waOrderBtn.className = 'btn btn--primary builder-wa-btn';
  waOrderBtn.target = '_blank';
  waOrderBtn.rel = 'noopener noreferrer';
  waOrderBtn.textContent = 'Pesan cangkir ini lewat WhatsApp';

  const addToCartBtn = document.createElement('button');
  addToCartBtn.type = 'button';
  addToCartBtn.className = 'btn builder-cart-btn';

  const cartPlusIcon = createIcon('plus', { size: 16 });
  const cartBtnLabel = document.createElement('span');
  cartBtnLabel.textContent = 'Masukkan ke keranjang';
  addToCartBtn.append(cartPlusIcon, cartBtnLabel);

  const feedbackText = document.createElement('p');
  feedbackText.className = 'builder-feedback';
  feedbackText.setAttribute('aria-live', 'polite');

  if (isWhatsappReady()) {
    actionsRow.append(waOrderBtn, addToCartBtn);
  } else {
    actionsRow.append(addToCartBtn);
    feedbackText.textContent =
      'Tambahkan racikan ke keranjang terlebih dulu untuk melihat ringkasan pesanan.';
  }

  checkoutBox.append(priceRow, actionsRow, feedbackText);

  function animatePreviewChange(changedKey) {
    if (reduced) return;

    gsap.fromTo(
      cupHost,
      { scale: 0.94, rotation: changedKey === 'cupColor' ? -3 : 2.2 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.42,
        ease: 'back.out(1.9)',
        overwrite: 'auto'
      }
    );

    const partMap = {
      cupColor: '[data-part="ears"]',
      drink: '[data-part="liquid"]',
      expression: '[data-part="face"]',
      topping: '[data-part="topping"]'
    };

    const partNode = cupSvg.querySelector(partMap[changedKey]);
    if (partNode) {
      gsap.fromTo(
        partNode,
        { opacity: 0.35, y: -5 },
        { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out', overwrite: 'auto' }
      );
    }

    gsap.fromTo(
      priceValue,
      { scale: 1.07 },
      { scale: 1, duration: 0.26, ease: 'power2.out', overwrite: 'auto' }
    );
  }

  function syncUI(changedKey) {
    const totalPrice = calculateTotal();

    updateBearCup(cupSvg, {
      cupColor: state.cupColor.hex,
      liquidColor: state.drink.liquidHex,
      expression: state.expression.id,
      topping: state.topping.id
    });

    cupSvg.setAttribute(
      'aria-label',
      `Pratinjau cangkir beruang warna ${state.cupColor.label}, minuman ${state.drink.label}, ekspresi ${state.expression.label}, topping ${state.topping.label}`
    );

    activeLabels.cupColor.textContent = state.cupColor.label;
    activeLabels.drink.textContent = state.drink.label;
    activeLabels.expression.textContent = state.expression.label;
    activeLabels.topping.textContent = state.topping.label;

    metaTitle.textContent = `${state.drink.label} (${state.cupColor.label})`;
    metaSpec.textContent = `Ekspresi ${state.expression.label}, ${state.topping.label}`;

    priceValue.textContent = formatRupiah(totalPrice);

    // Perbarui status tombol terpilih pada seluruh langkah.
    for (const [key, map] of Object.entries(optionButtons)) {
      const activeId = state[key].id;
      map.forEach((btn, id) => {
        const selected = id === activeId;
        btn.classList.toggle('is-selected', selected);
        btn.setAttribute('aria-pressed', String(selected));
      });
    }

    if (isWhatsappReady()) {
      const waHref = buildCustomCupWhatsappUrl({
        cupColorLabel: state.cupColor.label,
        drinkLabel: state.drink.label,
        expressionLabel: state.expression.label,
        toppingLabel: state.topping.label,
        totalPrice
      });
      if (waHref) {
        waOrderBtn.href = waHref;
      }
    }

    if (changedKey) {
      animatePreviewChange(changedKey);
    }
  }

  // Langkah 1: Warna Gelas.
  const stepColor = createStepShell('cupColor', '1. Warna gelas', state.cupColor.label);
  const swatchList = document.createElement('div');
  swatchList.className = 'builder-swatches';

  cupColors.forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'swatch-btn';
    btn.setAttribute('aria-label', `Pilih warna gelas ${opt.label}`);
    btn.setAttribute('aria-pressed', String(opt.id === state.cupColor.id));

    const dot = document.createElement('span');
    dot.className = 'swatch-btn__dot';
    dot.style.backgroundColor = opt.hex;

    const checkIcon = createIcon('check', { size: 15, strokeWidth: 2.8 });
    checkIcon.style.opacity = '0';
    checkIcon.dataset.swatchCheck = 'true';
    dot.appendChild(checkIcon);

    btn.appendChild(dot);
    btn.addEventListener('click', () => {
      if (state.cupColor.id === opt.id) return;
      state.cupColor = opt;
      syncUI('cupColor');
      syncSwatchChecks();
    });

    optionButtons.cupColor.set(opt.id, btn);
    swatchList.appendChild(btn);
  });

  function syncSwatchChecks() {
    optionButtons.cupColor.forEach((btn, id) => {
      const icon = btn.querySelector('[data-swatch-check="true"]');
      if (icon) {
        icon.style.opacity = id === state.cupColor.id ? '1' : '0';
      }
    });
  }

  stepColor.appendChild(swatchList);

  // Langkah 2: Minuman.
  const stepDrink = createStepShell('drink', '2. Pilih minuman', state.drink.label);
  const drinkList = document.createElement('div');
  drinkList.className = 'builder-chips';

  drinks.forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn';
    btn.setAttribute('aria-pressed', String(opt.id === state.drink.id));

    const dot = document.createElement('span');
    dot.className = 'choice-btn__dot';
    dot.style.backgroundColor = opt.liquidHex;

    const label = document.createElement('span');
    label.textContent = opt.label;
    btn.append(dot, label);

    if (opt.extraPrice > 0) {
      const extra = document.createElement('span');
      extra.className = 'choice-btn__extra';
      extra.textContent = formatExtraPrice(opt.extraPrice);
      btn.appendChild(extra);
    }

    btn.addEventListener('click', () => {
      if (state.drink.id === opt.id) return;
      state.drink = opt;
      syncUI('drink');
    });

    optionButtons.drink.set(opt.id, btn);
    drinkList.appendChild(btn);
  });
  stepDrink.appendChild(drinkList);

  // Langkah 3: Ekspresi Wajah Beruang (SVG, bukan teks kaomoji).
  const stepExpr = createStepShell('expression', '3. Ekspresi wajah beruang', state.expression.label);
  const exprList = document.createElement('div');
  exprList.className = 'builder-chips';

  expressions.forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn';
    btn.setAttribute('aria-pressed', String(opt.id === state.expression.id));

    const icon = createExpressionIcon(opt.id, 28);
    const label = document.createElement('span');
    label.textContent = opt.label;

    btn.append(icon, label);
    btn.addEventListener('click', () => {
      if (state.expression.id === opt.id) return;
      state.expression = opt;
      syncUI('expression');
    });

    optionButtons.expression.set(opt.id, btn);
    exprList.appendChild(btn);
  });
  stepExpr.appendChild(exprList);

  // Langkah 4: Topping (SVG buatan sendiri).
  const stepTopping = createStepShell('topping', '4. Pilih topping', state.topping.label);
  const toppingList = document.createElement('div');
  toppingList.className = 'builder-chips';

  toppings.forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn';
    btn.setAttribute('aria-pressed', String(opt.id === state.topping.id));

    const icon = createToppingIcon(opt.id, 26);
    const label = document.createElement('span');
    label.textContent = opt.label;
    btn.append(icon, label);

    if (opt.extraPrice > 0) {
      const extra = document.createElement('span');
      extra.className = 'choice-btn__extra';
      extra.textContent = formatExtraPrice(opt.extraPrice);
      btn.appendChild(extra);
    }

    btn.addEventListener('click', () => {
      if (state.topping.id === opt.id) return;
      state.topping = opt;
      syncUI('topping');
    });

    optionButtons.topping.set(opt.id, btn);
    toppingList.appendChild(btn);
  });
  stepTopping.appendChild(toppingList);

  // Aksi tambah cangkir racikan ke keranjang dengan ID unik per kombinasi.
  let cartTimer = null;
  addToCartBtn.addEventListener('click', () => {
    const customId = `racik-${state.cupColor.id}-${state.drink.id}-${state.expression.id}-${state.topping.id}`;
    const note = `Gelas ${state.cupColor.label}, ekspresi ${state.expression.label}, ${state.topping.label}`;

    window.dispatchEvent(
      new CustomEvent('brumbreo:add-to-cart', {
        detail: {
          id: customId,
          name: `Racikan ${state.drink.label}`,
          note,
          price: calculateTotal(),
          quantity: 1
        }
      })
    );

    addToCartBtn.classList.add('is-added');
    cartBtnLabel.textContent = 'Masuk keranjang';
    feedbackText.textContent = 'Cangkir racikanmu sudah tersimpan di keranjang belanja.';

    window.clearTimeout(cartTimer);
    cartTimer = window.setTimeout(() => {
      addToCartBtn.classList.remove('is-added');
      cartBtnLabel.textContent = 'Masukkan ke keranjang';
    }, 1500);
  });

  controls.append(stepColor, stepDrink, stepExpr, stepTopping, checkoutBox);
  grid.append(previewCol, controls);
  container.append(header, grid);
  section.appendChild(container);

  syncUI();
  syncSwatchChecks();

  if (reduced) return;

  // Animasi masuk bagian builder yang tenang dan hanya menyentuh transform serta opacity.
  gsap.from(header.children, {
    y: 26,
    opacity: 0,
    duration: 0.65,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 78%',
      once: true
    }
  });

  gsap.from(circleStage, {
    scale: 0.9,
    opacity: 0,
    duration: 0.72,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: grid,
      start: 'top 78%',
      once: true
    }
  });

  gsap.from(controls.children, {
    y: 22,
    opacity: 0,
    duration: 0.55,
    stagger: 0.07,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: controls,
      start: 'top 80%',
      once: true
    }
  });
}