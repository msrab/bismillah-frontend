const express = require('express');
const router = express.Router();
const CityController = require('../controllers/CityController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { CityValidation } = require('../middlewares/CityValidation');

// Ajouter une ville (utilisé automatiquement lors de l'ajout d'une adresse restaurant)
router.post('/', verifyToken, requireRole('restaurant'), CityValidation, CityController.createCity);

// Récupérer toutes les villes d'un pays
router.get('/country/:countryId', CityController.getCitiesByCountry);

// Récupérer une ville par ID
router.get('/:id', CityController.getCityById);

// Pas de routes PUT ou DELETE exposées

module.exports = router;