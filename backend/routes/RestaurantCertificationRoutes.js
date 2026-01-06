const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const restaurantCertificationController = require('../controllers/RestaurantCertificationController');

// Routes protégées (restaurant connecté)
router.get('/my', verifyToken, requireRole('restaurant'), restaurantCertificationController.getMyCertifications);
router.post('/', verifyToken, requireRole('restaurant'), restaurantCertificationController.addCertification);
router.put('/:id', verifyToken, requireRole('restaurant'), restaurantCertificationController.updateCertification);
router.delete('/:id', verifyToken, requireRole('restaurant'), restaurantCertificationController.deleteCertification);

// Route publique - Voir les certifications d'un restaurant
router.get('/restaurant/:restaurantId', restaurantCertificationController.getCertificationsByRestaurant);

// TODO: Route admin - À sécuriser avec rôle admin
// Actuellement commentée car le système de rôles admin n'est pas encore implémenté
// Pour l'activer : 
// 1. Ajouter un champ 'role' (enum: 'user', 'admin') à la table users
// 2. Créer un middleware requireRole('admin') 
// 3. Décommenter la ligne ci-dessous
// router.put('/:id/verify', verifyToken, requireRole('admin'), restaurantCertificationController.verifyCertification);

module.exports = router;
