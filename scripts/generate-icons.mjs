// Generiert die PWA-PNG-Icons aus dem SVG-Quellmark.
// Aufruf: node scripts/generate-icons.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = 'public';
mkdirSync(OUT, { recursive: true });

// Hantel-Marke, mittig auf 512er-Grid (symmetrisch um 256).
const STROKE = `<g fill="none" stroke="#ffffff" stroke-width="34" stroke-linecap="round">
  <path d="M196 256h120"/>
  <path d="M196 212v88"/>
  <path d="M316 212v88"/>
  <path d="M156 228v56"/>
  <path d="M356 228v56"/>
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
