'use strict';

module.exports = {
  async up (queryInterface) {
    // Adapte les cityId, streetId, countryId selon tes données en base
    await queryInterface.bulkInsert('restaurants', [
      {
        name: 'Le Testeur',
        email: 'restotest@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // hash à adapter
        company_number: 'BE123456789',
        address_number: '10',
        phone: '0123456789',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 1,
        cityId: 1,
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('restaurants', null, {});
  }
};