'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('countries', [
      { name: 'France', iso_code: 'FR' },
      { name: 'Belgique', iso_code: 'BE' },
      { name: 'Allemagne', iso_code: 'DE' }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('countries', null, {});
  }
};