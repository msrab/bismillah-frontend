const { Street } = require('../models');

exports.createStreet = async (req, res) => {
  try {
    const { name, cityId } = req.body;
    if (!name || !cityId) return res.status(400).json({ message: 'Nom et cityId requis.' });

    let street = await Street.findOne({ where: { name, cityId } });
    if (street) return res.status(200).json(street);

    street = await Street.create({ name, cityId });
    return res.status(201).json(street);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.getAllStreets = async (req, res) => {
  try {
    const streets = await Street.findAll();
    return res.status(200).json(streets);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

exports.getStreetById = async (req, res) => {
  try {
    const street = await Street.findByPk(req.params.id);
    if (!street) return res.status(404).json({ message: 'Rue non trouvée.' });
    return res.status(200).json(street);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};