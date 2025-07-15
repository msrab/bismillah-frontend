'use strict';

module.exports = {
  async up (queryInterface) {
    // Adapte les cityId selon tes données en base
    await queryInterface.bulkInsert('streets', [
      { name: 'Rue de Rivoli', cityId: 1 },
      { name: 'Avenue Louise', cityId: 2 },
      { name: 'Unter den Linden', cityId: 3 }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('streets', null, {});
  }
};