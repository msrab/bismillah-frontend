const express = require('express');
const router  = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const restaurantController = require('../controllers/restaurantController');
const { requireRole }  = require('../middlewares/roleMiddleware');

// Routes protégées (restaurant connecté uniquement)
router.get('/profil', verifyToken, requireRole('restaurant'), restaurantController.getProfile);
router.put('/profil', verifyToken, requireRole('restaurant'), restaurantController.updateProfile);
router.put('/profil/disable', verifyToken, requireRole('restaurant'), restaurantController.disable);
router.put('/profil/enable', verifyToken, requireRole('restaurant'), restaurantController.enable);
router.delete('/profil', verifyToken, requireRole('restaurant'), restaurantController.deleteProfile);
router.post('/:id/languages', verifyToken, requireRole('restaurant'), restaurantController.addLanguages);
router.delete('/:id/languages/:languageId', verifyToken, requireRole('restaurant'), restaurantController.removeLanguage);
router.patch('/:id/languages/main', verifyToken, requireRole('restaurant'), restaurantController.setMainLanguage);

// Routes protégées (user connecté uniquement)
router.get('/', restaurantController.listRestaurants);
router.get('/:id', restaurantController.getRestaurantById);


module.exports = router;
