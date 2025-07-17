const express = require('express');
const router = express.Router();
const StreetController = require('../controllers/StreetController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { StreetValidation } = require('../middlewares/StreetValidation');

router.post('/', verifyToken, requireRole('restaurant'), StreetValidation, StreetController.createStreet);
router.get('/city/:cityId', StreetController.getStreetsByCity);
router.get('/:id', StreetController.getStreetById);

module.exports = router;