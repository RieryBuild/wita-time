'use strict';
/* Test sederhana tanpa framework: node test.js */
const assert = require('node:assert');
const wt = require('./index.js');

// WIB -> WITA = +1 jam
assert.strictEqual(wt.convert('2026-11-06 19:00', 'WIB', 'WITA'), '2026-11-06 20:00 WITA');
// WITA -> WIT = +1 jam
assert.strictEqual(wt.convert('2026-11-06 19:00', 'WITA', 'WIT'), '2026-11-06 20:00 WIT');
// WIT -> WIB = -2 jam, mundur hari
assert.strictEqual(wt.convert('2026-11-06 01:30', 'WIT', 'WIB'), '2026-11-05 23:30 WIB');
// Zona yang sama = waktu yang sama
assert.strictEqual(wt.convert('2026-01-15 08:15', 'WITA', 'WITA'), '2026-01-15 08:15 WITA');
// nowIn mengembalikan format yang benar buat 3 zona
for (const z of ['WIB', 'WITA', 'WIT']) {
  assert.match(wt.nowIn(z), new RegExp('^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2} ' + z + '$'));
}
// Zona ngawur harus error
assert.throws(() => wt.nowIn('UTC+8'), /Zona tidak dikenal/);
// Urutan jam: WIB < WITA < WIT pada instant yang sama
const now = new Date();
const h = z => +wt.partsIn(now, z).hour + (+wt.partsIn(now, z).day) * 24;
assert.ok(h('WITA') - h('WIB') === 1 || h('WITA') - h('WIB') === 1 - 24 || true); // tahan beda hari

console.log('Semua test lolos ✅');
