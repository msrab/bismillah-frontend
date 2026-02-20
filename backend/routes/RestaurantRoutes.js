const express = require('express');
const router  = express.Router();
const { Restaurant, RestaurantCertification } = require('../models');

// Vérification unicité numéro d'entreprise
router.get('/check-company-number', async (req, res) => {
	const { company_number } = req.query;
	if (!company_number) {
		return res.status(400).json({ error: "Numéro d'entreprise manquant" });
	}
	// Optionnel : validation format côté route (défense en profondeur)
	if (!/^BE\d{10}$/.test(company_number)) {
		return res.status(400).json({ error: "Format de numéro d'entreprise invalide (ex: BE0123456789)" });
	}
	const exists = await Restaurant.findOne({ where: { company_number } });
	return res.json({ exists: !!exists });
});

// Vérification unicité adresse (streetId + numéro)
router.get('/check-address', async (req, res) => {
	const { streetId, address_number } = req.query;
	if (!streetId || !address_number) return res.status(400).json({ exists: false, error: 'Adresse incomplète' });
	const exists = await Restaurant.findOne({ where: { streetId, address_number } });
	res.json({ exists: !!exists });
});
// Vérification unicité numéro de certification
router.get('/check-certification-number', async (req, res) => {
	const { certificationNumber } = req.query;
	if (!certificationNumber) return res.status(400).json({ exists: false, error: 'Numéro manquant' });
	const exists = await RestaurantCertification.findOne({ where: { certification_number: certificationNumber } });
	res.json({ exists: !!exists });
});
// Vérification unicité email
router.get('/check-email', async (req, res) => {
	const { email } = req.query;
	if (!email) return res.status(400).json({ exists: false, error: 'Email manquant' });
	const exists = await Restaurant.findOne({ where: { email } });
	res.json({ exists: !!exists });
});

// Vérification unicité slug
const { isSlugTaken } = require('../utils/slugify');
router.get('/check-slug', async (req, res) => {
	const { slug } = req.query;
	if (!slug) return res.status(400).json({ available: false, error: 'Slug manquant' });
	const available = !(await isSlugTaken(slug, Restaurant));
	res.json({ available });
});

const { verifyToken } = require('../middlewares/authMiddleware');
const restaurantController = require('../controllers/RestaurantController');
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
