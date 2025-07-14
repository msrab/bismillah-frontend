const express = require('express');
const router = express.Router();
const CityController = require('../controllers/CityController');
const verifyToken = require('../middlewares/verifyToken');
const getRole = require('../middlewares/getRole');
const { CityValidation } = require('../middlewares/CityValidation');

// Ajouter une ville (utilisé automatiquement lors de l'ajout d'une adresse restaurant)
router.post('/', verifyToken, getRole(['restaurant']), CityValidation, CityController.createCity);

// Récupérer toutes les villes
router.get('/', CityController.getAllCities);

// Récupérer une ville par ID
router.get('/:id', CityController.getCityById);

// Pas de routes PUT ou DELETE exposées

module.exports = router;