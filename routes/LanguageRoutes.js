const express = require('express');
const router = express.Router();
const LanguageController = require('../controllers/LanguageController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

// Routes publiques (lecture)
router.get('/', LanguageController.getAll);
router.get('/:id', LanguageController.getOne);

// Routes protégées (admin uniquement)
//router.post('/', verifyToken, requireRole('admin'), LanguageController.create);
//router.put('/:id', verifyToken, requireRole('admin'), LanguageController.update);

module.exports = router;