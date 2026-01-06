const express = require('express');
const router = express.Router();

const certifierController = require('../controllers/CertifierController');

// Routes publiques - Liste des certificateurs pour le formulaire d'inscription
router.get('/', certifierController.getAllCertifiers);
router.get('/:id', certifierController.getCertifierById);

module.exports = router;
