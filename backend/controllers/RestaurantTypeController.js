const { RestaurantType, RestaurantTypeDescription, Language } = require('../models');

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