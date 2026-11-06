#!/usr/bin/env node
/*
 * wita-time — konversi zona waktu Indonesia (WIB / WITA / WIT) tanpa library.
 *
 * Library:
 *   const wt = require('./index.js');
 *   wt.convert('2026-11-06 19:00', 'WIB', 'WITA'); // '2026-11-06 20:00 WITA'
 *   wt.nowIn('WITA');                              // '2026-11-06 09:41:07 WITA'
 *
 * CLI:
 *   node index.js now WITA
 *   node index.js convert "2026-11-06 19:00" WIB WITA
 *   node index.js zones
 */
'use strict';

const ZONES = {
  WIB: 'Asia/Jakarta',   // UTC+7
  WITA: 'Asia/Makassar', // UTC+8
  WIT: 'Asia/Jayapura',  // UTC+9
};

function zoneName(zone) {
  const z = String(zone || 'WITA').toUpperCase();
  if (!ZONES[z]) throw new Error('Zona tidak dikenal: ' + zone + ' (pilihan: WIB, WITA, WIT)');
  return z;
}

function partsIn(date, zone) {
  const dtf = new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONES[zoneName(zone)],
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const p = {};
  for (const part of dtf.formatToParts(date)) p[part.type] = part.value;
  if (p.hour === '24') p.hour = '00';
  return p;
}

function pad(n) { return String(n).padStart(2, '0'); }

function formatIn(date, zone, withSeconds = true) {
  const p = partsIn(date, zone);
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}` + (withSeconds ? `:${p.second}` : '') + ' ' + zoneName(zone);
}

function nowIn(zone) {
  return formatIn(new Date(), zone);
}

/* Offset (menit) zona terhadap UTC pada tanggal tertentu, dihitung dari Intl. */
function offsetMinutes(date, zone) {
  const p = partsIn(date, zone);
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return Math.round((asUTC - Math.floor(date.getTime() / 1000) * 1000) / 60000);
}

/* Parse 'YYYY-MM-DD HH:mm' sebagai jam dinding di sebuah zona -> Date absolut. */
function parseWall(text, zone) {
  const m = String(text).trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) throw new Error('Format waktu harus "YYYY-MM-DD HH:mm", contoh: 2026-11-06 19:00');
  const [, y, mo, d, h, mi, s] = m;
  const guess = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +(s || 0)));
  const off = offsetMinutes(guess, zone);
  return new Date(guess.getTime() - off * 60000);
}

function convert(text, fromZone, toZone) {
  const date = parseWall(text, fromZone);
  return formatIn(date, toZone, String(text).split(/[: ]/).length > 3);
}

module.exports = { ZONES, nowIn, convert, parseWall, formatIn, partsIn };

if (require.main === module) {
  const [cmd, a, b, c] = process.argv.slice(2);
  try {
    if (cmd === 'now') {
      console.log(nowIn(a || 'WITA'));
    } else if (cmd === 'convert') {
      if (!a || !b || !c) throw new Error('Pakai: node index.js convert "YYYY-MM-DD HH:mm" WIB WITA');
      console.log(convert(a, b, c));
    } else if (cmd === 'zones') {
      const now = new Date();
      for (const z of Object.keys(ZONES)) console.log(z.padEnd(5), formatIn(now, z));
    } else {
      console.log('wita-time — konversi zona waktu Indonesia\n\nPerintah:\n  node index.js now [WIB|WITA|WIT]\n  node index.js convert "2026-11-06 19:00" WIB WITA\n  node index.js zones');
    }
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}
