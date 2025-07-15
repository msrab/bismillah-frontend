const { City } = require('../models');
const { createError } = require('../utils/createError');

exports.createCity = async (req, res, next) => {
  try {
    const { name, countryId } = req.body;
    // La validation des champs est déjà faite par le middleware
    let city = await City.findOne({ where: { name, countryId } });
    if (city) return res.status(200).json(city);

    city = await City.create({ name, countryId });
    return res.status(201).json(city);
  } catch (error) {
    next(error);
  }
};

exports.getAllCities = async (req, res, next) => {
  try {
    const cities = await City.findAll();
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