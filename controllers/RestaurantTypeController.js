const { RestaurantType, RestaurantTypeDescription, Language } = require('../models');

module.exports = {
  // Créer un type de restaurant avec ses traductions
  async create(req, res, next) {
    try {
      const { icon, descriptions } = req.body; // descriptions: [{ languageId, name, description }]
      const type = await RestaurantType.create({ icon });
      for (const desc of descriptions) {
        await RestaurantTypeDescription.create({ ...desc, restaurantTypeId: type.id });
      }
      res.status(201).json({ message: 'Type créé', typeId: type.id });
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
        as: 'descriptions',
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
        include: [{ model: RestaurantTypeDescription, as: 'descriptions', include: [{ model: Language, as: 'language' }] }]
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
      const { icon, descriptions } = req.body;
      const type = await RestaurantType.findByPk(id);
      if (!type) return res.status(404).json({ error: 'Type non trouvé' });
      if (icon) await type.update({ icon });
      if (descriptions) {
        for (const desc of descriptions) {
          await RestaurantTypeDescription.upsert({ ...desc, restaurantTypeId: id });
        }
      }
      res.json({ message: 'Type mis à jour' });
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