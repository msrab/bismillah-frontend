'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Récupère tous les restaurants et langues existants
    const [restaurants] = await queryInterface.sequelize.query(
      `SELECT id FROM restaurants ORDER BY id ASC`
    );
    const [languages] = await queryInterface.sequelize.query(
      `SELECT id FROM languages ORDER BY id ASC`
    );

    if (!restaurants.length || languages.length < 2) return;

    const associations = [];

    // Pour chaque restaurant, associe 2 langues différentes (la première comme principale)
    restaurants.forEach((restaurant, idx) => {
      // Choix circulaire pour varier les langues
      const lang1 = languages[idx % languages.length];
      const lang2 = languages[(idx + 1) % languages.length];

      associations.push({
        restaurantId: restaurant.id,
        languageId: lang1.id,
        main: true,
      });
      associations.push({
        restaurantId: restaurant.id,
        languageId: lang2.id,
        main: false,
      });
    });

    await queryInterface.bulkInsert('restaurant_languages', associations, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('restaurant_languages', null, {});
  }
};