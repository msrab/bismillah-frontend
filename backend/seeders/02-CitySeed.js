'use strict';

module.exports = {
  async up (queryInterface) {
    // countryId: 1 = Belgique uniquement
    await queryInterface.bulkInsert('cities', [
      // Belgique - Grandes villes (noms en langue locale)
      // Bruxelles = bilingue FR/NL
      { id: 1, name: 'Bruxelles / Brussel', postal_code: '1000',  countryId: 1 },
      // Flandre (NL)
      { id: 2, name: 'Antwerpen',    postal_code: '2000',  countryId: 1 },
      { id: 3, name: 'Gent',         postal_code: '9000',  countryId: 1 },
      { id: 6, name: 'Brugge',       postal_code: '8000',  countryId: 1 },
      { id: 8, name: 'Leuven',       postal_code: '3000',  countryId: 1 },
      // Wallonie (FR)
      { id: 4, name: 'Charleroi',    postal_code: '6000',  countryId: 1 },
      { id: 5, name: 'Liège',        postal_code: '4000',  countryId: 1 },
      { id: 7, name: 'Namur',        postal_code: '5000',  countryId: 1 },
      { id: 9, name: 'Mons',         postal_code: '7000',  countryId: 1 },
      // Communes bruxelloises (bilingue)
      { id: 10, name: 'Schaerbeek / Schaarbeek', postal_code: '1030', countryId: 1 },
      { id: 11, name: 'Anderlecht',  postal_code: '1070',  countryId: 1 },
      { id: 12, name: 'Molenbeek-Saint-Jean / Sint-Jans-Molenbeek', postal_code: '1080', countryId: 1 }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('cities', null, {});
  }
};
