/*
NAMA: Kumpulan Ikon SVG Antarmuka, Ekspresi, dan Topping
FUNGSI: Menghasilkan ikon vektor ringan, ikon ekspresi wajah beruang dengan garis tepi tegas di tombol gelap maupun terang, ikon topping builder, dan ikon kendali putar/jeda tanpa pustaka eksternal.
CARA MENGUBAH: Sesuaikan path atau atribut warna di ICON_SHAPES, createExpressionIcon(), atau createToppingIcon().
CARA MENAMBAH: Tambahkan entri ikon baru di ICON_SHAPES atau cabang baru untuk ekspresi dan topping baru dari data/builder.js.
CARA MENGHAPUS: Hapus entri ikon yang sudah tidak dipanggil oleh modul mana pun.
*/

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs = {}, children = []) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, String(value));
  }
  for (const child of children) {
    if (child) el.appendChild(child);
  }
  return el;
}

const ICON_SHAPES = {
  search: [
    { tag: 'circle', attrs: { cx: 11, cy: 11, r: 7 } },
    { tag: 'path', attrs: { d: 'M16.5 16.5L21 21' } }
  ],
  cart: [
    { tag: 'path', attrs: { d: 'M6 7h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7Z' } },
    { tag: 'path', attrs: { d: 'M9 7V6a3 3 0 0 1 6 0v1' } }
  ],
  close: [
    { tag: 'path', attrs: { d: 'M6 6l12 12' } },
    { tag: 'path', attrs: { d: 'M18 6L6 18' } }
  ],
  menu: [
    { tag: 'path', attrs: { d: 'M4 8h16' } },
    { tag: 'path', attrs: { d: 'M4 16h16' } }
  ],
  plus: [
    { tag: 'path', attrs: { d: 'M12 5v14' } },
    { tag: 'path', attrs: { d: 'M5 12h14' } }
  ],
  minus: [
    { tag: 'path', attrs: { d: 'M5 12h14' } }
  ],
  trash: [
    { tag: 'path', attrs: { d: 'M5 7h14' } },
    { tag: 'path', attrs: { d: 'M9 7V5h6v2' } },
    { tag: 'path', attrs: { d: 'M7 7l1 12h8l1-12' } }
  ],
  pin: [
    { tag: 'path', attrs: { d: 'M12 21s6-5.6 6-10a6 6 0 1 0-12 0c0 4.4 6 10 6 10Z' } },
    { tag: 'circle', attrs: { cx: 12, cy: 11, r: 2.3 } }
  ],
  clock: [
    { tag: 'circle', attrs: { cx: 12, cy: 12, r: 8.5 } },
    { tag: 'path', attrs: { d: 'M12 7.5V12l3 2' } }
  ],
  mail: [
    { tag: 'rect', attrs: { x: 3.5, y: 6, width: 17, height: 12, rx: 2.5 } },
    { tag: 'path', attrs: { d: 'M4.5 7.5L12 13l7.5-5.5' } }
  ],
  check: [
    { tag: 'path', attrs: { d: 'M5.5 12.5L10 17l8.5-9.5' } }
  ],
  pause: [
    { tag: 'path', attrs: { d: 'M9 6v12' } },
    { tag: 'path', attrs: { d: 'M15 6v12' } }
  ],
  play: [
    { tag: 'path', attrs: { d: 'M8 6l10 6-10 6V6Z' } }
  ]
};

export function createIcon(name, options = {}) {
  const size = Number(options.size || 20);
  const className = options.className || '';
  const shapes = ICON_SHAPES[name] || ICON_SHAPES.search;

  const svg = svgEl('svg', {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': options.strokeWidth || 2.2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
    focusable: 'false'
  });

  if (className) {
    svg.setAttribute('class', className);
  }

  for (const shape of shapes) {
    svg.appendChild(svgEl(shape.tag, shape.attrs));
  }

  return svg;
}

/* Ikon wajah beruang mini diberi tepi cokelat halus agar tetap jelas saat tombol pilihan berubah warna menjadi krem. */
export function createExpressionIcon(expressionId, size = 28) {
  const outline = '#7A4B31';
  const svg = svgEl('svg', {
    width: size,
    height: size,
    viewBox: '0 0 36 36',
    fill: 'none',
    'aria-hidden': 'true',
    focusable: 'false',
    class: 'builder-option-svg'
  });

  svg.appendChild(svgEl('circle', { cx: 9.5, cy: 10.5, r: 4.2, fill: '#FFFDF9', stroke: outline, 'stroke-width': 1.2 }));
  svg.appendChild(svgEl('circle', { cx: 26.5, cy: 10.5, r: 4.2, fill: '#FFFDF9', stroke: outline, 'stroke-width': 1.2 }));
  svg.appendChild(svgEl('circle', { cx: 9.5, cy: 10.5, r: 2, fill: '#F4A7B9' }));
  svg.appendChild(svgEl('circle', { cx: 26.5, cy: 10.5, r: 2, fill: '#F4A7B9' }));
  svg.appendChild(
    svgEl('rect', {
      x: 6,
      y: 10,
      width: 24,
      height: 21,
      rx: 10.5,
      fill: '#FFFDF9',
      stroke: outline,
      'stroke-width': 1.2
    })
  );

  svg.appendChild(svgEl('ellipse', { cx: 10.5, cy: 23.2, rx: 2.3, ry: 1.4, fill: '#F4A7B9' }));
  svg.appendChild(svgEl('ellipse', { cx: 25.5, cy: 23.2, rx: 2.3, ry: 1.4, fill: '#F4A7B9' }));

  if (expressionId === 'kedip') {
    svg.appendChild(svgEl('circle', { cx: 13.5, cy: 19.5, r: 1.8, fill: '#2B1810' }));
    svg.appendChild(
      svgEl('path', {
        d: 'M20.5 20 Q22.5 17.5 24.5 20',
        stroke: '#2B1810',
        'stroke-width': 1.8,
        'stroke-linecap': 'round'
      })
    );
  } else if (expressionId === 'nyaman') {
    svg.appendChild(
      svgEl('path', {
        d: 'M11.5 20 Q13.5 17.8 15.5 20',
        stroke: '#2B1810',
        'stroke-width': 1.8,
        'stroke-linecap': 'round'
      })
    );
    svg.appendChild(
      svgEl('path', {
        d: 'M20.5 20 Q22.5 17.8 24.5 20',
        stroke: '#2B1810',
        'stroke-width': 1.8,
        'stroke-linecap': 'round'
      })
    );
  } else if (expressionId === 'cerah') {
    svg.appendChild(svgEl('circle', { cx: 13.5, cy: 19.2, r: 2.1, fill: '#2B1810' }));
    svg.appendChild(svgEl('circle', { cx: 12.8, cy: 18.5, r: 0.7, fill: '#FFFDF9' }));
    svg.appendChild(svgEl('circle', { cx: 22.5, cy: 19.2, r: 2.1, fill: '#2B1810' }));
    svg.appendChild(svgEl('circle', { cx: 21.8, cy: 18.5, r: 0.7, fill: '#FFFDF9' }));
  } else {
    svg.appendChild(svgEl('circle', { cx: 13.5, cy: 19.5, r: 1.8, fill: '#2B1810' }));
    svg.appendChild(svgEl('circle', { cx: 22.5, cy: 19.5, r: 1.8, fill: '#2B1810' }));
  }

  svg.appendChild(svgEl('ellipse', { cx: 18, cy: 21.6, rx: 2, ry: 1.4, fill: '#7A4B31' }));

  if (expressionId === 'cerah') {
    svg.appendChild(
      svgEl('path', {
        d: 'M15.6 24 Q18 27.6 20.4 24 Z',
        fill: '#7A4B31'
      })
    );
  } else {
    svg.appendChild(
      svgEl('path', {
        d: 'M15.4 24.4 Q16.7 26 18 24.6 Q19.3 26 20.6 24.4',
        stroke: '#2B1810',
        'stroke-width': 1.5,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    );
  }

  return svg;
}

/* Ikon topping mini buatan sendiri untuk langkah keempat pembuat cangkir. */
export function createToppingIcon(toppingId, size = 28) {
  const svg = svgEl('svg', {
    width: size,
    height: size,
    viewBox: '0 0 36 36',
    fill: 'none',
    'aria-hidden': 'true',
    focusable: 'false',
    class: 'builder-option-svg'
  });

  if (toppingId === 'krim-kocok') {
    svg.appendChild(
      svgEl('path', {
        d: 'M7 24 C7 19, 11 16, 14.5 16.5 C15.5 12, 20.5 11.5, 22 16 C25.5 15.8, 29 19, 29 24 C24 27, 12 27, 7 24 Z',
        fill: '#FFFBF5',
        stroke: '#B99F86',
        'stroke-width': 1.5
      })
    );
    svg.appendChild(
      svgEl('path', {
        d: 'M12 20 C16 18, 20 18, 24 20.5',
        stroke: '#F5B82E',
        'stroke-width': 2.2,
        'stroke-linecap': 'round'
      })
    );
  } else if (toppingId === 'boba-madu') {
    const pearls = [
      [12, 22, 4.2],
      [18.5, 16, 4.2],
      [24.5, 22, 4.2],
      [18.5, 24.5, 4]
    ];
    for (const [cx, cy, r] of pearls) {
      svg.appendChild(svgEl('circle', { cx, cy, r, fill: '#4A281A', stroke: '#F5B82E', 'stroke-width': 1.2 }));
      svg.appendChild(svgEl('circle', { cx: cx - 1.2, cy: cy - 1.2, r: 1.1, fill: '#F5B82E' }));
    }
  } else if (toppingId === 'biskuit-beruang') {
    svg.appendChild(svgEl('circle', { cx: 11.5, cy: 13, r: 4, fill: '#C88955', stroke: '#7A4B31', 'stroke-width': 1.4 }));
    svg.appendChild(svgEl('circle', { cx: 24.5, cy: 13, r: 4, fill: '#C88955', stroke: '#7A4B31', 'stroke-width': 1.4 }));
    svg.appendChild(svgEl('circle', { cx: 18, cy: 20, r: 8.5, fill: '#D59966', stroke: '#7A4B31', 'stroke-width': 1.4 }));
    svg.appendChild(svgEl('circle', { cx: 15, cy: 19, r: 1.2, fill: '#2B1810' }));
    svg.appendChild(svgEl('circle', { cx: 21, cy: 19, r: 1.2, fill: '#2B1810' }));
    svg.appendChild(svgEl('ellipse', { cx: 18, cy: 21.8, rx: 1.8, ry: 1.2, fill: '#5C331C' }));
  } else if (toppingId === 'taburan-kakao') {
    const specks = [
      [11, 15, 2], [18, 12, 2.2], [25, 16, 1.9],
      [14, 21, 2.3], [21, 20, 2], [17, 25.5, 2.1], [25, 24, 1.8], [10, 24, 1.7]
    ];
    for (const [cx, cy, r] of specks) {
      svg.appendChild(svgEl('circle', { cx, cy, r, fill: '#7A4B31' }));
    }
  } else {
    svg.appendChild(
      svgEl('circle', {
        cx: 18,
        cy: 18,
        r: 9,
        stroke: 'currentColor',
        'stroke-width': 2
      })
    );
    svg.appendChild(
      svgEl('path', {
        d: 'M12 24L24 12',
        stroke: 'currentColor',
        'stroke-width': 2,
        'stroke-linecap': 'round'
      })
    );
  }

  return svg;
}