const { RestaurantLanguage, Language } = require('../models');

module.exports = {
  // Ajouter une langue à un restaurant
  async addLanguage(req, res, next) {
    try {
      const { languageId, main } = req.body;
      const restaurantId = req.userId; // supposé injecté par le middleware d'auth

      // Si main=true, retirer le main des autres (un seul main par restaurant)
      if (main) {
        await RestaurantLanguage.update({ main: false }, { where: { restaurantId } });
      }

      // Crée ou met à jour la langue pour ce restaurant
      const [rl, created] = await RestaurantLanguage.findOrCreate({
        where: { restaurantId, languageId },
        defaults: { main: !!main }
      });
      if (!created && typeof main === 'boolean') {
        rl.main = main;
        await rl.save();
      }

      const language = await Language.findByPk(languageId);
      res.status(created ? 201 : 200).json({ restaurantLanguage: rl, language });
    } catch (error) {
      next(error);
    }
  },

  // Supprimer une langue d'un restaurant
  async removeLanguage(req, res, next) {
    try {
      const { languageId } = req.params;
      const restaurantId = req.userId;
      await RestaurantLanguage.destroy({ where: { restaurantId, languageId } });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },

  // Lister toutes les langues d'un restaurant
  async listLanguages(req, res, next) {
    try {
      const restaurantId = req.userId;
      const langs = await RestaurantLanguage.findAll({
        where: { restaurantId },
        include: [Language]
      });
      res.json(langs);
    } catch (error) {
      next(error);
    }
  },

  // Changer la langue principale
  async setMainLanguage(req, res, next) {
  const { languageId } = req.body;
  const restaurantId = req.user.id;

  const t = await sequelize.transaction();
  try {
    // 1. Mettre toutes les langues à main=false pour ce restaurant
    await RestaurantLanguage.update(
      { main: false },
      { where: { restaurantId }, transaction: t }
    );

    // 2. Mettre la langue demandée à main=true
    const [count, [updated]] = await RestaurantLanguage.update(
      { main: true },
      {
        where: { restaurantId, languageId },
        returning: true,
        transaction: t
      }
    );

    await t.commit();

    if (!updated) return res.status(404).json({ error: "Association non trouvée" });
    res.json({ restaurantLanguage: updated });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}
};