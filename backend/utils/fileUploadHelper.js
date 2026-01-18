const uploadsFolder = 'uploads';
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');



const uploadTypesConfig = require('./uploadTypesConfig');

/**
 * Helper général pour l'upload de fichiers
 * @param {string} type - type d'upload (ex: 'logo')
 * @returns {multer} middleware multer configuré
 */
function getFileUploadMiddleware(type) {
  const config = uploadTypesConfig[type];
  if (!config) throw new Error(`Type d'upload inconnu: ${type}`);


  const {
    allowedTypes = ['image/png', 'image/jpeg'],
    maxSize = 2 * 1024 * 1024,
    fileName = (file, req) => uuidv4() + path.extname(file.originalname),
    getUploadPath = (req) => 'uploads'
  } = config;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', uploadsFolder, getUploadPath(req));
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const filename = fileName(file, req);
      cb(null, filename);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'), false);
    }
  };

  return multer({ storage, fileFilter, limits: { fileSize: maxSize } });
}

module.exports = { getFileUploadMiddleware };
