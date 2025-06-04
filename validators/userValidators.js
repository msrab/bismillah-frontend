// validators/userValidators.js
const { body, validationResult } = require('express-validator');

/**
 * Middlewares de validation pour le signup utilisateur
 * - login    : chaîne non vide
 * - email    : email valide
 * - password : au moins 8 caractères
 */
const signupUserRules = [
  body('login')
    .trim()
    .notEmpty().withMessage('Le login est requis.'),
  body('email')
    .isEmail().withMessage('Email invalide.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),
  // address_number, firstname, surname, phone, avatar sont facultatifs
  body('address_number')
    .optional({ nullable: true, checkFalsy: true })
    .isString().withMessage('address_number doit être une chaîne.'),
  body('firstname')
    .optional({ nullable: true, checkFalsy: true })
    .isString().withMessage('firstname doit être une chaîne.'),
  body('surname')
    .optional({ nullable: true, checkFalsy: true })
    .isString().withMessage('surname doit être une chaîne.'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .isString().withMessage('phone doit être une chaîne.'),
  body('avatar')
    .optional({ nullable: true, checkFalsy: true })
    .isURL().withMessage('avatar doit être une URL valide.'),
];

/**
 * Middlewares de validation pour le login utilisateur
 * On autorise soit login, soit email, mais pas les deux vides
 * - login    : chaîne non vide si fournie
 * - email    : email valide si fourni
 * - password : non vide
 */
const loginUserRules = [
  body('login')
    .optional({ nullable: true, checkFalsy: true })
    .isString().withMessage('login doit être une chaîne.'),
  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail().withMessage('Email invalide.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.'),
  // Custom validator : au moins login ou email doit être présent
  (req, res, next) => {
    if (!req.body.login && !req.body.email) {
      return res.status(400).json({ error: 'Login ou email requis.' });
    }
    next();
  }
];

/**
 * Middleware final pour vérifier le résultat de la validation
 */
const validateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // On renvoie le premier message d’erreur (ou tous, selon votre préférence)
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
  next();
};

module.exports = {
  signupUserRules,
  loginUserRules,
  validateUser
};
