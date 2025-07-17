'use strict';

module.exports = {
  async up (queryInterface) {
    // countryId: 1 = France, 2 = Belgique, 3 = Allemagne, 4 = Espagne, 5 = Italie, 6 = Suisse
    await queryInterface.bulkInsert('cities', [
      // France
      { name: 'Paris',        postal_code: '75001', countryId: 1 },
      { name: 'Lyon',         postal_code: '69001', countryId: 1 },
      // Belgique
      { name: 'Bruxelles',    postal_code: '1000',  countryId: 2 },
      { name: 'Anvers',       postal_code: '2000',  countryId: 2 },
      // Allemagne
      { name: 'Berlin',       postal_code: '10115', countryId: 3 },
      { name: 'Munich',       postal_code: '80331', countryId: 3 },
      // Espagne
      { name: 'Madrid',       postal_code: '28001', countryId: 4 },
      { name: 'Barcelone',    postal_code: '08001', countryId: 4 },
      // Italie
      { name: 'Rome',         postal_code: '00100', countryId: 5 },
      { name: 'Milan',        postal_code: '20100', countryId: 5 },
      // Suisse
      { name: 'Genève',       postal_code: '1201',  countryId: 6 },
      { name: 'Zurich',       postal_code: '8001',  countryId: 6 }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('cities', null, {});
  }
};