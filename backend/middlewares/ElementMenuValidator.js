const { body, validationResult } = require('express-validator');

const validateElementMenu = [
  body('image')
    .optional()
    .isString().withMessage('image doit être une chaîne de caractères.'),
  body('price')
    .notEmpty().withMessage('Le prix est requis.')
    .isDecimal().withMessage('Le prix doit être un nombre décimal.'),
  body('categoryMenuId')
    .notEmpty().withMessage('categoryMenuId requis.')
    .isInt().withMessage('categoryMenuId doit être un entier.'),
  body('restaurantId')
    .notEmpty().withMessage('restaurantId requis.')
    .isInt().withMessage('restaurantId doit être un entier.'),
  body('descriptions')
    .isArray({ min: 1 }).withMessage('descriptions doit être un tableau non vide.'),
  body('descriptions.*.languageId')
    .notEmpty().withMessage('languageId requis.')
    .isInt().withMessage('languageId doit être un entier.'),
  body('descriptions.*.name')
    .notEmpty().withMessage('Le nom est requis.')
    .isString().withMessage('Le nom doit être une chaîne de caractères.')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit faire entre 2 et 100 caractères.'),
  body('descriptions.*.description')
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

// Optionnel : validateur pour une description seule
const validateElementMenuDescription = [
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

module.exports = { validateElementMenu, validateElementMenuDescription };