const express = require('express');
const router  = express.Router();

const authRestaurantController = require('../controllers/authRestaurantController');

// POST /api/auth/restaurant/signup - Inscription du restaurant
router.post('/signup', authRestaurantController.signup);

// POST /api/auth/restaurant/login - Connexion du restaurant
router.post('/login',  authRestaurantController.login);

module.exports = router;
