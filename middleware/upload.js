// CONCEPT: MULTER CONFIG - decide karo file kaha save hogi, naam kya hoga,
// kaunsi file types allow hain, aur max size kya hai.

const multer = require('multer');
const path = require('path');

// CONCEPT: diskStorage - file ko seedha server ke file system me save karta hai
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // yahan files save hongi
  },
  filename: (req, file, cb) => {
    // CONCEPT: unique naam banana zaroori hai, warna 2 users same naam
    // ki file upload karein to ek doosre ko overwrite kar degi.
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// CONCEPT: FILE FILTER - sirf images allow karo, baaki reject
function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true); // accept
  } else {
    cb(new Error('Only image files (jpeg, png, webp, gif) are allowed'), false); // reject
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

module.exports = upload; 
