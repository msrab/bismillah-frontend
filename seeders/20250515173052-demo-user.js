'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        login:          'user1',
        email:          'user1@example.com',
        password:       '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // ← remplace par un vrai hash bcrypt
        address_number: '123 Rue de la Paix',
        firstname:      'John',
        surname:        'Doe',
        phone:          '0123456789',
        avatar:         null,
        createdAt:      new Date(),
        updatedAt:      new Date()
      },
      {
        login:          'user2',
        email:          'user2@example.com',
        password:       '$2b$10$YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY', // ← remplace par un vrai hash bcrypt
        address_number: '45 Avenue des Fleurs',
        firstname:      'Jane',
        surname:        'Smith',
        phone:          '0987654321',
        avatar:         null,
        createdAt:      new Date(),
        updatedAt:      new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      login: { [Sequelize.Op.in]: ['user1', 'user2'] }
    }, {});
  }
};
