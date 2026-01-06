const express = require('express');
const router = express.Router();
const ElementMenuController = require('../controllers/ElementMenuController');
const { validateElementMenu, validateElementMenuDescription } = require('../middlewares/ElementMenuValidator');
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

// Routes publiques (lecture)
router.get('/', ElementMenuController.findAll);
router.get('/:id', ElementMenuController.findById);

// Routes protégées (restaurant connecté uniquement)
router.post('/', verifyToken, requireRole('restaurant'), validateElementMenu, ElementMenuController.create);
router.put('/:id', verifyToken, requireRole('restaurant'), validateElementMenu, ElementMenuController.update);
router.delete('/:id', verifyToken, requireRole('restaurant'), ElementMenuController.delete);

module.exports = router;