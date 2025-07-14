const { body, validationResult } = require('express-validator');

const signupRestaurantValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis.'),

  body('company_number')
    .trim()
    .notEmpty().withMessage('Le numéro d’entreprise est requis.')
    .isAlphanumeric().withMessage('Le numéro d’entreprise ne doit contenir que lettres et chiffres.'),

  body('address_number')
    .trim()
    .notEmpty().withMessage('L’adresse est requise.'),

  body('email')
    .trim()
    .notEmpty().withMessage('L’email est requis.')
    .isEmail().withMessage('Email invalide.'),

  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

const loginRestaurantValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('L’email est requis.')
    .isEmail().withMessage('Format d’email invalide.'),

  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('L’email est requis.')
    .isEmail().withMessage('Format d’email invalide.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

const resetPasswordValidation = [
  body('token')
    .notEmpty().withMessage('Le token est requis.'),
  body('newPassword')
    .notEmpty().withMessage('Le nouveau mot de passe est requis.')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

const changePasswordValidation = [
  body('oldPassword')
    .notEmpty().withMessage('L’ancien mot de passe est requis.'),
  body('newPassword')
    .notEmpty().withMessage('Le nouveau mot de passe est requis.')
    .isLength({ min: 8 }).withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];