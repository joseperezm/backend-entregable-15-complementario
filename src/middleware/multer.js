const multer = require('multer');
const path = require('path');
const fs = require('fs');

const directories = [
  path.join(__dirname, '..', 'public/uploads'),
  path.join(__dirname, '..', 'public/uploads/profiles'),
  path.join(__dirname, '..', 'public/uploads/products'),
  path.join(__dirname, '..', 'uploads/documents')
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads';
    if (file.fieldname === 'profiles') {
      folder = 'public/uploads/profiles';
    } else if (file.fieldname === 'products') {
      folder = 'public/uploads/products';
    } else if (file.fieldname === 'documents') {
      folder = 'uploads/documents';
    }
    cb(null, path.join(__dirname, '..', folder));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

module.exports = upload;