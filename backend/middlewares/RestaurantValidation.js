const { body, validationResult } = require('express-validator');

const signupRestaurantValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis.')
    .isLength({ min: 2, max: 30 }).withMessage('Le nom doit contenir entre 2 et 30 caractères.')
    // Interdit deux caractères spéciaux consécutifs (tout sauf lettres, chiffres, accents, espaces)
    .not().matches(/[^a-zA-Z0-9àâäéèêëïîôùûüçÀÂÄÉÈÊËÏÎÔÙÛÜÇœŒæÆ\s]{2,}/).withMessage('Le nom ne peut pas contenir deux caractères spéciaux consécutifs.')
    // Interdit les balises script et événements JS
    .not().matches(/<script|javascript:|on\w+=/i).withMessage('Caractères non autorisés dans le nom.'),

  body('company_number')
    .trim()
    .notEmpty().withMessage('Le numéro d\'entreprise est requis.')
    .matches(/^BE\d{10}$/).withMessage("Le numéro d'entreprise doit être au format BE suivi de 10 chiffres (ex: BE0123456789)."),

  body('address_number')
    .trim()
    .notEmpty().withMessage('L\'adresse est requise.')
    .isLength({ max: 20 }).withMessage('Le numéro d\'adresse ne peut pas dépasser 20 caractères.'),

  body('email')
    .trim()
    .normalizeEmail()
    .notEmpty().withMessage('L\'email est requis.')
    .isEmail().withMessage('Email invalide.'),

  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),

  // Champs optionnels
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^(\+32|0)\d{8,9}$/).withMessage('Format de téléphone invalide (ex: +32470123456 ou 0470123456).'),

  body('website')
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: false }).withMessage('Format d\'URL invalide.'),

  body('cityName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Le nom de la ville doit contenir entre 2 et 100 caractères.'),

  body('postalCode')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\d{4}$/).withMessage('Le code postal doit contenir exactement 4 chiffres.'),

  body('streetName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Le nom de la rue doit contenir entre 2 et 200 caractères.'),

  body('certificationNumber')
    .optional({ checkFalsy: true })
    .trim()
    .isAlphanumeric().withMessage('Le numéro de certification doit être alphanumérique.')
    .isLength({ max: 15 }).withMessage('Le numéro de certification ne peut pas dépasser 15 caractères.'),

  body('customCertifierName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Le nom du certificateur doit contenir entre 2 et 100 caractères.'),

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
    .normalizeEmail()
    .notEmpty().withMessage('L\'email est requis.')
    .isEmail().withMessage('Format d\'email invalide.'),

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
    .normalizeEmail()
    .notEmpty().withMessage('L\'email est requis.')
    .isEmail().withMessage('Format d\'email invalide.'),
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
    .notEmpty().withMessage('L\'ancien mot de passe est requis.'),
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

module.exports = {
  signupRestaurantValidation,
  loginRestaurantValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation
};
