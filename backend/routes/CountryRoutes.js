const express = require('express');
const router = express.Router();
const CountryController = require('../controllers/CountryController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { CountryValidation } = require('../middlewares/CountryValidation');

// Routes publiques (lecture)
router.get('/', CountryController.getAllCountries);
router.get('/:id', CountryController.getCountryById);

// Routes protégées (création par restaurant connecté uniquement)
router.post('/', verifyToken, requireRole('restaurant'), CountryValidation, CountryController.createCountry);

// Pas de routes PUT ou DELETE exposées

module.exports = router;