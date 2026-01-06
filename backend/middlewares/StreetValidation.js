const { body, validationResult } = require('express-validator');

const StreetValidation = [
  body('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Le nom de la rue est requis.'),
  body('cityId')
    .isInt().withMessage('cityId doit être un entier.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

module.exports = { StreetValidation };