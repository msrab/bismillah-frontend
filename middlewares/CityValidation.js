const { body, validationResult } = require('express-validator');

const CityValidation = [
  body('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Le nom de la ville est requis.'),
  body('countryId')
    .isInt().withMessage('countryId doit être un entier.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

module.exports = { CityValidation };