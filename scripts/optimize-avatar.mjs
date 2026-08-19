/**
 * Resizes public/avatar.jpg to what the page actually renders.
 *
 * Square, because the sidebar displays the photo as a circle -- a portrait crop
 * squeezed into a round frame loses the sides of the face. Cropped from the top
 * so the head stays in frame rather than being centred on the torso.
 *
 * Run after replacing the photo:  npm run optimize:avatar
 *
 * The original is never touched -- this only rewrites the copy in public/.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const FILE = 'public/avatar.jpg';

// ~3.5x the 208px circle: crisp on retina, still fine as an og:image.
const TARGET_WIDTH = 720;
const TARGET_HEIGHT = 720;

/**
 * Where the face sits in the SOURCE image, as fractions of width and height.
 * sharp's `position: 'top'` only anchors vertically and leaves the horizontal
 * alone, which left the face sitting right of centre in the circle. Naming the
 * focal point explicitly lets us frame it properly.
 */
const FOCUS = { x: 0.585, y: 0.315 };

/** Crop side length, as a fraction of the source's shorter edge. */
const FRAME = 0.8;

/**
 * Where the face should land inside the crop. Slightly above centre: in a round
 * frame, a face centred vertically reads as sinking toward the bottom.
 */
const PLACE_Y = 0.42;

if (!existsSync(FILE)) {
  console.error(`No ${FILE} found. Add your headshot first (see scripts/add-assets.ps1).`);
  process.exit(1);
}

const input = readFileSync(FILE);
const before = await sharp(input).metadata();

if (before.width <= TARGET_WIDTH && before.height <= TARGET_HEIGHT) {
  console.log(
    `${FILE} is already ${before.width}x${before.height} — no larger than ${TARGET_WIDTH}x${TARGET_HEIGHT}. Skipping.`
  );
  process.exit(0);
}

// Bake in EXIF orientation first, so the crop maths works on the pixels as
// they will actually be displayed rather than as they are stored.
const upright = await sharp(input).rotate().toBuffer();
const { width: srcW, height: srcH } = await sharp(upright).metadata();

const side = Math.round(Math.min(srcW, srcH) * FRAME);
const clamp = (value, max) => Math.max(0, Math.min(Math.round(value), max));

const left = clamp(FOCUS.x * srcW - side / 2, srcW - side);
const top = clamp(FOCUS.y * srcH - side * PLACE_Y, srcH - side);

// Read into a buffer first: sharp cannot stream a file onto itself.
const output = await sharp(upright)
  .extract({ left, top, width: side, height: side })
  .resize(TARGET_WIDTH, TARGET_HEIGHT)
  .jpeg({ quality: 80, progressive: true, mozjpeg: true })
  .toBuffer();

writeFileSync(FILE, output);

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const saved = Math.round((1 - output.length / input.length) * 100);

console.log(
  `${FILE}: ${before.width}x${before.height} ${kb(input.length)}  ->  ` +
    `${TARGET_WIDTH}x${TARGET_HEIGHT} ${kb(output.length)}  (${saved}% smaller)`
);
console.log(`  crop ${side}x${side} at (${left}, ${top}) from ${srcW}x${srcH}`);
console.log(
  `  face lands at ${(((FOCUS.x * srcW - left) / side) * 100).toFixed(0)}% across, ` +
    `${(((FOCUS.y * srcH - top) / side) * 100).toFixed(0)}% down`
);
