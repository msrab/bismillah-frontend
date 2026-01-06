'use strict';

module.exports = {
  async up (queryInterface) {
    // Rues pour les 5 villes belges
    await queryInterface.bulkInsert('streets', [
      // Bruxelles (cityId: 1)
      { id: 1, name: 'Avenue Louise', cityId: 1 },
      { id: 2, name: 'Rue Neuve', cityId: 1 },

      // Antwerpen (cityId: 2)
      { id: 3, name: 'Meir', cityId: 2 },
      { id: 4, name: 'Groenplaats', cityId: 2 },

      // Gent (cityId: 3)
      { id: 5, name: 'Veldstraat', cityId: 3 },
      { id: 6, name: 'Korenmarkt', cityId: 3 },

      // Liège (cityId: 4)
      { id: 7, name: 'Rue Vinâve d\'Île', cityId: 4 },
      { id: 8, name: 'Place Saint-Lambert', cityId: 4 },

      // Charleroi (cityId: 5)
      { id: 9, name: 'Boulevard Tirou', cityId: 5 },
      { id: 10, name: 'Place Charles II', cityId: 5 }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('streets', null, {});
  }
};
