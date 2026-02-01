const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_PATH = process.env.UPLOAD_PATH || './uploads';
fs.mkdirSync(UPLOAD_PATH, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_PATH),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /\.(jpg|jpeg|png)$/i;
  if (allowed.test(path.extname(file.originalname))) cb(null, true);
  else cb(new Error('Only jpg/jpeg/png files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // limit 5MB

// Upload endpoint
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl, filename: req.file.filename });
});

// List uploaded files (returns array of { filename, imageUrl })
router.get('/', (req, res) => {
  try {
    const files = fs.readdirSync(UPLOAD_PATH).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
    const list = files.map(f => ({ filename: f, imageUrl: `/uploads/${f}` }));
    res.json(list.reverse()); // newest first
  } catch (err) {
    res.status(500).json({ message: 'Cannot read uploads', error: err.message });
  }
});

// Hero endpoints: store a simple hero.json in upload folder
const HERO_FILE = path.join(UPLOAD_PATH, 'hero.json');

router.get('/hero', (req, res) => {
  try {
    if (!fs.existsSync(HERO_FILE)) return res.json({ imageUrl: null });
    const data = JSON.parse(fs.readFileSync(HERO_FILE, 'utf-8'));
    return res.json({ imageUrl: data.imageUrl || null });
  } catch (err) {
    res.status(500).json({ message: 'Cannot read hero', error: err.message });
  }
});

router.post('/hero', express.json(), (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ message: 'imageUrl is required' });
    fs.writeFileSync(HERO_FILE, JSON.stringify({ imageUrl }));
    return res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Cannot write hero', error: err.message });
  }
});

module.exports = router;
