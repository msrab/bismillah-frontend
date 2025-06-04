// routes/authRestaurantRoutes.js
const express = require('express');
const router = express.Router();

const authRestaurantController = require('../controllers/authRestaurantController');
const {
  signupRestaurantRules,
  loginRestaurantRules,
  validateRestaurant
} = require('../validators/restaurantValidators');

router.post(
  '/signup',
  signupRestaurantRules,
  validateRestaurant,
  authRestaurantController.signup
);

router.post(
  '/login',
  loginRestaurantRules,
  validateRestaurant,
  authRestaurantController.login
);

module.exports = router;
