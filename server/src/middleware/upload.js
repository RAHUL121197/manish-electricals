const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_ROOT = path.join(__dirname, '../../uploads');
const dirs = ['profiles', 'projects', 'gallery'];
dirs.forEach((d) => {
  const full = path.join(UPLOAD_ROOT, d);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

function storageFor(subfolder) {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(UPLOAD_ROOT, subfolder)),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, unique);
    },
  });
}

const imageFileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed.'));
  }
  cb(null, true);
};

const uploadProfile = multer({ storage: storageFor('profiles'), fileFilter: imageFileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadProject = multer({ storage: storageFor('projects'), fileFilter: imageFileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadGallery = multer({ storage: storageFor('gallery'), fileFilter: imageFileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { uploadProfile, uploadProject, uploadGallery };
