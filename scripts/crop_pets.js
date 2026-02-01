const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const map = [
  { src: path.resolve(__dirname, '..', '..', 'frontend', 'image', '1.jpg'), dest: path.resolve(__dirname, '..', '..', 'frontend', 'public', 'pets', 'dog.jpg') },
  { src: path.resolve(__dirname, '..', '..', 'frontend', 'image', '2.jpg'), dest: path.resolve(__dirname, '..', '..', 'frontend', 'public', 'pets', 'cat.jpg') },
  { src: path.resolve(__dirname, '..', '..', 'frontend', 'image', '3.jpg'), dest: path.resolve(__dirname, '..', '..', 'frontend', 'public', 'pets', 'bird.jpg') },
];

async function ensureDirExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

(async () => {
  console.log('Starting crop of pet images...');
  for (const item of map) {
    try {
      if (!fs.existsSync(item.src)) {
        console.warn('Source not found:', item.src);
        continue;
      }
      await ensureDirExists(item.dest);
      const img = await Jimp.read(item.src);
      // cover will resize and crop to exactly 400x400
      img.cover(400, 400);
      // set JPEG quality 85
      img.quality(85);
      await img.writeAsync(item.dest);
      console.log('Wrote:', item.dest);
    } catch (err) {
      console.error('Error processing', item.src, err && err.message ? err.message : err);
    }
  }
  console.log('Done.');
})();
