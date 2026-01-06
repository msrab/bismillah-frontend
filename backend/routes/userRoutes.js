const express = require('express');
const router  = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const { updateUserValidation } = require('../middlewares/UserValidation');
const userController = require('../controllers/UserController');

// Récupère le profil du user connecté
router.get('/me', verifyToken, userController.getProfile);

// Met à jour le profil du user connecté
router.put('/me', verifyToken, updateUserValidation, userController.updateProfile);

// Change la langue du user connecté
router.patch('/me/language', verifyToken, userController.changeLanguage);

// Supprime le compte du user connecté
router.delete('/me', verifyToken, userController.deleteProfile);

module.exports = router;