const express = require('express');
const router = express.Router();
const ElementMenuController = require('../controllers/ElementMenuController');
const { validateElementMenu, validateElementMenuDescription } = require('../middlewares/ElementMenuValidator');

// CRUD ElementMenu
router.post('/', validateElementMenu, ElementMenuController.create);
router.get('/', ElementMenuController.findAll);
router.get('/:id', ElementMenuController.findById);
router.put('/:id', validateElementMenu, ElementMenuController.update);
router.delete('/:id', ElementMenuController.delete);

// (Optionnel) CRUD pour les descriptions d'un élément menu
router.post(
  '/:elementMenuId/descriptions',
  validateElementMenuDescription,
  ElementMenuController.addDescription
);
router.put(
  '/:elementMenuId/descriptions/:descriptionId',
  validateElementMenuDescription,
  ElementMenuController.updateDescription
);
router.delete(
  '/:elementMenuId/descriptions/:descriptionId',
  ElementMenuController.deleteDescription
);

module.exports = router;