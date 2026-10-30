// One-off: turns supplied reference images into web assets.
import sharp from 'sharp';
const [src, out] = process.argv.slice(2);
// Arch photograph as shown in the brand manual screenshot (reference only)
await sharp(`${src}/5.webp`).extract({ left: 54, top: 418, width: 867, height: 582 }).jpeg({ quality: 90 }).toFile(`${out}/ref/arco-referencia.jpg`);
// Wordmark → alpha mask (dark ink becomes opaque)
const { data, info } = await sharp(`${src}/1.png`).greyscale().raw().toBuffer({ resolveWithObject: true });
const rgba = Buffer.alloc(info.width * info.height * 4);
for (let i = 0; i < info.width * info.height; i++) {
  const v = data[i * info.channels];
  const a = Math.max(0, Math.min(255, Math.round(((215 - v) * 255) / (215 - 70))));
  rgba.set([30, 41, 51, a], i * 4);
}
await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().png().toFile(`${out}/brand/wordmark.png`);
console.log('ok', info);
