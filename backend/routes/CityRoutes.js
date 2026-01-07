const express = require('express');
const router = express.Router();
const CityController = require('../controllers/CityController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { CityValidation } = require('../middlewares/CityValidation');

// Routes publiques (lecture)
router.get('/search', CityController.searchCities); // Autocomplétion
router.get('/country/:countryId', CityController.getCitiesByCountry);
router.get('/:id', CityController.getCityById);

// Routes protégées (création par restaurant connecté uniquement)
router.post('/', verifyToken, requireRole('restaurant'), CityValidation, CityController.createCity);

// Pas de routes PUT ou DELETE exposées

module.exports = router;