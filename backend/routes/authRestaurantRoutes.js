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
const { getFileUploadMiddleware } = require('../utils/fileUploadHelper');

// Middleware pour l'upload du logo (optionnel)
const uploadLogo = getFileUploadMiddleware('logo');


// Routes publiques (pas besoin d'être connecté)
// uploadLogo.single('logo') gère l'upload optionnel du fichier logo
router.post('/signup', uploadLogo.single('logo'), signupRestaurantValidation, authRestaurantController.signup);
router.post('/login', loginRestaurantValidation, authRestaurantController.login);
router.post('/forgot-password', forgotPasswordValidation, authRestaurantController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, authRestaurantController.resetPassword);

// Routes de vérification email (publiques)
router.get('/verify-email', authRestaurantController.verifyEmail);
router.post('/resend-verification', authRestaurantController.resendVerificationEmail);

// Routes protégées (restaurant connecté uniquement)
router.post('/logout', verifyToken, requireRole('restaurant'), authRestaurantController.logout);
router.post('/change-password', verifyToken, requireRole('restaurant'), changePasswordValidation, authRestaurantController.changePassword);

module.exports = router;
