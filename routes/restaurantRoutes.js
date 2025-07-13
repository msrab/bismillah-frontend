const express = require('express');
const router  = express.Router();

const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const restaurantController = require('../controllers/restaurantController');

// Récupère le profil du restaurant connecté
router.get('/profil', verifyToken, restaurantController.getProfile);

// Met à jour le profil du restaurant connecté
router.put('/profil', verifyToken, restaurantController.updateProfile);

// Désactive le profil du restaurant connecté
router.put('/profil/disable', verifyToken, restaurantController.disable);

// Réactive le profil du restaurant connecté
router.put('/profil/enable', verifyToken, restaurantController.enable);

// Supprime le compte du restaurant connecté
router.delete('/profil', verifyToken, restaurantController.deleteProfile);

// Liste paginée de tous les restaurants (sans mot de passe)
router.get('/', verifyToken, restaurantController.listRestaurants);

// Récupère un restaurant par son ID
router.get('/:id', verifyToken, restaurantController.getRestaurantById);


module.exports = router;
