'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Langues principales et secondaires logiques selon le type et la localisation
    const data = [
      // Paris (Français)
      { restaurantId: 1, languageIds: [1] },           // Le Gourmet Parisien : Français (main)
      { restaurantId: 2, languageIds: [1, 2] },        // Crêperie de Montmartre : Français (main), English

      // Bruxelles (Français, Néerlandais, Anglais selon le type)
      { restaurantId: 3, languageIds: [1, 6, 2] },     // Pizzeria Bella Italia : Français (main), Nederlands, English
      { restaurantId: 4, languageIds: [1, 2] },        // Burger House Bruxelles : Français (main), English
      { restaurantId: 5, languageIds: [1, 2, 6] },     // Sushi Royal Bruxelles : Français (main), English, Nederlands
      { restaurantId: 6, languageIds: [1, 2, 6] },     // El Mexicano Bruxelles : Français (main), English, Nederlands
      { restaurantId: 7, languageIds: [1, 6] },        // Asia Palace Bruxelles : Français (main), Nederlands
      { restaurantId: 8, languageIds: [1, 6] },        // Green Garden Bruxelles : Français (main), Nederlands
      { restaurantId: 9, languageIds: [1, 2] },        // Steakhouse Royal : Français (main), English

      // Liège (Français, Anglais)
      { restaurantId: 10, languageIds: [1, 2] },       // Le Jardin Végétarien : Français (main), English
      { restaurantId: 11, languageIds: [1, 2] },       // Asia Palace Liège : Français (main), English
      { restaurantId: 12, languageIds: [1, 2] },       // Steakhouse Liégeois : Français (main), English

      // Allemagne (Allemand, Anglais)
      { restaurantId: 13, languageIds: [4, 2] },       // Eis Paradies : Deutsch (main), English
      { restaurantId: 14, languageIds: [4, 2] },       // Sushi Meister : Deutsch (main), English
      { restaurantId: 15, languageIds: [4, 2] },       // Taco Haus : Deutsch (main), English

      // Espagne (Espagnol, Anglais)
      { restaurantId: 16, languageIds: [5, 2] },       // La Casa de Tapas : Español (main), English
      { restaurantId: 17, languageIds: [5, 2] },       // Heladería Sol : Español (main), English
    ];

    const associations = [];

    data.forEach(({ restaurantId, languageIds }) => {
      languageIds.forEach((languageId, idx) => {
        associations.push({
          restaurantId,
          languageId,
          main: idx === 0 // la première langue est la principale
        });
      });
    });

    await queryInterface.bulkInsert('restaurant_languages', associations, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('restaurant_languages', null, {});
  }
};