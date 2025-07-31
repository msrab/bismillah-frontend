'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('category_menus', [
      { id: 1, icon: '🥗' },   // Entrées
      { id: 2, icon: '🍽️' },  // Plats
      { id: 3, icon: '🍰' },   // Desserts
      { id: 4, icon: '🍕' },   // Pizzas
      { id: 5, icon: '🥗' },   // Salades
      { id: 6, icon: '🥪' },   // Plats froids
      { id: 7, icon: '🍲' },   // Plats chauds
      { id: 8, icon: '🥤' },   // Boissons
      { id: 9, icon: '🧊' },   // Boissons froides
      { id: 10, icon: '☕' }   // Boissons chaudes
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('category_menus', null, {});
  }
};