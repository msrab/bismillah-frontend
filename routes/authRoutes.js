const express = require('express');
const router  = express.Router();
const authCtrl= require('../controllers/authController');

// USERS
router.post('/user/signup',  authCtrl.signupUser);
router.post('/user/login',   authCtrl.loginUser);

// RESTAURANTS
router.post('/restaurant/signup', authCtrl.signupRestaurant);
router.post('/restaurant/login',  authCtrl.loginRestaurant);

module.exports = router;
