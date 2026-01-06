const { Street } = require('../models');
const { createError } = require('../utils/createError');

exports.createStreet = async (req, res, next) => {
  try {
    const { name, cityId } = req.body;
    
    let street = await Street.findOne({ where: { name, cityId } });
    if (street) return res.status(201).json(street);

    street = await Street.create({ name, cityId });
    return res.status(201).json(street);
  } catch (error) {
    next(error);
  }
};

exports.getStreetsByCity = async (req, res, next) => {
  try {
    const { cityId } = req.params;
    const streets = await Street.findAll({ where: { cityId } });
    return res.status(200).json(streets);
  } catch (error) {
    next(error);
  }
};

exports.getStreetById = async (req, res, next) => {
  try {
    const street = await Street.findByPk(req.params.id);
    if (!street) 
      return next(createError('Rue non trouvée.', 404));
    return res.status(200).json(street);
  } catch (error) {
    next(error);
  }
};