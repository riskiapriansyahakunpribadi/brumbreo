/*
NAMA: Utilitas Status Jam Buka Nyata
FUNGSI: Menghitung apakah kedai sedang buka atau tutup berdasarkan jadwal di data/business.js dan jam saat ini di zona waktu kedai.
CARA MENGUBAH: Ubah format teks status di objek kembalian jika ingin gaya bahasa yang berbeda.
CARA MENAMBAH: Tambahkan dukungan hari libur khusus jika pemilik membutuhkan jadwal tutup musiman.
CARA MENGHAPUS: Jika dihapus, status buka pada src/modules/footer.js tidak dapat ditampilkan.
*/

const DAY_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};

function parseMinutes(hhmm) {
  if (typeof hhmm !== 'string') return null;
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hhmm.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function getZonedNow(timezone, referenceDate) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone || 'Asia/Jakarta',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).formatToParts(referenceDate);

    const weekday = parts.find((p) => p.type === 'weekday')?.value;
    const hourRaw = Number(parts.find((p) => p.type === 'hour')?.value);
    const minute = Number(parts.find((p) => p.type === 'minute')?.value);
    const hour = hourRaw === 24 ? 0 : hourRaw;

    return {
      day: DAY_INDEX[weekday] ?? referenceDate.getDay(),
      minutes: hour * 60 + minute
    };
  } catch {
    return {
      day: referenceDate.getDay(),
      minutes: referenceDate.getHours() * 60 + referenceDate.getMinutes()
    };
  }
}

export function getOpenStatus(hours, timezone = 'Asia/Jakarta', now = new Date()) {
  if (!Array.isArray(hours) || hours.length === 0) {
    return {
      configured: false,
      isOpen: false,
      label: '',
      detail: ''
    };
  }

  const validHours = hours.filter(
    (entry) =>
      entry &&
      Number.isInteger(entry.day) &&
      entry.day >= 0 &&
      entry.day <= 6 &&
      parseMinutes(entry.open) !== null &&
      parseMinutes(entry.close) !== null
  );

  if (validHours.length === 0) {
    return {
      configured: false,
      isOpen: false,
      label: '',
      detail: ''
    };
  }

  const current = getZonedNow(timezone, now);
  const todayEntry = validHours.find((entry) => entry.day === current.day);

  if (todayEntry) {
    const openMin = parseMinutes(todayEntry.open);
    const closeMin = parseMinutes(todayEntry.close);
    const crossesMidnight = closeMin <= openMin;
    const openNow = crossesMidnight
      ? current.minutes >= openMin || current.minutes < closeMin
      : current.minutes >= openMin && current.minutes < closeMin;

    if (openNow) {
      return {
        configured: true,
        isOpen: true,
        label: 'Sedang buka',
        detail: `Tutup pukul ${todayEntry.close}`
      };
    }

    if (!crossesMidnight && current.minutes < openMin) {
      return {
        configured: true,
        isOpen: false,
        label: 'Sedang tutup',
        detail: `Buka hari ini pukul ${todayEntry.open}`
      };
    }
  }

  // Cari hari buka terdekat dalam 7 hari ke depan.
  for (let offset = 1; offset <= 7; offset += 1) {
    const nextDay = (current.day + offset) % 7;
    const nextEntry = validHours.find((entry) => entry.day === nextDay);
    if (nextEntry) {
      const dayLabel = offset === 1 ? 'besok' : nextEntry.label || 'berikutnya';
      return {
        configured: true,
        isOpen: false,
        label: 'Sedang tutup',
        detail: `Buka ${dayLabel} pukul ${nextEntry.open}`
      };
    }
  }

  return {
    configured: true,
    isOpen: false,
    label: 'Sedang tutup',
    detail: ''
  };
}