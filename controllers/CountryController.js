const { Country } = require('../models');

exports.createCountry = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Le nom du pays est requis.' });

    let country = await Country.findOne({ where: { name } });
    if (country) return res.status(200).json(country);

    country = await Country.create({ name });
    return res.status(201).json(country);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.findAll();
    return res.status(200).json(countries);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.getCountryById = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) return res.status(404).json({ message: 'Pays non trouvé.' });
    return res.status(200).json(country);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};