const { City, Country } = require('../models');
const { createError } = require('../utils/createError');
const { Op } = require('sequelize');

exports.createCity = async (req, res, next) => {
  try {
    const { name, postal_code, countryId } = req.body;
    let city = await City.findOne({ where: { name, countryId } });
    if (city) return res.status(201).json(city);

    city = await City.create({ name, postal_code, countryId });
    return res.status(201).json(city);
  } catch (error) {
    next(error);
  }
};

// Recherche de villes par nom ou code postal (autocomplétion)
exports.searchCities = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(200).json([]);
    }
    // Si q contient des caractères spéciaux ou est alphanumérique, on ne cherche pas
    if (/[^a-zA-Z0-9]/.test(q)) {
      return res.status(200).json([]);
    }
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../data/belgium-postcodes-2025.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const allCities = JSON.parse(raw);
    let filtered = [];
    if (/^\d+$/.test(q)) {
      // Numérique : recherche code postal uniquement si 1 à 4 chiffres
      if (q.length > 4) {
        return res.status(200).json([]);
      }
      filtered = allCities.filter(city => city.postalCode.startsWith(q));
    } else if (/^[a-zA-Z]+$/.test(q)) {
      // Alphabétique : recherche nom de ville
      const qLower = q.toLowerCase();
      filtered = allCities.filter(city => city.localityName.toLowerCase().includes(qLower));
    } else {
      // Alphanumérique ou autre : pas de résultat
      return res.status(200).json([]);
    }
    filtered = filtered.slice(0, 5);
    const result = filtered.map(city => ({
      id: `${city.postalCode}-${city.localityName}`,
      postal_code: city.postalCode,
      name: city.localityName,
    }));
    return res.status(200).json(result);
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