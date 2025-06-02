const express = require('express');
const router  = express.Router();

const authUserCtrl      = require('../controllers/authUserController');
const authRestaurantCtrl = require('../controllers/authRestaurantController');

// Points d’accès pour User
router.post('/user/signup', authUserCtrl.signup);
router.post('/user/login',  authUserCtrl.login);

// Points d’accès pour Restaurant
router.post('/restaurant/signup', authRestaurantCtrl.signup);
router.post('/restaurant/login',  authRestaurantCtrl.login);

module.exports = router;
