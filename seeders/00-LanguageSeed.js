'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Languages', [
      { id: 1, name: 'Français',   icon: '🇫🇷' },
      { id: 2, name: 'English',    icon: '🇬🇧' },
      { id: 3, name: 'العربية',    icon: '🇸🇦' },
      { id: 4, name: 'Deutsch',    icon: '🇩🇪' },   
      { id: 5, name: 'Español',    icon: '🇪🇸' },   
      { id: 6, name: 'Nederlands', icon: '🇳🇱' }       
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Languages', null, {});
  }
};