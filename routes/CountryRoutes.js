const express = require('express');
const router = express.Router();
const CountryController = require('../controllers/CountryController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { CountryValidation } = require('../middlewares/CountryValidation');

// Ajouter un pays (utilisé automatiquement lors de l'ajout d'une adresse restaurant)
router.post('/', verifyToken, requireRole('restaurant'), CountryValidation, CountryController.createCountry);

// Récupérer tous les pays
router.get('/', CountryController.getAllCountries);

// Récupérer un pays par ID
router.get('/:id', CountryController.getCountryById);

// Pas de routes PUT ou DELETE exposées

module.exports = router;