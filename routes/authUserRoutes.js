const express = require('express');
const router  = express.Router();
const { signupUserValidation, loginUserValidation } = require('../middlewares/UserValidation');
const authUserController = require('../controllers/authUserController');

// Inscription
router.post('/signup', signupUserValidation, authUserController.signup);

// Connexion
router.post('/login', loginUserValidation, authUserController.login);

module.exports = router;