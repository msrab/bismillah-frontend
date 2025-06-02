const express = require('express');
const router  = express.Router();

const { verifyToken } = require('./middlewares/auth');
const restaurantController = require('./controllers/restaurantController');

// Récupère le profil du restaurant connecté
router.get('/me', verifyToken, restaurantController.getProfile);

// Met à jour le profil du restaurant connecté
// Corps JSON autorisé : { name?, company_number?, address_number?, phone?, email?, logo? }
router.put('/me', verifyToken, restaurantController.updateProfile);

// Supprime le compte du restaurant connecté
router.delete('/me', verifyToken, restaurantController.deleteProfile);

module.exports = router;
