'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('category_menus', [
      // Commun à tous
      { id: 1, icon: '🥗' },   // Entrées
      { id: 2, icon: '🍽️' },  // Plats principaux

      // Gastronomique
      { id: 3, icon: '🍰' },   // Desserts
      { id: 4, icon: '🥖' },   // Fromages & pains

      // Pizzeria
      { id: 5, icon: '🍕' },   // Pizzas
      { id: 6, icon: '🥤' },   // Boissons
      { id: 7, icon: '🍨' },   // Desserts glacés

      // Crêperie
      { id: 8, icon: '🥞' },   // Crêpes sucrées
      { id: 9, icon: '🧀' },   // Crêpes salées
      { id: 10, icon: '🥛' },  // Milkshakes
      { id: 11, icon: '☕' },  // Boissons chaudes

      // Fast Food
      { id: 12, icon: '🍔' },  // Burgers
      { id: 13, icon: '🍟' },  // Frites & accompagnements
      { id: 14, icon: '🥤' },  // Sodas
      { id: 15, icon: '🍦' },  // Glaces

      // Sushi Bar
      { id: 16, icon: '🍣' },  // Sushis
      { id: 17, icon: '🍱' },  // Bento & plats japonais
      { id: 18, icon: '🍵' },  // Thés japonais

      // Mexicain
      { id: 19, icon: '🌮' },  // Tacos & burritos
      { id: 20, icon: '🥑' },  // Nachos & guacamole
      { id: 21, icon: '🍹' },  // Cocktails sans alcool & boissons mexicaines

      // Asiatique
      { id: 22, icon: '🍜' },  // Nouilles & ramen
      { id: 23, icon: '🥟' },  // Dim sum & entrées asiatiques
      { id: 24, icon: '🍚' },  // Riz & plats sautés
      { id: 25, icon: '🍵' },  // Thés asiatiques

      // Grill/Steakhouse
      { id: 26, icon: '🥩' },  // Grillades & steaks
      { id: 27, icon: '🥗' },  // Salades composées
      { id: 28, icon: '🥤' },  // Boissons fraîches

      // Végétarien
      { id: 29, icon: '🥗' },  // Salades & bols
      { id: 30, icon: '🥦' },  // Plats végétariens chauds
      { id: 31, icon: '🍰' },  // Desserts maison
      { id: 32, icon: '🍹' },  // Jus & smoothies

      // Glacier
      { id: 33, icon: '🍦' },  // Glaces & sorbets
      { id: 34, icon: '🍧' },  // Coupes glacées
      { id: 35, icon: '🥤' },  // Boissons fraîches
      { id: 36, icon: '☕' }   // Café & boissons chaudes
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('category_menus', null, {});
  }
};