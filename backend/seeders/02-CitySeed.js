'use strict';

module.exports = {
  async up (queryInterface) {
    // countryId: 1 = Belgique - 5 grandes villes
    await queryInterface.bulkInsert('cities', [
      { id: 1, name: 'Bruxelles', postal_code: '1000', countryId: 1 },
      { id: 2, name: 'Antwerpen', postal_code: '2000', countryId: 1 },
      { id: 3, name: 'Gent',      postal_code: '9000', countryId: 1 },
      { id: 4, name: 'Liège',     postal_code: '4000', countryId: 1 },
      { id: 5, name: 'Charleroi', postal_code: '6000', countryId: 1 }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('cities', null, {});
  }
};
