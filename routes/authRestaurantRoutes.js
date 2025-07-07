const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const authRestaurantController = require('../controllers/authRestaurantController');

/**
 * POST /api/auth/restaurant/signup
 * Création d’un nouveau restaurant
 */
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


/**
 * POST /api/auth/restaurant/login
 * Connexion par email + password
 */
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

router.post('/signup', signupRestaurantValidation, authRestaurantController.signup);
router.post('/login', loginRestaurantValidation, authRestaurantController.login);

module.exports = router;
