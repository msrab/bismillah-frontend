'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('restaurant_types', [
      { id: 1, icon: '🍽️' }, // Gastronomique
      { id: 2, icon: '🍕' },  // Pizzeria
      { id: 3, icon: '🍔' },  // Fast Food
      { id: 4, icon: '🥞' }   // Crêperie
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('restaurant_types', null, {});
  }
};