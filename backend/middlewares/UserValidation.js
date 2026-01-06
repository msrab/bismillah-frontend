const { body, validationResult } = require('express-validator');

// Validation pour l'inscription (signup)
const signupUserValidation = [
  body('login')
    .trim().escape()
    .notEmpty().withMessage('Le login est requis.')
    .isAlphanumeric().withMessage('Le login ne doit contenir que lettres et chiffres.'),
  body('email')
    .trim().escape()
    .notEmpty().withMessage("L’email est requis.")
    .isEmail().withMessage('Format d’email invalide.'),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),
  body('address_number')
    .trim().escape()
    .notEmpty().withMessage('L’adresse (address_number) est requise.'),
  body('streetId')
    .notEmpty().withMessage('La rue (streetId) est requise.')
    .isInt().withMessage('streetId doit être un entier.'),
  body('languageId')
    .notEmpty().withMessage('La langue (languageId) est requise.')
    .isInt().withMessage('languageId doit être un entier.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

// Validation pour la mise à jour du profil utilisateur (update)
// languageId NE DOIT PAS être modifiable ici
const updateUserValidation = [
  body('login')
    .optional()
    .trim().escape()
    .isAlphanumeric().withMessage('Le login ne doit contenir que lettres et chiffres.'),
  body('email')
    .optional()
    .trim().escape()
    .isEmail().withMessage('Format d’email invalide.'),
  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),
  body('address_number')
    .optional()
    .trim().escape(),
  body('streetId')
    .optional()
    .isInt().withMessage('streetId doit être un entier.'),
  body('firstname')
    .optional()
    .trim().escape(),
  body('surname')
    .optional()
    .trim().escape(),
  body('phone')
    .optional()
    .trim().escape(),
  body('avatar')
    .optional()
    .trim().escape(),
  body('languageId')
    .not().exists().withMessage('La langue ne peut pas être modifiée ici.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

const loginUserValidation = [
  (req, res, next) => {
    if (!req.body.login && !req.body.email) {
      return res.status(400).json({ error: 'Login ou email requis.' });
    }
    next();
  },
  body('email')
    .if(body('email').exists())
    .trim().escape()
    .notEmpty().withMessage("L’email est requis.")
    .isEmail().withMessage('Format d’email invalide.'),
  body('login')
    .if(body('login').exists())
    .trim().escape()
    .notEmpty().withMessage('Login ou email requis.'),
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

module.exports = {
  signupUserValidation,
  updateUserValidation,
  loginUserValidation
};