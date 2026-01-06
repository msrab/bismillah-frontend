'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Languages', [
      { id: 1, name: 'Français',   icon: '🇫🇷' },
      { id: 2, name: 'English',    icon: '🇬🇧' },
      { id: 3, name: 'Nederlands', icon: '🇳🇱' },
      { id: 4, name: 'Deutsch',    icon: '🇩🇪' },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Languages', null, {});
  }
};