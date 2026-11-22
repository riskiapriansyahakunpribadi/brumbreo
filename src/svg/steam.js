/*
NAMA: Generator Lengkung Uap Kopi SVG
FUNGSI: Menggambar pita uap kopi organik untuk latar Hero dan aksen bagian Penutup, menggantikan langit berawan di video.
CARA MENGUBAH: Ubah nilai stroke atau stroke-width di konfigurasi variant untuk menebalkan atau melembutkan uap.
CARA MENAMBAH: Tambahkan objek pita baru di dalam array strands untuk menambah alur uap.
CARA MENGHAPUS: Jika dihapus, pastikan pemanggilannya di heroMotion.js dan footer.js ikut dilepas.
*/

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, String(value));
  }
  return el;
}

const STEAM_STRANDS = [
  {
    id: 'steam-left-outer',
    d: 'M185 740 C 125 600, 235 470, 175 330 C 125 215, 215 110, 175 18',
    strokeWidth: 34,
    opacity: 0.42
  },
  {
    id: 'steam-left-inner',
    d: 'M375 760 C 435 610, 325 480, 385 335 C 430 220, 355 120, 395 25',
    strokeWidth: 46,
    opacity: 0.5
  },
  {
    id: 'steam-right-inner',
    d: 'M825 760 C 765 615, 875 480, 815 330 C 770 215, 845 115, 805 22',
    strokeWidth: 44,
    opacity: 0.48
  },
  {
    id: 'steam-right-outer',
    d: 'M1015 740 C 1070 595, 965 465, 1020 325 C 1068 210, 985 108, 1025 18',
    strokeWidth: 32,
    opacity: 0.38
  }
];

export function createSteamSvg(options = {}) {
  const variant = options.variant || 'hero';
  const strokeColor = variant === 'footer' ? '#523426' : '#EADACB';
  const accentColor = variant === 'footer' ? '#6B4331' : '#DFC7B1';

  const svg = svgEl('svg', {
    width: 1200,
    height: 760,
    viewBox: '0 0 1200 760',
    fill: 'none',
    'aria-hidden': 'true',
    focusable: 'false',
    class: options.className || 'hero-steam-svg'
  });

  STEAM_STRANDS.forEach((strand, idx) => {
    const group = svgEl('g', {
      class: 'steam-strand',
      'data-steam-index': idx
    });

    const path = svgEl('path', {
      d: strand.d,
      stroke: idx % 2 === 0 ? strokeColor : accentColor,
      'stroke-width': strand.strokeWidth,
      'stroke-linecap': 'round',
      opacity: strand.opacity
    });

    group.appendChild(path);
    svg.appendChild(group);
  });

  return svg;
}