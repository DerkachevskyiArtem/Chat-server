const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { PUBLIC_FOLDER_PATH } = require('../../constants');

const imagesPath = path.resolve(PUBLIC_FOLDER_PATH, 'images');

if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const imagesUpload = multer({ storage });

module.exports.imagesUpload = imagesUpload;
