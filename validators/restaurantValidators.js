// validators/restaurantValidators.js
const { body, validationResult } = require('express-validator');

/**
 * Validation pour POST /api/auth/restaurant/signup
 * - name           : chaîne non vide
 * - company_number : chaîne non vide (unique)
 * - address_number : chaîne non vide
 * - phone          : facultatif, si fourni doit être une chaîne
 * - email          : email valide
 * - password       : ≥ 8 caractères
 * - logo           : facultatif, si fourni doit être une URL
 * - nb_followers   : facultatif, si fourni doit être un entier ≥ 0
 */
const signupRestaurantRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis.'),
  body('company_number')
    .trim()
    .notEmpty().withMessage('Le numéro d’entreprise est requis.'),
  body('address_number')
    .trim()
    .notEmpty().withMessage('L’adresse est requise.'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .isString().withMessage('phone doit être une chaîne.'),
  body('email')
    .isEmail().withMessage('Email invalide.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),
  body('logo')
    .optional({ nullable: true, checkFalsy: true })
    .isURL().withMessage('logo doit être une URL.'),
  body('nb_followers')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0 }).withMessage('nb_followers doit être un entier ≥ 0.')
];

/**
 * Validation pour POST /api/auth/restaurant/login
 * - email    : email valide
 * - password : non vide
 */
const loginRestaurantRules = [
  body('email')
    .isEmail().withMessage('Email invalide.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.')
];

/**
 * Middleware final pour renvoyer 400 si erreurs
 */
const validateRestaurant = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
  next();
};

module.exports = {
  signupRestaurantRules,
  loginRestaurantRules,
  validateRestaurant
};
