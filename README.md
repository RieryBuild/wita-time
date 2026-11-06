# 🕗 wita-time

![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen)
![Dependencies](https://img.shields.io/badge/dependencies-0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Konversi zona waktu Indonesia — **WIB (UTC+7) / WITA (UTC+8) / WIT (UTC+9)** —
tanpa library sama sekali. Cuma pakai `Intl` bawaan Node.

Kenapa? Karena jadwal online (mint NFT, event, meeting) sering diumumin pake zona
yang beda-beda, dan ngitung manual selisih 1–2 jam itu sumber salah paham klasik.

## CLI

```bash
# Jam berapa sekarang di WITA?
node index.js now WITA
# 2026-11-06 09:41:07 WITA

# Acara jam 19:00 WIB itu jam berapa WITA?
node index.js convert "2026-11-06 19:00" WIB WITA
# 2026-11-06 20:00 WITA

# Lihat jam sekarang di ketiga zona sekaligus
node index.js zones
# WIB   2026-11-06 08:41:07
# WITA  2026-11-06 09:41:07
# WIT   2026-11-06 10:41:07
```

## Library

```js
const wt = require('./index.js');

wt.convert('2026-11-06 19:00', 'WIB', 'WITA'); // '2026-11-06 20:00 WITA'
wt.nowIn('WIT');                               // jam sekarang di WIT
wt.parseWall('2026-11-06 19:00', 'WITA');      // -> Date absolut
```

## Test

```bash
npm test
```

## Lisensi

MIT
