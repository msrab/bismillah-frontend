const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { addLanguageValidation, removeLanguageValidation, setMainLanguageValidation } = require('../middlewares/RestaurantLanguageValidation');
const controller = require('../controllers/RestaurantLanguageController');

// Toutes les routes sont protégées (restaurant connecté uniquement)

// Lister toutes les langues du restaurant
router.get('/', verifyToken, requireRole('restaurant'), controller.listLanguages);

// Ajouter une langue (optionnellement main)
router.post('/', verifyToken, requireRole('restaurant'), addLanguageValidation, controller.addLanguage);

// Supprimer une langue
router.delete('/:languageId', verifyToken, requireRole('restaurant'), removeLanguageValidation, controller.removeLanguage);

// Changer la langue principale
router.patch('/main', verifyToken, requireRole('restaurant'), setMainLanguageValidation, controller.setMainLanguage);

module.exports = router;