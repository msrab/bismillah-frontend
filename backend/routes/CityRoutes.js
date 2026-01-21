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


router.post('/', CityValidation, CityController.createCity);



module.exports = router;