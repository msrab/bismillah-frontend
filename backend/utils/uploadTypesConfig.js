const path = require('path');


const slugify = require('./slugify');


const uploadTypesConfig = {
  logo: {
    allowedTypes: ['image/png', 'image/jpeg'],
    maxSize: 2 * 1024 * 1024, // 2 Mo
    fileName: (file, req) => {
      const name = req.body?.name || req.restaurant?.name || 'restaurant';
      const safeName = slugify(name);
      return `logo-${safeName}-${Date.now()}${path.extname(file.originalname)}`;
    },
    getUploadPath: (req) => {
      const name = req.body?.name || req.restaurant?.name || 'restaurant';
      const safeName = slugify(name);
      return `restaurant/${safeName}`;
    }
  }
  // ...d'autres types plus tard
};

module.exports = uploadTypesConfig;
