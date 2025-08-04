const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantTypeController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { validateRestaurantType } = require('../middlewares/RestaurantTypeValidation');
const { requireRole } = require('../middlewares/roleMiddleware');

// Routes publiques (lecture)
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Routes protégées (création : restaurant OU admin connecté)
router.post(
  '/',
  verifyToken,
  requireRole('restaurant', 'admin'),
  validateRestaurantType,
  controller.create
);

// Routes protégées (modification/suppression : admin uniquement)
//router.put('/:id', verifyToken, requireRole('admin'), validateRestaurantType, controller.update);
//router.delete('/:id', verifyToken, requireRole('admin'), controller.delete);

module.exports = router;