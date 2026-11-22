/*
NAMA: Endpoint Serverless Buletin Brumbreo
FUNGSI: Menerima pendaftaran email buletin lewat POST, memverifikasi asal permintaan dan tipe konten, membatasi ukuran data serta laju permintaan per IP, mengecek honeypot anti-bot, memvalidasi format email di server, dan meneruskan ke webhook opsional lewat environment variable Vercel.
CARA MENGUBAH: Sesuaikan batas permintaan pada RATE_LIMIT_MAX atau jendela waktu pada RATE_LIMIT_WINDOW_MS.
CARA MENAMBAH: Untuk menyambungkan layanan email pihak ketiga, isi NEWSLETTER_WEBHOOK_URL dan NEWSLETTER_WEBHOOK_SECRET di pengaturan Environment Variables Vercel tanpa mengubah kode browser.
CARA MENGHAPUS: Jika formulir buletin dilepas dari footer, hapus file ini beserta blok kartu buletin di src/modules/footer.js.
*/

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MAX_BODY_CHARS = 1024;
const MAX_EMAIL_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Penyimpanan laju di memori per instance serverless untuk menahan kiriman beruntun.
const rateBucket = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
    return forwarded.split(',')[0].trim().slice(0, 64);
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim().length > 0) {
    return realIp.trim().slice(0, 64);
  }
  return req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();

  if (rateBucket.size > 500) {
    for (const [key, entry] of rateBucket.entries()) {
      if (now > entry.resetAt) {
        rateBucket.delete(key);
      }
    }
  }

  const record = rateBucket.get(ip);
  if (!record || now > record.resetAt) {
    rateBucket.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count += 1;
  return record.count > RATE_LIMIT_MAX;
}

function isAllowedOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) return true;

  try {
    const parsed = new URL(origin);
    return parsed.host === host;
  } catch {
    return false;
  }
}

function parseJsonBody(req) {
  if (typeof req.body === 'string') {
    if (req.body.length > MAX_BODY_CHARS) return null;
    try {
      const parsed = JSON.parse(req.body);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  }

  if (req.body && typeof req.body === 'object') {
    try {
      const serializedLength = JSON.stringify(req.body).length;
      if (serializedLength > MAX_BODY_CHARS) return null;
      return req.body;
    } catch {
      return null;
    }
  }

  return null;
}

function validateEmail(rawValue) {
  if (typeof rawValue !== 'string') return '';
  const cleaned = rawValue.trim().toLowerCase();
  if (!cleaned || cleaned.length > MAX_EMAIL_LENGTH) return '';
  if (/[\r\n]/.test(cleaned)) return '';
  if (!EMAIL_PATTERN.test(cleaned)) return '';
  return cleaned;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      ok: false,
      message: 'Metode pengiriman tidak didukung.'
    });
  }

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({
      ok: false,
      message: 'Permintaan tidak dapat diproses dari alamat asal ini.'
    });
  }

  const contentType = String(req.headers['content-type'] || '').toLowerCase();
  if (!contentType.includes('application/json')) {
    return res.status(415).json({
      ok: false,
      message: 'Format pengiriman tidak dikenali. Silakan kirim ulang melalui formulir situs.'
    });
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      ok: false,
      message: 'Terlalu banyak percobaan dalam waktu singkat. Coba lagi beberapa menit lagi.'
    });
  }

  const payload = parseJsonBody(req);
  if (!payload) {
    return res.status(400).json({
      ok: false,
      message: 'Data pendaftaran tidak valid. Periksa kembali alamat emailmu.'
    });
  }

  // Honeypot anti-bot: jika kolom tersembunyi terisi, akhiri secara tenang tanpa memproses data.
  const honeypot = typeof payload.company === 'string' ? payload.company.trim() : '';
  if (honeypot.length > 0) {
    return res.status(200).json({
      ok: true,
      message: 'Terima kasih, alamat emailmu sudah dicatat untuk kabar menu baru Brumbreo.'
    });
  }

  const email = validateEmail(payload.email);
  if (!email) {
    return res.status(400).json({
      ok: false,
      message: 'Format email belum sesuai. Gunakan alamat seperti nama@domain.com.'
    });
  }

  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
  const webhookSecret = process.env.NEWSLETTER_WEBHOOK_SECRET;

  if (webhookUrl && webhookUrl.startsWith('https://')) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (webhookSecret) {
        headers.Authorization = `Bearer ${webhookSecret}`;
      }

      const upstream = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          email,
          source: 'brumbreo-web',
          subscribedAt: new Date().toISOString()
        })
      });

      clearTimeout(timer);

      if (!upstream.ok) {
        return res.status(502).json({
          ok: false,
          message: 'Pendaftaran belum bisa diproses saat ini. Silakan coba beberapa saat lagi.'
        });
      }
    } catch {
      clearTimeout(timer);
      return res.status(502).json({
        ok: false,
        message: 'Pendaftaran belum bisa diproses saat ini. Silakan coba beberapa saat lagi.'
      });
    }
  }

  return res.status(200).json({
    ok: true,
    message: 'Terima kasih, alamat emailmu sudah dicatat untuk kabar menu baru Brumbreo.'
  });
}