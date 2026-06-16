// Generiert die PWA-PNG-Icons aus dem SVG-Quellmark.
// Aufruf: node scripts/generate-icons.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = 'public';
mkdirSync(OUT, { recursive: true });

const STROKE = `<g fill="none" stroke="#fbf9f3" stroke-width="30" stroke-linecap="round">
  <path d="M120 196v120"/>
  <path d="M168 164v184"/>
  <path d="M392 196v120"/>
  <path d="M344 164v184"/>
  <path d="M168 256h176"/>
</g>`;

const GRAD = `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#c8704c"/>
  <stop offset="1" stop-color="#a4512f"/>
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
