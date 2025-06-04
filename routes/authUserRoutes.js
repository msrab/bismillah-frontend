// routes/authUserRoutes.js
const express = require('express');
const router = express.Router();

const authUserController = require('../controllers/authUserController');
const {
  signupUserRules,
  loginUserRules,
  validateUser
} = require('../validators/userValidators');

router.post(
  '/signup',
  signupUserRules,  // d’abord valider le corps
  validateUser,     // puis, si ok, on passe au controller
  authUserController.signup
);

router.post(
  '/login',
  loginUserRules,
  validateUser,
  authUserController.login
);

module.exports = router;
