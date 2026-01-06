const express = require('express');
const router = express.Router();
const StreetController = require('../controllers/StreetController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { StreetValidation } = require('../middlewares/StreetValidation');

// Routes publiques (lecture)
router.get('/city/:cityId', StreetController.getStreetsByCity);
router.get('/:id', StreetController.getStreetById);

// Routes protégées (création par restaurant connecté uniquement)
router.post('/', verifyToken, requireRole('restaurant'), StreetValidation, StreetController.createStreet);

module.exports = router;