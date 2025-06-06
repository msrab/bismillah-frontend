// backend/routes/authUserRoutes.js

const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const authUserController = require('../controllers/authUserController');

/**
 * Middleware de validation pour POST /api/auth/user/signup
 * - Vérifie que login, email, password et address_number sont fournis et bien formés.
 */
const signupValidation = [
  body('login')
    .trim()
    .notEmpty().withMessage('Le login est requis.')
    .isAlphanumeric().withMessage('Le login ne doit contenir que lettres et chiffres.'),
  body('email')
    .trim()
    .notEmpty().withMessage("L’email est requis.")
    .isEmail().withMessage('Format d’email invalide.'),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),
  body('address_number')
    .notEmpty().withMessage('L’adresse (address_number) est requise.'),
  // Si besoin, on peut ajouter d’autres validations :
  // body('firstname').optional().isAlpha().withMessage('Prénom invalide.'),
  // body('phone').optional().isMobilePhone('fr-FR').withMessage('Numéro de téléphone invalide.'),

  // Enfin, on renvoie la liste d’erreurs si la validation échoue
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Retourne un tableau de messages d’erreur
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

/**
 * Route POST /api/auth/user/signup
 * - signupValidation s’assure que le payload contient bien login, email, password, address_number correctement formés.
 * - authUserController.signup gère la création en base et renvoie 201 / 409 / 500 selon les cas.
 */
router.post(
  '/signup',
  signupValidation,
  authUserController.signup
);

/**
 * Middleware de validation pour POST /api/auth/user/login
 * - On exige soit “login” soit “email” (sinon on renvoie { error: 'Login ou email requis.' })
 * - Si “email” est présent, on vérifie son format
 * - On exige “password”
 */
const loginValidation = [
  // Si ni login ni email fourni → erreur
  (req, res, next) => {
    if (!req.body.login && !req.body.email) {
      return res.status(400).json({ error: 'Login ou email requis.' });
    }
    next();
  },

  // Si email fourni, il doit être au format valide
  body('email')
    .if(body('email').exists())
    .notEmpty().withMessage("L’email est requis.")
    .isEmail().withMessage('Format d’email invalide.'),

  // Si login fourni, on n’accepte que l’exigence “non vide” (le format alphanumérique est déjà géré en signup)
  body('login')
    .if(body('login').exists())
    .notEmpty().withMessage('Login ou email requis.'),

  // On exige le mot de passe
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis.'),

  // Enfin, on renvoie la liste d’erreurs si la validation échoue
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Pour garder la même structure que la validation signup, on renvoie un tableau “errors”
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

/**
 * Route POST /api/auth/user/login
 * - loginValidation s’assure que le payload contient bien login OU email + password correctement formés.
 * - authUserController.login gère la recherche en base, la comparaison du mot de passe et la génération du JWT.
 */
router.post(
  '/login',
  loginValidation,
  authUserController.login
);

module.exports = router;
