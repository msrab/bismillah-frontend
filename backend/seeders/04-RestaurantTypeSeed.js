'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('restaurant_types', [
      { id: 1, icon: '🍽️' }, // Gastronomique
      { id: 2, icon: '🍕' },  // Pizzeria
      { id: 3, icon: '🍔' },  // Fast Food
      { id: 4, icon: '🥞' },  // Crêperie
      { id: 5, icon: '🍣' },  // Sushi Bar
      { id: 6, icon: '🌮' },  // Mexicain
      { id: 7, icon: '🍜' },  // Asiatique
      { id: 8, icon: '🥩' },  // Grill/Steakhouse
      { id: 9, icon: '🥗' },  // Végétarien
      { id: 10, icon: '🍦' }  // Glacier
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('restaurant_types', null, {});
  }
};