const express = require('express');
const router  = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const restaurantController = require('../controllers/restaurantController');
const { requireRole }  = require('../middlewares/roleMiddleware');

// Récupère le profil du restaurant connecté
router.get('/profil', verifyToken, requireRole('restaurant'), restaurantController.getProfile);

// Met à jour le profil du restaurant connecté
router.put('/profil', verifyToken, requireRole('restaurant'), restaurantController.updateProfile);

// Désactive le profil du restaurant connecté
router.put('/profil/disable', verifyToken, requireRole('restaurant'), restaurantController.disable);

// Réactive le profil du restaurant connecté
router.put('/profil/enable', verifyToken, requireRole('restaurant'), restaurantController.enable);

// Supprime le compte du restaurant connecté
router.delete('/profil', verifyToken, requireRole('restaurant'), restaurantController.deleteProfile);

// Ajoute des langues à un restaurant
router.post('/:id/languages', verifyToken, requireRole('restaurant'), restaurantController.addLanguages);

// Supprime une langue d'un restaurant
router.delete('/:id/languages/:languageId', verifyToken, requireRole('restaurant'), restaurantController.removeLanguage);

// Modifie la langue principale d'un restaurant
router.patch('/:id/languages/main', verifyToken, requireRole('restaurant'), restaurantController.setMainLanguage);

// Liste paginée de tous les restaurants (sans mot de passe)
router.get('/', verifyToken, requireRole('user'), restaurantController.listRestaurants);

// Récupère un restaurant par son ID
router.get('/:id', verifyToken, requireRole('user'), restaurantController.getRestaurantById);


module.exports = router;
