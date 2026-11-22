/*
NAMA: Utilitas Tautan Pesanan WhatsApp
FUNGSI: Menyusun tautan WhatsApp yang aman dan ter-encode untuk pesanan keranjang maupun racikan cangkir builder.
CARA MENGUBAH: Ubah susunan kalimat salam atau format ringkasan pesanan di buildCartMessage dan buildCustomCupMessage.
CARA MENAMBAH: Tambahkan pembuat pesan baru jika ada kanal pemesanan lain di luar keranjang dan builder.
CARA MENGHAPUS: Jika dihapus, pemesanan dari laci keranjang dan pembuat cangkir tidak bisa membuka WhatsApp.
*/

import { business } from '../../data/business.js';
import { formatRupiah } from './format.js';

export function getCleanWhatsappNumber() {
  const digits = String(business.whatsappNumber || '').replace(/\D/g, '');
  return digits.length >= 9 ? digits : '';
}

export function isWhatsappReady() {
  return getCleanWhatsappNumber().length >= 9;
}

export function createWhatsappUrl(message) {
  const number = getCleanWhatsappNumber();
  if (!number) return null;
  const text = String(message || '').trim();
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function buildCartWhatsappUrl(items) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const lines = items.map((item, idx) => {
    const subtotal = formatRupiah(item.price * item.quantity);
    const detail = item.note ? ` (${item.note})` : '';
    return `${idx + 1}. ${item.name}${detail} x${item.quantity} : ${subtotal}`;
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const message = [
    `Halo ${business.brandName}, saya ingin memesan:`,
    ...lines,
    `Total: ${formatRupiah(total)}`
  ].join('\n');

  return createWhatsappUrl(message);
}

export function buildCustomCupWhatsappUrl(selection) {
  if (!selection) return null;

  const message = [
    `Halo ${business.brandName}, saya ingin memesan cangkir racikan:`,
    `Warna gelas: ${selection.cupColorLabel}`,
    `Minuman: ${selection.drinkLabel}`,
    `Ekspresi beruang: ${selection.expressionLabel}`,
    `Topping: ${selection.toppingLabel}`,
    `Perkiraan harga: ${formatRupiah(selection.totalPrice)}`
  ].join('\n');

  return createWhatsappUrl(message);
}