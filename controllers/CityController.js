const { City } = require('../models');
const { createError } = require('../utils/createError');

exports.createCity = async (req, res, next) => {
  try {
    const { name, postal_code, countryId } = req.body;
    let city = await City.findOne({ where: { name, countryId } });
    if (city) return res.status(200).json(city);

    city = await City.create({ name, postal_code, countryId });
    return res.status(201).json(city);
  } catch (error) {
    next(error);
  }
};

exports.getCitiesByCountry = async (req, res, next) => {
  try {
    const { countryId } = req.params;
    const cities = await City.findAll({ where: { countryId } });
    return res.status(200).json(cities);
  } catch (error) {
    next(error);
  }
};

exports.getCityById = async (req, res, next) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city) 
      return next(createError('Ville non trouvée.', 404));
    return res.status(200).json(city);
  } catch (error) {
    next(error);
  }
};