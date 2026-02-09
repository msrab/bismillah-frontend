const { RestaurantType, RestaurantTypeDescription, Language } = require('../models');
const { Op } = require('sequelize');

// Fonction de validation pour descriptions
function validateDescriptions(descriptions) {
  if (!Array.isArray(descriptions)) return 'descriptions doit être un tableau';
  if (descriptions.length === 0) return 'descriptions ne doit pas être vide';
  const ids = new Set();
  for (const desc of descriptions) {
    if (!desc || typeof desc !== 'object') return 'Chaque description doit être un objet';
    if (typeof desc.languageId !== 'number') return 'languageId manquant ou invalide';
    if (ids.has(desc.languageId)) return 'Doublon de languageId';
    ids.add(desc.languageId);
    if (typeof desc.name !== 'string' || !desc.name.trim()) return 'name manquant ou vide';
    if (typeof desc.description !== 'string' || !desc.description.trim()) return 'description manquant ou vide';
  }
  return null;
}

module.exports = {
  // Rechercher les types de restaurant validés par nom (autocomplete)
  async search(req, res, next) {
    try {
      const { q, languageId = 1 } = req.query;
      if (!q || q.trim().length < 1) {
        return res.json([]);
      }
      const searchTerm = q.trim();
      
      // Recherche les types validés dont le nom contient le terme
      const types = await RestaurantType.findAll({
        where: { isValidated: true },
        include: [{
          model: RestaurantTypeDescription,
          as: 'RestaurantTypeDescriptions',
          where: {
            languageId: parseInt(languageId),
            name: { [Op.like]: `%${searchTerm}%` }
          },
          include: [{ model: Language, as: 'language' }]
        }],
        limit: 10
      });
      
      // Formater la réponse
      const results = types.map(type => {
        const desc = type.RestaurantTypeDescriptions[0];
        return {
          id: type.id,
          icon: type.icon,
          name: desc ? desc.name : `Type ${type.id}`,
          description: desc ? desc.description : ''
        };
      });
      
      res.json(results);
    } catch (err) {
      next(err);
    }
  },

  // Créer un nouveau type de restaurant (non validé par défaut lors de l'inscription)
  async createSimple(req, res, next) {
    try {
      const { name, languageId = 1 } = req.body;
      
      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Le nom est requis.' });
      }
      
      const trimmedName = name.trim();
      
      // Vérifier si un type avec ce nom existe déjà (validé ou non)
      const existingDesc = await RestaurantTypeDescription.findOne({
        where: {
          languageId: parseInt(languageId),
          name: { [Op.like]: trimmedName }
        }
      });
      
      if (existingDesc) {
        // Retourner le type existant
        const existingType = await RestaurantType.findByPk(existingDesc.restaurantTypeId, {
          include: [{
            model: RestaurantTypeDescription,
            as: 'RestaurantTypeDescriptions',
            where: { languageId: parseInt(languageId) }
          }]
        });
        return res.json({
          id: existingType.id,
          icon: existingType.icon,
          name: trimmedName,
          isValidated: existingType.isValidated,
          isNew: false
        });
      }
      
      // Créer le nouveau type avec isValidated = false
      const newType = await RestaurantType.create({
        icon: '🍽️', // Icône par défaut
        isValidated: false
      });
      
      // Créer la description
      await RestaurantTypeDescription.create({
        restaurantTypeId: newType.id,
        languageId: parseInt(languageId),
        name: trimmedName,
        description: `Type de restaurant : ${trimmedName}`
      });
      
      res.status(201).json({
        id: newType.id,
        icon: newType.icon,
        name: trimmedName,
        isValidated: false,
        isNew: true,
        message: 'Type créé, en attente de validation par l\'administration.'
      });
    } catch (err) {
      next(err);
    }
  },

  // Créer un type de restaurant avec ses traductions
  async create(req, res, next) {
    try {
      const { icon, descriptions } = req.body;
      if (typeof icon !== 'string' || !icon.trim()) {
        return res.status(400).json({ error: 'icon manquant ou invalide' });
      }
      const descError = validateDescriptions(descriptions);
      if (descError) {
        return res.status(400).json({ error: descError });
      }
      const type = await RestaurantType.create({ icon });
      for (const desc of descriptions) {
        await RestaurantTypeDescription.create({ ...desc, restaurantTypeId: type.id });
      }
      // On retourne l'objet complet pour les tests
      const createdType = await RestaurantType.findByPk(type.id, {
        include: [{ model: RestaurantTypeDescription, as: 'RestaurantTypeDescriptions', include: [{ model: Language, as: 'language' }] }]
      });
      res.status(201).json({
        id: createdType.id,
        icon: createdType.icon,
        descriptions: createdType.RestaurantTypeDescriptions,
        message: 'Type créé'
      });
    } catch (err) {
      next(err);
    }
  },

  // Récupérer tous les types (optionnel: filtrer par langue)
  async getAll(req, res, next) {
    try {
      const { languageId } = req.query;
      const include = [{
        model: RestaurantTypeDescription,
        as: 'RestaurantTypeDescriptions',
        include: [{ model: Language, as: 'language' }]
      }];
      if (languageId) {
        include[0].where = { languageId };
      }
      const types = await RestaurantType.findAll({ include });
      res.json(types);
    } catch (err) {
      next(err);
    }
  },

  // Récupérer un type par id
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const type = await RestaurantType.findByPk(id, {
        include: [{ model: RestaurantTypeDescription, as: 'RestaurantTypeDescriptions', include: [{ model: Language, as: 'language' }] }]
      });
      if (!type) return res.status(404).json({ error: 'Type non trouvé' });
      res.json(type);
    } catch (err) {
      next(err);
    }
  },

  // Modifier un type (icon et/ou descriptions)
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { icon, descriptions, isValidated } = req.body;
      const type = await RestaurantType.findByPk(id);
      if (!type) return res.status(404).json({ error: 'Type non trouvé' });

      if (typeof icon !== 'string' || !icon.trim()) {
        return res.status(400).json({ error: 'icon manquant ou invalide' });
      }
      const descError = validateDescriptions(descriptions);
      if (descError) {
        return res.status(400).json({ error: descError });
      }

      await type.update({ icon, isValidated: !!isValidated });

      // On supprime les anciennes descriptions et on insère les nouvelles pour éviter les doublons
      await RestaurantTypeDescription.destroy({ where: { restaurantTypeId: id } });
      for (const desc of descriptions) {
        await RestaurantTypeDescription.create({ ...desc, restaurantTypeId: id });
      }

      const updatedType = await RestaurantType.findByPk(id, {
        include: [{ model: RestaurantTypeDescription, as: 'RestaurantTypeDescriptions', include: [{ model: Language, as: 'language' }] }]
      });

      res.json({
        id: updatedType.id,
        icon: updatedType.icon,
        isValidated: updatedType.isValidated,
        descriptions: updatedType.RestaurantTypeDescriptions,
        message: 'Type mis à jour'
      });
    } catch (err) {
      next(err);
    }
  },

  // Supprimer un type
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await RestaurantTypeDescription.destroy({ where: { restaurantTypeId: id } });
      const deleted = await RestaurantType.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ error: 'Type non trouvé' });
      res.json({ message: 'Type supprimé' });
    } catch (err) {
      next(err);
    }
  }
};