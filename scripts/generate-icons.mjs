// Generiert die PWA-PNG-Icons aus dem SVG-Quellmark.
// Aufruf: node scripts/generate-icons.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = 'public';
mkdirSync(OUT, { recursive: true });

// Herz-mit-Pulslinie-Marke: 24er-Grid-Pfade, mittig auf 512er-Grid skaliert.
const STROKE = `<g transform="translate(88 88) scale(14)" fill="none" stroke="#ffffff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  <path d="M3.4 12H9l.7-1.4 2 4.6 2-7 1.5 3.8h5.4"/>
</g>`;

const GRAD = `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#5468e0"/>
  <stop offset="1" stop-color="#3344b8"/>
</linearGradient></defs>`;

// Abgerundete Variante (transparente Ecken) — purpose "any"
const rounded = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  ${GRAD}<rect width="512" height="512" rx="112" fill="url(#bg)"/>${STROKE}
</svg>`;

// Vollflächige Variante (ohne transparente Ecken) — purpose "maskable" + Apple
const square = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  ${GRAD}<rect width="512" height="512" fill="url(#bg)"/>${STROKE}
</svg>`;

async function render(svg, size, file) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(`${OUT}/${file}`);
  console.log('✓', file);
}

await render(rounded, 192, 'pwa-192.png');
await render(rounded, 512, 'pwa-512.png');
await render(square, 512, 'pwa-maskable-512.png');
await render(square, 180, 'apple-touch-icon.png');

console.log('Icons generiert.');
