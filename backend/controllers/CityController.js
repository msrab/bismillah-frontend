const { City, Country } = require('../models');
const { createError } = require('../utils/createError');
const { Op } = require('sequelize');

// Utilitaire pour mapper un objet City Sequelize
function mapCityToCamel(city) {
  if (!city) return null;
  return {
    id: city.id,
    name: city.name,
    postalCode: city.postal_code,
    countryId: city.countryId
  };
}

exports.createCity = async (req, res, next) => {
  try {
    const { name, postalCode, countryId } = req.body;
    let city = await City.findOne({ where: { name, countryId } });
    if (city) {
      return res.status(201).json(mapCityToCamel(city));
    }

    city = await City.create({ name, postal_code: postalCode, countryId });
    return res.status(201).json(mapCityToCamel(city));
  } catch (error) {
    next(error);
  }
};

// Recherche de villes par nom + code postal + pays (pour validation d'existence exacte)
exports.autocompleteCities = async (req, res, next) => {
  try {
    const { name, postalCode, countryId, q, countryIsoCode } = req.query;
    if (name && postalCode && countryId) {
      // Recherche exacte en base
      const city = await City.findOne({
        where: {
          name,
          postal_code: postalCode,
          countryId: parseInt(countryId, 10)
        }
      });
      if (city) {
        return res.status(200).json([mapCityToCamel(city)]);
      } else {
        return res.status(200).json([]);
      }
    }
    // Sinon, fallback autocomplétion (pour l'UI)
    if (!q || q.length < 2) {
      return res.status(200).json([]);
    }
    // On n'exclut plus les accents, tirets, espaces, apostrophes
    if (/[^\p{L}\d\s'-]/u.test(q)) {
      return res.status(200).json([]);
    }
    const fs = require('fs');
    const path = require('path');
    // Sélection dynamique du fichier selon le code ISO
    let filePath;
    if (countryIsoCode === 'BE' || !countryIsoCode) {
      filePath = path.join(__dirname, '../data/belgium-postcodes-2025.json');
    } else {
      // Ajoute ici d'autres pays si besoin
      // filePath = path.join(__dirname, `../data/${countryIsoCode.toLowerCase()}-cities.json`);
      return res.status(200).json([]); // Pas de fichier pour ce pays
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const allCities = JSON.parse(raw);
    let filtered = [];
    if (/^\d+$/.test(q)) {
      if (q.length > 4) {
        return res.status(200).json([]);
      }
      filtered = allCities.filter(city => city.postalCode.startsWith(q));
    } else if (/^[\p{L}\s'-]+$/u.test(q)) {
      // Fonction pour supprimer les accents
      const normalize = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const qLower = normalize(q.toLowerCase());
      filtered = allCities.filter(city => normalize(city.localityName.toLowerCase()).includes(qLower));
    } else {
      return res.status(200).json([]);
    }
    filtered = filtered.slice(0, 5);
    const result = filtered.map(city => ({
      id: `${city.postalCode}-${city.localityName}`,
      postalCode: city.postalCode,
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
    const mapped = cities.map(mapCityToCamel);
    return res.status(200).json(mapped);
  } catch (error) {
    next(error);
  }
};

exports.getCityById = async (req, res, next) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city) 
      return next(createError('Ville non trouvée.', 404));
    return res.status(200).json(mapCityToCamel(city));
  } catch (error) {
    next(error);
  }
};