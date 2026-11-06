'use strict';
/* Contoh pemakaian wita-time sebagai library: node examples.js */
const wt = require('./index.js');

// 1. Jam sekarang di tiga zona
console.log('Sekarang:');
for (const z of ['WIB', 'WITA', 'WIT']) console.log(' ', z.padEnd(5), wt.nowIn(z));

// 2. Jadwal event diumumin dalam WIB, dibaca dalam WITA & WIT
const event = '2026-11-08 19:00';
console.log('\nEvent', event, 'WIB sama dengan:');
console.log(' ', wt.convert(event, 'WIB', 'WITA'));
console.log(' ', wt.convert(event, 'WIB', 'WIT'));

// 3. Parse jam dinding jadi Date absolut
const d = wt.parseWall('2026-11-08 19:00', 'WITA');
console.log('\nParse "2026-11-08 19:00" WITA ->', d.toISOString(), '(UTC)');
