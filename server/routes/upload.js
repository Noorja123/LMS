const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `doc-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Convert Windows path separators to standard URL separators
  const safePath = req.file.path.replace(/\\/g, '/');
  res.json({ fileUrl: `/${safePath}` });
});

module.exports = router;
