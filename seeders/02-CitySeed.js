'use strict';

module.exports = {
  async up (queryInterface) {
    // Attention : adapte les countryId selon tes données en base
    await queryInterface.bulkInsert('cities', [
      { name: 'Paris', postal_code: '75001', countryId: 1 },
      { name: 'Bruxelles', postal_code: '1000', countryId: 2 },
      { name: 'Berlin', postal_code: '10115', countryId: 3 }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('cities', null, {});
  }
};