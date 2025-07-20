const { body, param, validationResult } = require('express-validator');

const addLanguageValidation = [
  body('languageId')
    .notEmpty().withMessage('languageId requis.')
    .isInt().withMessage('languageId doit être un entier.'),
  body('main')
    .optional()
    .isBoolean().withMessage('main doit être un booléen.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

const removeLanguageValidation = [
  param('languageId')
    .notEmpty().withMessage('languageId requis.')
    .isInt().withMessage('languageId doit être un entier.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

const setMainLanguageValidation = [
  body('languageId')
    .notEmpty().withMessage('languageId requis.')
    .isInt().withMessage('languageId doit être un entier.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

module.exports = {
  addLanguageValidation,
  removeLanguageValidation,
  setMainLanguageValidation
};