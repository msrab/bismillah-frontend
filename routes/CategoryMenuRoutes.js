const express = require('express');
const router = express.Router();
const categoryMenuController = require('../controllers/CategoryMenuController');
const { validateCategoryMenu } = require('../middlewares/CategoryMenuValidation');

// CRUD routes avec validation sur create et update
router.get('/', categoryMenuController.getAll);
router.get('/:id', categoryMenuController.getById);
router.post('/', validateCategoryMenu, categoryMenuController.create);
router.put('/:id', validateCategoryMenu, categoryMenuController.update);
router.delete('/:id', categoryMenuController.delete);

module.exports = router;