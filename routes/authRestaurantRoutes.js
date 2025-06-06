const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const authRestaurantController = require('../controllers/authRestaurantController');

// 1) Middleware de validation pour /signup (restaurant)
const signupRestaurantValidation = [
  // name obligatoire
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis.'),

  // company_number obligatoire, alphanumérique
  body('company_number')
    .trim()
    .notEmpty().withMessage('Le numéro d’entreprise est requis.')
    .isAlphanumeric().withMessage('Le numéro d’entreprise ne doit contenir que lettres et chiffres.'),

  // address_number obligatoire
  body('address_number')
    .trim()
    .notEmpty().withMessage('L’adresse est requise.'),

  // email obligatoire & format
  // -> on donne *toujours* le même message "Email invalide." quand c’est manquant ou mal formé
  body('email')
    .trim()
    .notEmpty().withMessage('Email invalide.')
    .isEmail().withMessage('Email invalide.'),

  // password obligatoire & min 8
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Renvoie le tableau exact de messages (order peut correspondre à l’ordre déclenché)
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

router.post('/signup', signupRestaurantValidation, authRestaurantController.signup);

// 2) Middleware de validation pour /login (restaurant)
// On autorise maintenant un restaurant à se connecter AVEC company_number OU avec email
const loginRestaurantValidation = [
  // Si ni company_number ni email fournis => même logique que pour les users
  (req, res, next) => {
    if (!req.body.company_number && !req.body.email) {
      return res.status(400).json({ error: 'Le numéro d’entreprise est requis.' });
    }
    next();
  },

  // Si on fournit un email, on doit vérifier qu’il est bien formé
  body('email')
    .if(body('email').exists())
    .isEmail().withMessage('Email invalide.'),

  // Si on fournit un company_number, il ne doit pas être vide
  body('company_number')
    .if(body('company_number').exists())
    .notEmpty().withMessage('Le numéro d’entreprise est requis.'),

  // password obligatoire
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

router.post('/login', loginRestaurantValidation, authRestaurantController.login);

module.exports = router;
