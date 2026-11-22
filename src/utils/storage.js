/*
NAMA: Utilitas Penyimpanan Keranjang
FUNGSI: Menyimpan dan membaca daftar item keranjang non-sensitif di localStorage dengan validasi ketat agar tahan data rusak.
CARA MENGUBAH: Ubah STORAGE_KEY jika struktur item keranjang berubah besar di masa depan.
CARA MENAMBAH: Tambahkan bidang non-sensitif baru di fungsi sanitizeCartItem bila dibutuhkan.
CARA MENGHAPUS: Jika dihapus, isi keranjang akan hilang saat halaman dimuat ulang.
*/

const STORAGE_KEY = 'brumbreo_cart_v1';
const MAX_ITEMS = 40;
const MAX_QTY = 99;

function sanitizeCartItem(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const id = typeof raw.id === 'string' ? raw.id.trim().slice(0, 80) : '';
  const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, 100) : '';
  const note = typeof raw.note === 'string' ? raw.note.trim().slice(0, 180) : '';
  const price = Number(raw.price);
  const quantity = Math.floor(Number(raw.quantity));

  if (!id || !name) return null;
  if (!Number.isFinite(price) || price < 0 || price > 10000000) return null;
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QTY) return null;

  return {
    id,
    name,
    note,
    price: Math.round(price),
    quantity
  };
}

export function loadCart() {
  try {
    const rawText = window.localStorage.getItem(STORAGE_KEY);
    if (!rawText) return [];
    const parsed = JSON.parse(rawText);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(sanitizeCartItem)
      .filter(Boolean)
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

export function saveCart(items) {
  try {
    if (!Array.isArray(items)) return false;
    const clean = items
      .map(sanitizeCartItem)
      .filter(Boolean)
      .slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    return true;
  } catch {
    return false;
  }
}