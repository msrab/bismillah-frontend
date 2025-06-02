'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('restaurants', [
      {
        name:           'Le Délice Halal',
        company_number: 'BE0123456789',
        address_number: '123 Rue Principale',
        phone:          '0123456789',
        email:          'contact@ledelicehalal.be',
        password:       '$2b$10$ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', // ← remplace par un vrai hash bcrypt
        logo:           null,
        nb_followers:   0,
        createdAt:      new Date(),
        updatedAt:      new Date()
      },
      {
        name:           'Saveurs Méditerranéennes',
        company_number: 'BE9876543210',
        address_number: '45 Avenue du Marché',
        phone:          '0987654321',
        email:          'info@saveursmed.be',
        password:       '$2b$10$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // ← remplace par un vrai hash bcrypt
        logo:           null,
        nb_followers:   0,
        createdAt:      new Date(),
        updatedAt:      new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurants', {
      company_number: { [Sequelize.Op.in]: ['BE0123456789', 'BE9876543210'] }
    }, {});
  }
};
