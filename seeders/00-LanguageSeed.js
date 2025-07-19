'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Languages', [
      { name: 'Français',   icon: '🇫🇷', createdAt: new Date(), updatedAt: new Date() },
      { name: 'English',    icon: '🇬🇧', createdAt: new Date(), updatedAt: new Date() },
      { name: 'العربية',    icon: '🇸🇦', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Deutsch',    icon: '🇩🇪', createdAt: new Date(), updatedAt: new Date() },      // Allemand
      { name: 'Español',    icon: '🇪🇸', createdAt: new Date(), updatedAt: new Date() },      // Espagnol
      { name: 'Nederlands', icon: '🇳🇱', createdAt: new Date(), updatedAt: new Date() }       // Néerlandais
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Languages', null, {});
  }
};