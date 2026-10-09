#!/usr/bin/env node
// Shrinks the Favourite Cities cover photos in public/images/cities/ in place.
//
// Usage:
//   yarn optimize:cities
//
// The custom image loader (lib/imageLoader.ts) serves local images untouched,
// so whatever is in that folder is exactly what every visitor downloads. The
// covers render at ~200px wide (2:3), so a straight-off-the-camera 8MB photo is
// pure waste. This caps each image at 800x1200 (enough for 2x/3x screens),
// fixes EXIF rotation, strips metadata and re-encodes it in its original format,
// so filenames (and the slug lookup in lib/city-covers.ts) don't change.
//
// Files that are already small enough are left alone, so it's safe to re-run
// whenever you drop new photos in.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CITY_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'cities');
const MAX_WIDTH = 800;
const MAX_HEIGHT = 1200;

const encoders = {
  '.jpg': (image) => image.jpeg({ quality: 80, mozjpeg: true }),
  '.jpeg': (image) => image.jpeg({ quality: 80, mozjpeg: true }),
  '.png': (image) => image.png({ compressionLevel: 9, palette: true }),
  '.webp': (image) => image.webp({ quality: 80 }),
};

const formatKb = (bytes) => `${Math.round(bytes / 1024)}KB`;

async function optimize(fileName) {
  const filePath = path.join(CITY_IMAGES_DIR, fileName);
  const encode = encoders[path.extname(fileName).toLowerCase()];
  if (!encode) return;

  const input = fs.readFileSync(filePath);
  const output = await encode(
    sharp(input).rotate().resize({
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      fit: 'inside',
      withoutEnlargement: true,
    })
  ).toBuffer();

  if (output.length >= input.length) {
    console.log(`  ${fileName}: already optimised (${formatKb(input.length)})`);
    return;
  }

  fs.writeFileSync(filePath, output);
  console.log(`  ${fileName}: ${formatKb(input.length)} -> ${formatKb(output.length)}`);
}

async function main() {
  const files = fs.readdirSync(CITY_IMAGES_DIR).sort();
  for (const fileName of files) {
    await optimize(fileName);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
