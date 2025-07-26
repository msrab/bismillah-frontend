const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurantTypeController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { validateRestaurantType } = require('../middlewares/RestaurantTypeValidation');
const { requireRole } = require('../middlewares/roleMiddleware');

// GET: tout le monde
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// POST: restaurant OU admin connecté
router.post(
  '/',
  verifyToken,
  requireRole('restaurant', 'admin'),
  validateRestaurantType,
  controller.create
);

// PUT/DELETE: seulement admin
router.put('/:id', verifyToken, requireRole('admin'), validateRestaurantType, controller.update);
router.delete('/:id', verifyToken, requireRole('admin'), controller.delete);

module.exports = router;