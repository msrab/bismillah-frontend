const express = require('express');
const router = express.Router();
const StreetController = require('../controllers/StreetController');
const verifyToken = require('../middlewares/verifyToken');
const getRole = require('../middlewares/getRole');
const { StreetValidation } = require('../middlewares/StreetValidation');

router.post('/', verifyToken, getRole(['restaurant']), StreetValidation, StreetController.createStreet);
router.get('/', StreetController.getAllStreets);
router.get('/:id', StreetController.getStreetById);

module.exports = router;