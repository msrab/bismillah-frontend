const express = require('express');
const router  = express.Router();
const authRestaurantController = require('../controllers/authRestaurantController');
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  signupRestaurantValidation,
  loginRestaurantValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation
} = require('../middlewares/RestaurantValidation');
const { requireRole } = require('../middlewares/roleMiddleware');


// Routes publiques (pas besoin d'être connecté)
router.post('/signup', signupRestaurantValidation, authRestaurantController.signup);
router.post('/login', loginRestaurantValidation, authRestaurantController.login);
router.post('/forgot-password', forgotPasswordValidation, authRestaurantController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, authRestaurantController.resetPassword);

// Routes protégées (restaurant connecté uniquement)
router.post('/logout', verifyToken, requireRole('restaurant'), authRestaurantController.logout);
router.post('/change-password', verifyToken, requireRole('restaurant'), changePasswordValidation, authRestaurantController.changePassword);

module.exports = router;
