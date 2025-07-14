const express = require('express');
const router  = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const userController = require('../controllers/UserController');

// Récupère le profil du user connecté
// Exige un token JWT dans Authorization: Bearer <token>
router.get('/me', verifyToken, userController.getProfile);

// Met à jour le profil du user connecté
// Corps JSON autorisé : { login?, email?, address_number?, firstname?, surname?, phone?, avatar? }
router.put('/me', verifyToken, userController.updateProfile);

// Supprime le compte du user connecté
router.delete('/me', verifyToken, userController.deleteProfile);

module.exports = router;
