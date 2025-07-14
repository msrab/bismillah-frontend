const { Country } = require('../models');
const createError = require('../utils/createError');

exports.createCountry = async (req, res, next) => {
  try {
    const { name } = req.body;
    // La validation du champ 'name' est déjà faite par le middleware
    let country = await Country.findOne({ where: { name } });
    if (country) return res.status(200).json(country);

    country = await Country.create({ name });
    return res.status(201).json(country);
  } catch (error) {
    next(error);
  }
};

exports.getAllCountries = async (req, res, next) => {
  try {
    const countries = await Country.findAll();
    return res.status(200).json(countries);
  } catch (error) {
    next(error);
  }
};

exports.getCountryById = async (req, res, next) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) 
      return next(createError('Pays non trouvé.', 404));
    return res.status(200).json(country);
  } catch (error) {
    next(error);
  }
};