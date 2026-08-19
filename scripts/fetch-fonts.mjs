/**
 * Downloads the site's webfonts into public/fonts and prints the @font-face
 * rules to paste into src/styles/global.css.
 *
 * Run:  npm run fetch:fonts
 *
 * Self-hosted rather than linked from Google: it removes a third-party request
 * from the critical path, eliminates the flash of fallback text, and keeps the
 * page from leaking visitor IPs to another origin.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Asking with a modern browser UA is what makes Google serve woff2 rather than
// older, much larger formats.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36';

const FAMILIES = [
  { css: 'Cormorant+Garamond:wght@500;600;700', label: 'cormorant' },
  { css: 'Jost:wght@300;400;500;600', label: 'jost' },
];

const outDir = join('public', 'fonts');
mkdirSync(outDir, { recursive: true });

const faces = [];

for (const family of FAMILIES) {
  const url = `https://fonts.googleapis.com/css2?family=${family.css}&display=swap`;
  const css = await (await fetch(url, { headers: { 'User-Agent': UA } })).text();

  // Google emits one @font-face block per unicode subset. Keep latin and
  // latin-ext only — the rest is weight the site will never render.
  const blocks = css.split('/*').filter((b) => /latin/.test(b.split('*/')[0] ?? ''));

  for (const block of blocks) {
    const subset = block.split('*/')[0].trim();
    if (subset !== 'latin' && subset !== 'latin-ext') continue;

    const weight = block.match(/font-weight:\s*(\d+)/)?.[1];
    const style = block.match(/font-style:\s*(\w+)/)?.[1] ?? 'normal';
    const src = block.match(/src:\s*url\((https:\/\/[^)]+\.woff2)\)/)?.[1];
    const range = block.match(/unicode-range:\s*([^;]+);/)?.[1];
    if (!weight || !src) continue;

    const filename = `${family.label}-${weight}-${subset}.woff2`;
    const bytes = Buffer.from(await (await fetch(src)).arrayBuffer());
    writeFileSync(join(outDir, filename), bytes);

    const name = block.match(/font-family:\s*'([^']+)'/)?.[1];
    faces.push({ name, weight, style, filename, range, size: bytes.length });
    console.log(`  ${filename.padEnd(34)} ${(bytes.length / 1024).toFixed(1)} KB`);
  }
}

console.log('\n--- @font-face rules ---\n');
for (const f of faces) {
  console.log(`@font-face {
  font-family: '${f.name}';
  font-style: ${f.style};
  font-weight: ${f.weight};
  font-display: swap;
  src: url('/fonts/${f.filename}') format('woff2');
  unicode-range: ${f.range};
}`);
}

const total = faces.reduce((sum, f) => sum + f.size, 0);
console.log(`\n${faces.length} files, ${(total / 1024).toFixed(1)} KB total`);
