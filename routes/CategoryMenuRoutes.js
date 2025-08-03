const express = require('express');
const router = express.Router();
const categoryMenuController = require('../controllers/CategoryMenuController');
const { validateCategoryMenu, validateCategoryMenuDescription } = require('../middlewares/CategoryMenuValidation');

// CRUD routes avec validation sur create et update
router.get('/', categoryMenuController.getAll);
router.get('/:id', categoryMenuController.getById);
router.post('/', validateCategoryMenu, categoryMenuController.create);
router.put('/:id', validateCategoryMenu, categoryMenuController.update);
router.delete('/:id', categoryMenuController.delete);

// Routes pour les descriptions d'une catégorie menu
router.post(
  '/:categoryMenuId/descriptions',
  validateCategoryMenuDescription,
  categoryMenuController.addDescription
);
router.put(
  '/:categoryMenuId/descriptions/:descriptionId',
  validateCategoryMenuDescription,
  categoryMenuController.updateDescription
);
router.delete(
  '/:categoryMenuId/descriptions/:descriptionId',
  categoryMenuController.deleteDescription
);

module.exports = router;