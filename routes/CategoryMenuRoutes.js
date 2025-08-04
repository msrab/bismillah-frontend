const express = require('express');
const router = express.Router();
const categoryMenuController = require('../controllers/CategoryMenuController');
const { validateCategoryMenu } = require('../middlewares/CategoryMenuValidation');
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

// Routes publiques (tout le monde peut voir les catégories)
router.get('/', categoryMenuController.getAll);
router.get('/:id', categoryMenuController.getById);

// Routes protégées (restaurant connecté uniquement pour la création)
router.post('/', verifyToken, requireRole('restaurant'), validateCategoryMenu, categoryMenuController.create);

// Pas de PUT/DELETE ici (admin uniquement, à placer dans un autre fichier si besoin)

module.exports = router;