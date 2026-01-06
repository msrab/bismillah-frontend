'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('countries', [
      { id: 1, name: 'Belgique',    iso_code: 'BE' },
      //{ id: 2, name: 'France',  iso_code: 'FR' },
      //{ id: 3, name: 'Allemagne', iso_code: 'DE' },
      //{ id: 4, name: 'Espagne',   iso_code: 'ES' },
      //{ id: 5, name: 'Italie',    iso_code: 'IT' },
      //{ id: 6, name: 'Suisse',    iso_code: 'CH' }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('countries', null, {});
  }
};