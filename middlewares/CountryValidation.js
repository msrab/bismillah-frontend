const { body, validationResult } = require('express-validator');

const CountryValidation = [
  body('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Le nom du pays est requis.'),
  body('iso_code')
    .trim()
    .escape()
    .notEmpty().withMessage('Le code ISO du pays est requis.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

module.exports = { CountryValidation };