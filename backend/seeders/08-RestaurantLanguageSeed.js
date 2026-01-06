'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Langues Belgique: 1=Français, 2=English, 3=Nederlands, 4=Deutsch
    // Restaurants: 1=Bruxelles, 2=Antwerpen, 3=Gent, 4=Liège, 5=Charleroi
    const data = [
      // Bruxelles - bilingue FR/NL + EN
      { restaurantId: 1, languageIds: [1, 3, 2] },
      // Antwerpen - NL + EN
      { restaurantId: 2, languageIds: [3, 2] },
      // Gent - NL + EN + FR
      { restaurantId: 3, languageIds: [3, 2, 1] },
      // Liège - FR + EN
      { restaurantId: 4, languageIds: [1, 2] },
      // Charleroi - FR + EN
      { restaurantId: 5, languageIds: [1, 2] }
    ];

    const associations = [];

    data.forEach(({ restaurantId, languageIds }) => {
      languageIds.forEach((languageId, idx) => {
        associations.push({
          restaurantId,
          languageId,
          main: idx === 0
        });
      });
    });

    await queryInterface.bulkInsert('restaurant_languages', associations, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('restaurant_languages', null, {});
  }
};
