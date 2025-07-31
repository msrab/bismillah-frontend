const express = require('express');
const router = express.Router();
const categoryMenuController = require('../controllers/categoryMenuController');

// CRUD routes
router.get('/', categoryMenuController.getAll);
router.get('/:id', categoryMenuController.getById);
router.post('/', categoryMenuController.create);
router.put('/:id', categoryMenuController.update);
router.delete('/:id', categoryMenuController.delete);

module.exports