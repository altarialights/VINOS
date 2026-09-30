// Web exports only: preserve the generated alpha, silhouette and original PNGs.
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const loadAstroDependency = createRequire(import.meta.resolve('astro/package.json'));
const sharp = loadAstroDependency('sharp');
await mkdir('public/assets/depth', { recursive: true });
for (const side of ['left', 'right']) {
  const source = `design/generated/vine-${side}-v1.png`;
  const metadata = await sharp(source).metadata();
  if (!metadata.hasAlpha) throw new Error(`Missing transparency: ${source}`);
  const stats = await sharp(source).stats();
  if (stats.channels.at(-1)?.min !== 0) throw new Error(`No fully transparent pixels: ${source}`);
  for (const [variant, size] of [['desktop', 960], ['mobile', 480]]) {
    const output = `public/assets/depth/vine-${side}-${variant}.webp`;
    const result = await sharp(source).resize(size, size, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 84, alphaQuality: 100 }).toFile(output);
    console.log(`${output}: ${result.width}x${result.height}, ${result.size} bytes, alpha preserved`);
  }
}
