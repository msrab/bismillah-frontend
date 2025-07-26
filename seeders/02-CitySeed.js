'use strict';

module.exports = {
  async up (queryInterface) {
    // countryId: 1 = France, 2 = Belgique, 3 = Allemagne, 4 = Espagne, 5 = Italie, 6 = Suisse
    await queryInterface.bulkInsert('cities', [
      // France
      { id: 1, name: 'Paris',        postal_code: '75001', countryId: 1 },
      { id: 2, name: 'Lyon',         postal_code: '69001', countryId: 1 },
      // Belgique
      { id: 3, name: 'Bruxelles',    postal_code: '1000',  countryId: 2 },
      { id: 4, name: 'Anvers',       postal_code: '2000',  countryId: 2 },
      // Allemagne
      { id: 5, name: 'Berlin',       postal_code: '10115', countryId: 3 },
      { id: 6, name: 'Munich',       postal_code: '80331', countryId: 3 },
      // Espagne
      { id: 7, name: 'Madrid',       postal_code: '28001', countryId: 4 },
      { id: 8, name: 'Barcelone',    postal_code: '08001', countryId: 4 },
      // Italie
      { id: 9, name: 'Rome',         postal_code: '00100', countryId: 5 },
      { id: 10, name: 'Milan',        postal_code: '20100', countryId: 5 },
      // Suisse
      { id: 11, name: 'Genève',       postal_code: '1201',  countryId: 6 },
      { id: 12, name: 'Zurich',       postal_code: '8001',  countryId: 6 }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('cities', null, {});
  }
};