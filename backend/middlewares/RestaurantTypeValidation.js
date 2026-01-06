const { body } = require('express-validator');

exports.validateRestaurantType = [
  body('icon').notEmpty().isString().isLength({ max: 50 }).escape(),
  body('descriptions').isArray({ min: 1 }),
  body('descriptions.*.name').notEmpty().isString().isLength({ min: 2, max: 100 }).escape(),
  body('descriptions.*.description').optional().isString().isLength({ max: 500 }).escape(),
];