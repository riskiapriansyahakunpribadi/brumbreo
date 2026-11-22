/*
NAMA: Komponen Maskot Gelas Kepala Beruang SVG
FUNGSI: Merakit maskot gelas beruang Brumbreo dari bagian terpisah (pegangan, telinga kiri dan kanan, badan, cairan kopi yang bisa dianimasikan terisi, pipi, mata yang bisa berkedip, hidung, mulut, topping, dan percikan mikro) untuk Hero, Parade, Builder, dan Footer.
CARA MENGUBAH: Ubah warna bawaan pada DEFAULT_OPTIONS atau bentuk path di masing-masing fungsi pembentuk bagian.
CARA MENAMBAH: Untuk ekspresi wajah baru tambahkan cabang di buildFacePart(); untuk topping baru tambahkan cabang di buildToppingPart().
CARA MENGHAPUS: Jangan menghapus bagian inti (body, ears, face, liquid) karena dipakai di seluruh halaman.
*/

const SVG_NS = 'http://www.w3.org/2000/svg';
let instanceCounter = 0;

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

const DEFAULT_OPTIONS = {
  cupColor: '#FFFDF9',
  liquidColor: '#9B6542',
  cheekColor: '#F4A7B9',
  expression: 'senyum',
  topping: 'tanpa-topping',
  showHandle: true,
  size: 420,
  label: 'Maskot gelas kopi berbentuk kepala beruang Brumbreo'
};

function buildFacePart(expression) {
  const group = svgEl('g', { 'data-part': 'face', class: 'bear-part bear-face' });

  // Kelompok mata terpisah agar bisa dianimasikan berkedip alami di Hero.
  const eyesGroup = svgEl('g', { 'data-part': 'eyes', class: 'bear-eyes' });

  if (expression === 'kedip') {
    eyesGroup.appendChild(svgEl('circle', { cx: 162, cy: 266, r: 13.5, fill: '#2B1810' }));
    eyesGroup.appendChild(svgEl('circle', { cx: 157.5, cy: 261, r: 4, fill: '#FFFDF9' }));
    eyesGroup.appendChild(
      svgEl('path', {
        d: 'M243 268 Q258 252 273 268',
        fill: 'none',
        stroke: '#2B1810',
        'stroke-width': 6.5,
        'stroke-linecap': 'round'
      })
    );
  } else if (expression === 'nyaman') {
    eyesGroup.appendChild(
      svgEl('path', {
        d: 'M147 268 Q162 254 177 268',
        fill: 'none',
        stroke: '#2B1810',
        'stroke-width': 6.5,
        'stroke-linecap': 'round'
      })
    );
    eyesGroup.appendChild(
      svgEl('path', {
        d: 'M243 268 Q258 254 273 268',
        fill: 'none',
        stroke: '#2B1810',
        'stroke-width': 6.5,
        'stroke-linecap': 'round'
      })
    );
  } else if (expression === 'cerah') {
    eyesGroup.appendChild(svgEl('circle', { cx: 162, cy: 265, r: 15, fill: '#2B1810' }));
    eyesGroup.appendChild(svgEl('circle', { cx: 156.5, cy: 259, r: 4.8, fill: '#FFFDF9' }));
    eyesGroup.appendChild(svgEl('circle', { cx: 167, cy: 270, r: 2.3, fill: '#FFFDF9' }));

    eyesGroup.appendChild(svgEl('circle', { cx: 258, cy: 265, r: 15, fill: '#2B1810' }));
    eyesGroup.appendChild(svgEl('circle', { cx: 252.5, cy: 259, r: 4.8, fill: '#FFFDF9' }));
    eyesGroup.appendChild(svgEl('circle', { cx: 263, cy: 270, r: 2.3, fill: '#FFFDF9' }));
  } else {
    eyesGroup.appendChild(svgEl('circle', { cx: 162, cy: 266, r: 13.5, fill: '#2B1810' }));
    eyesGroup.appendChild(svgEl('circle', { cx: 157.5, cy: 261, r: 4, fill: '#FFFDF9' }));
    eyesGroup.appendChild(svgEl('circle', { cx: 258, cy: 266, r: 13.5, fill: '#2B1810' }));
    eyesGroup.appendChild(svgEl('circle', { cx: 253.5, cy: 261, r: 4, fill: '#FFFDF9' }));
  }

  group.appendChild(eyesGroup);

  group.appendChild(svgEl('ellipse', { cx: 210, cy: 276, rx: 13.5, ry: 9.5, fill: '#2B1810' }));
  group.appendChild(svgEl('ellipse', { cx: 206, cy: 273, rx: 4, ry: 2.2, fill: '#7A4B31' }));

  if (expression === 'cerah') {
    group.appendChild(
      svgEl('path', {
        d: 'M197 291 Q210 311 223 291 Z',
        fill: '#7A4B31',
        stroke: '#2B1810',
        'stroke-width': 3.5,
        'stroke-linejoin': 'round'
      })
    );
    group.appendChild(
      svgEl('ellipse', { cx: 210, cy: 299, rx: 7, ry: 3.6, fill: '#F4A7B9' })
    );
  } else {
    group.appendChild(
      svgEl('path', {
        d: 'M194 291 Q202 301 210 292 Q218 301 226 291',
        fill: 'none',
        stroke: '#2B1810',
        'stroke-width': 4.8,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    );
  }

  return group;
}

function buildToppingPart(topping) {
  const group = svgEl('g', { 'data-part': 'topping', class: 'bear-part bear-topping' });

  if (topping === 'krim-kocok') {
    group.appendChild(
      svgEl('path', {
        d: 'M142 158 C142 132, 168 122, 186 124 C192 104, 224 102, 234 122 C254 120, 278 134, 276 158 C252 170, 168 170, 142 158 Z',
        fill: '#FFFBF5',
        stroke: '#D9C4AE',
        'stroke-width': 3
      })
    );
    group.appendChild(
      svgEl('path', {
        d: 'M172 136 C192 126, 226 126, 248 138',
        fill: 'none',
        stroke: '#F5B82E',
        'stroke-width': 5,
        'stroke-linecap': 'round'
      })
    );
  } else if (topping === 'boba-madu') {
    const pearls = [
      { cx: 158, cy: 162, r: 9.5 },
      { cx: 182, cy: 171, r: 10 },
      { cx: 208, cy: 166, r: 9.5 },
      { cx: 235, cy: 171, r: 10 },
      { cx: 260, cy: 161, r: 9.5 },
      { cx: 196, cy: 155, r: 8.5 },
      { cx: 224, cy: 155, r: 8.5 }
    ];
    for (const pearl of pearls) {
      group.appendChild(
        svgEl('circle', { cx: pearl.cx, cy: pearl.cy, r: pearl.r, fill: '#4A281A' })
      );
      group.appendChild(
        svgEl('circle', {
          cx: pearl.cx - 2.8,
          cy: pearl.cy - 2.8,
          r: 2.6,
          fill: '#F5B82E',
          opacity: 0.85
        })
      );
    }
  } else if (topping === 'biskuit-beruang') {
    const cookie = svgEl('g', { transform: 'translate(232 106) rotate(14)' }, [
      svgEl('circle', { cx: 14, cy: 16, r: 12, fill: '#B57644', stroke: '#7A4B31', 'stroke-width': 2.5 }),
      svgEl('circle', { cx: 54, cy: 16, r: 12, fill: '#B57644', stroke: '#7A4B31', 'stroke-width': 2.5 }),
      svgEl('circle', { cx: 34, cy: 36, r: 24, fill: '#C88955', stroke: '#7A4B31', 'stroke-width': 2.5 }),
      svgEl('circle', { cx: 26, cy: 33, r: 2.8, fill: '#2B1810' }),
      svgEl('circle', { cx: 42, cy: 33, r: 2.8, fill: '#2B1810' }),
      svgEl('ellipse', { cx: 34, cy: 40, rx: 4, ry: 2.8, fill: '#5C331C' })
    ]);
    group.appendChild(cookie);
  } else if (topping === 'taburan-kakao') {
    const specks = [
      [152, 160, 3.2], [166, 154, 2.5], [176, 167, 3.8], [189, 159, 2.8],
      [204, 152, 3.4], [216, 165, 3.2], [229, 155, 2.6], [244, 166, 3.6],
      [257, 158, 2.8], [268, 163, 3.1], [198, 173, 2.7], [234, 172, 2.9]
    ];
    for (const [cx, cy, r] of specks) {
      group.appendChild(svgEl('circle', { cx, cy, r, fill: '#4A281A', opacity: 0.88 }));
    }
  }

  return group;
}

/* Percikan tetes mikro saat topping mendarat di adegan animasi Hero (tersembunyi secara bawaan). */
function buildSplashPart(liquidColor) {
  return svgEl(
    'g',
    { 'data-part': 'splash', class: 'bear-part bear-splash', opacity: 0 },
    [
      svgEl('circle', { cx: 148, cy: 112, r: 5.5, fill: liquidColor, 'data-liquid-fill': 'fill' }),
      svgEl('circle', { cx: 174, cy: 96, r: 4, fill: '#F5B82E' }),
      svgEl('circle', { cx: 248, cy: 94, r: 4.5, fill: '#F4A7B9' }),
      svgEl('circle', { cx: 274, cy: 114, r: 5.5, fill: liquidColor, 'data-liquid-fill': 'fill' }),
      svgEl('path', {
        d: 'M132 130 Q140 118 152 124',
        fill: 'none',
        stroke: liquidColor,
        'stroke-width': 3.5,
        'stroke-linecap': 'round',
        'data-liquid-stroke': 'stroke'
      }),
      svgEl('path', {
        d: 'M288 130 Q280 118 268 124',
        fill: 'none',
        stroke: liquidColor,
        'stroke-width': 3.5,
        'stroke-linecap': 'round',
        'data-liquid-stroke': 'stroke'
      })
    ]
  );
}

export function createBearCup(customOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...customOptions };
  instanceCounter += 1;
  const uid = `bear-cup-${instanceCounter}`;
  const rimStroke = 'rgba(43, 24, 16, 0.15)';

  const svg = svgEl('svg', {
    width: opts.size,
    height: opts.size,
    viewBox: '0 0 420 420',
    role: opts.decorative ? 'presentation' : 'img',
    class: 'bear-cup-svg'
  });

  if (opts.decorative) {
    svg.setAttribute('aria-hidden', 'true');
  } else {
    svg.setAttribute('aria-label', opts.label);
  }

  const defs = svgEl('defs', {}, [
    svgEl('linearGradient', { id: `${uid}-shade`, x1: '0%', y1: '0%', x2: '100%', y2: '100%' }, [
      svgEl('stop', { offset: '0%', 'stop-color': '#FFFFFF', 'stop-opacity': '0.52' }),
      svgEl('stop', { offset: '55%', 'stop-color': '#FFFFFF', 'stop-opacity': '0' }),
      svgEl('stop', { offset: '100%', 'stop-color': '#2B1810', 'stop-opacity': '0.16' })
    ]),
    svgEl('linearGradient', { id: `${uid}-liquid-sheen`, x1: '0%', y1: '0%', x2: '0%', y2: '100%' }, [
      svgEl('stop', { offset: '0%', 'stop-color': '#2B1810', 'stop-opacity': '0.16' }),
      svgEl('stop', { offset: '100%', 'stop-color': '#FFFFFF', 'stop-opacity': '0.08' })
    ]),
    svgEl('clipPath', { id: `${uid}-rim-clip` }, [
      svgEl('ellipse', { cx: 210, cy: 162, rx: 120, ry: 32 })
    ])
  ]);
  svg.appendChild(defs);

  // 1. Pegangan cangkir dengan tepi tipis agar kontras di latar terang maupun pastel.
  if (opts.showHandle) {
    const handleGroup = svgEl('g', { 'data-part': 'handle', class: 'bear-part bear-handle' }, [
      svgEl('path', {
        d: 'M330 212 C 392 212, 394 316, 326 322',
        fill: 'none',
        stroke: rimStroke,
        'stroke-width': 38,
        'stroke-linecap': 'round'
      }),
      svgEl('path', {
        d: 'M330 212 C 392 212, 394 316, 326 322',
        fill: 'none',
        stroke: opts.cupColor,
        'stroke-width': 32,
        'stroke-linecap': 'round',
        'data-cup-fill': 'stroke'
      }),
      svgEl('path', {
        d: 'M328 212 C 384 212, 386 308, 324 316',
        fill: 'none',
        stroke: 'rgba(43, 24, 16, 0.08)',
        'stroke-width': 24,
        'stroke-linecap': 'round'
      }),
      svgEl('path', {
        d: 'M326 210 C 379 210, 381 304, 322 313',
        fill: 'none',
        stroke: opts.cupColor,
        'stroke-width': 20,
        'stroke-linecap': 'round',
        'data-cup-fill': 'stroke'
      })
    ]);
    svg.appendChild(handleGroup);
  }

  // 2. Dua telinga bulat beruang dipisah kiri dan kanan agar bisa bergoyang ceria.
  const earLeft = svgEl('g', { 'data-part': 'ear-left' }, [
    svgEl('circle', {
      cx: 118,
      cy: 112,
      r: 47,
      fill: opts.cupColor,
      stroke: rimStroke,
      'stroke-width': 3,
      'data-cup-fill': 'fill'
    }),
    svgEl('circle', { cx: 118, cy: 112, r: 47, fill: `url(#${uid}-shade)` }),
    svgEl('circle', { cx: 121, cy: 116, r: 23, fill: opts.cheekColor })
  ]);

  const earRight = svgEl('g', { 'data-part': 'ear-right' }, [
    svgEl('circle', {
      cx: 302,
      cy: 112,
      r: 47,
      fill: opts.cupColor,
      stroke: rimStroke,
      'stroke-width': 3,
      'data-cup-fill': 'fill'
    }),
    svgEl('circle', { cx: 302, cy: 112, r: 47, fill: `url(#${uid}-shade)` }),
    svgEl('circle', { cx: 299, cy: 116, r: 23, fill: opts.cheekColor })
  ]);

  const earsGroup = svgEl('g', { 'data-part': 'ears', class: 'bear-part bear-ears' }, [
    earLeft,
    earRight
  ]);
  svg.appendChild(earsGroup);

  // 3. Badan cangkir keramik yang membulat hangat.
  const bodyGroup = svgEl('g', { 'data-part': 'body', class: 'bear-part bear-body' }, [
    svgEl('path', {
      d: 'M72 158 C 68 250, 74 344, 118 378 C 154 402, 266 402, 302 378 C 346 344, 352 250, 348 158 Z',
      fill: opts.cupColor,
      stroke: rimStroke,
      'stroke-width': 3,
      'data-cup-fill': 'fill'
    }),
    svgEl('path', {
      d: 'M72 158 C 68 250, 74 344, 118 378 C 154 402, 266 402, 302 378 C 346 344, 352 250, 348 158 Z',
      fill: `url(#${uid}-shade)`
    }),
    svgEl('path', {
      d: 'M100 226 C 96 272, 102 316, 118 344',
      fill: 'none',
      stroke: '#FFFFFF',
      'stroke-width': 11,
      'stroke-linecap': 'round',
      opacity: 0.55
    }),
    svgEl('ellipse', {
      cx: 210,
      cy: 158,
      rx: 138,
      ry: 43,
      fill: opts.cupColor,
      stroke: rimStroke,
      'stroke-width': 3,
      'data-cup-fill': 'fill'
    }),
    svgEl('ellipse', {
      cx: 210,
      cy: 160,
      rx: 125,
      ry: 35,
      fill: 'rgba(43, 24, 16, 0.13)'
    })
  ]);
  svg.appendChild(bodyGroup);

  // 4. Permukaan minuman dengan lapisan dalam yang dapat naik halus saat adegan tuang.
  const liquidInner = svgEl('g', { 'data-part': 'liquid-inner' }, [
    svgEl('ellipse', {
      cx: 210,
      cy: 166,
      rx: 122,
      ry: 32,
      fill: opts.liquidColor,
      'data-liquid-fill': 'fill'
    }),
    svgEl('ellipse', {
      cx: 210,
      cy: 166,
      rx: 122,
      ry: 32,
      fill: `url(#${uid}-liquid-sheen)`
    }),
    svgEl('g', { 'data-part': 'latte-art', opacity: 0.82, fill: '#FFFDF9' }, [
      svgEl('ellipse', { cx: 192, cy: 156, rx: 9, ry: 4.5 }),
      svgEl('ellipse', { cx: 228, cy: 156, rx: 9, ry: 4.5 }),
      svgEl('ellipse', { cx: 210, cy: 166, rx: 24, ry: 11 })
    ])
  ]);

  const liquidGroup = svgEl(
    'g',
    { 'data-part': 'liquid', class: 'bear-part bear-liquid', 'clip-path': `url(#${uid}-rim-clip)` },
    [liquidInner]
  );
  svg.appendChild(liquidGroup);

  // 5. Pipi merah muda permen.
  const cheeksGroup = svgEl('g', { 'data-part': 'cheeks', class: 'bear-part bear-cheeks' }, [
    svgEl('ellipse', { cx: 132, cy: 294, rx: 22, ry: 12.5, fill: opts.cheekColor, opacity: 0.85 }),
    svgEl('ellipse', { cx: 288, cy: 294, rx: 22, ry: 12.5, fill: opts.cheekColor, opacity: 0.85 })
  ]);
  svg.appendChild(cheeksGroup);

  // 6. Ekspresi wajah beruang.
  svg.appendChild(buildFacePart(opts.expression));

  // 7. Topping di atas permukaan kopi dan percikan mikro.
  svg.appendChild(buildToppingPart(opts.topping));
  svg.appendChild(buildSplashPart(opts.liquidColor));

  return svg;
}

export function updateBearCup(svg, nextOptions = {}) {
  if (!svg) return;

  if (nextOptions.cupColor) {
    svg.querySelectorAll('[data-cup-fill="fill"]').forEach((node) => {
      node.setAttribute('fill', nextOptions.cupColor);
    });
    svg.querySelectorAll('[data-cup-fill="stroke"]').forEach((node) => {
      node.setAttribute('stroke', nextOptions.cupColor);
    });
  }

  if (nextOptions.liquidColor) {
    svg.querySelectorAll('[data-liquid-fill="fill"]').forEach((node) => {
      node.setAttribute('fill', nextOptions.liquidColor);
    });
    svg.querySelectorAll('[data-liquid-stroke="stroke"]').forEach((node) => {
      node.setAttribute('stroke', nextOptions.liquidColor);
    });
  }

  if (nextOptions.expression) {
    const oldFace = svg.querySelector('[data-part="face"]');
    if (oldFace) {
      oldFace.replaceWith(buildFacePart(nextOptions.expression));
    }
  }

  if (nextOptions.topping) {
    const oldTopping = svg.querySelector('[data-part="topping"]');
    if (oldTopping) {
      oldTopping.replaceWith(buildToppingPart(nextOptions.topping));
    }
  }
}