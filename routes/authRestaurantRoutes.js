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


router.post('/signup', signupRestaurantValidation, authRestaurantController.signup);
router.post('/login', loginRestaurantValidation, authRestaurantController.login);
router.post('/logout', verifyToken, authRestaurantController.logout);
router.post('/reset-password', resetPasswordValidation, authRestaurantController.resetPassword);
router.post('/forgot-password', forgotPasswordValidation, authRestaurantController.forgotPassword);
router.post('/change-password', verifyToken, changePasswordValidation, authRestaurantController.changePassword);

module.exports = router;
