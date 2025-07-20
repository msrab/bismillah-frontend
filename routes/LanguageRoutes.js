const express = require('express');
const router = express.Router();
const LanguageController = require('../controllers/LanguageController');

// Liste toutes les langues
router.get('/', LanguageController.getAll);

// Récupère une langue par id
router.get('/:id', LanguageController.getOne);

// Crée une langue
router.post('/', LanguageController.create);

// Modifie une langue
router.put('/:id', LanguageController.update);

module.exports = router;