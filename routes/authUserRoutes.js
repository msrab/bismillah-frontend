const express = require('express');
const router  = express.Router();

const authUserController = require('../controllers/authUserController');

// POST /api/auth/user/signup - Inscription de l’utilisateur
router.post('/signup', authUserController.signup);

// POST /api/auth/user/login - Connexion de l’utilisateur
router.post('/login',  authUserController.login);

module.exports = router;
