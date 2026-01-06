const { Country } = require('../models');
const { createError } = require('../utils/createError');

exports.createCountry = async (req, res, next) => {
  try {
    const { name, iso_code } = req.body;
    const exist = await Country.findOne({ where: { iso_code } });
    if (exist) {
      return res.status(400).json({ errors: ['Le code ISO est déjà utilisé.'] });
    }
    const country = await Country.create({ name, iso_code });
    res.status(201).json(country);
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