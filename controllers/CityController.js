const { City } = require('../models');

exports.createCity = async (req, res) => {
  try {
    const { name, countryId } = req.body;
    // La validation des champs est déjà faite par le middleware
    let city = await City.findOne({ where: { name, countryId } });
    if (city) return res.status(200).json(city);

    city = await City.create({ name, countryId });
    return res.status(201).json(city);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.findAll();
    return res.status(200).json(cities);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.getCityById = async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city) return res.status(404).json({ message: 'Ville non trouvée.' });
    return res.status(200).json(city);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};