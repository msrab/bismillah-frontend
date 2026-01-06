const { body, validationResult } = require('express-validator');

exports.validateCategoryMenu = [
  body('icon').notEmpty().isString().isLength({ max: 50 }).escape(),
  body('isValidated').optional().isBoolean(),
  body('descriptions').isArray({ min: 1 }),
  body('descriptions.*.name').notEmpty().isString().isLength({ min: 2, max: 100 }).escape(),
  body('descriptions.*.description').optional().isString().isLength({ max: 500 }).escape(),
  body('descriptions.*.languageId').notEmpty().isInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

// Validateur pour une description seule (pour les routes /:categoryMenuId/descriptions)
exports.validateCategoryMenuDescription = [
  body('languageId')
    .notEmpty().withMessage('languageId requis.')
    .isInt().withMessage('languageId doit être un entier.'),
  body('name')
    .notEmpty().withMessage('Le nom est requis.')
    .isString().withMessage('Le nom doit être une chaîne de caractères.')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit faire entre 2 et 100 caractères.'),
  body('description')
    .optional()
    .isString().withMessage('La description doit être une chaîne de caractères.')
    .isLength({ max: 500 }).withMessage('La description ne doit pas dépasser 500 caractères.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];