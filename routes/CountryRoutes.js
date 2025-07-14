const express = require('express');
const router = express.Router();
const CountryController = require('../controllers/CountryController');
const verifyToken = require('../middlewares/verifyToken');
const getRole = require('../middlewares/getRole');

// Ajouter un pays (utilisé automatiquement lors de l'ajout d'une adresse restaurant)
router.post('/', verifyToken, getRole(['restaurant']), CountryController.createCountry);

// Récupérer tous les pays
router.get('/', CountryController.getAllCountries);

// Récupérer un pays par ID
router.get('/:id', CountryController.getCountryById);

// Pas de routes PUT ou DELETE exposées

module.exports = router;