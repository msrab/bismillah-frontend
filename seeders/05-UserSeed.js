'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        login: 'userdemo',
        email: 'userdemo@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // à remplacer par un hash bcrypt réel
        address_number: '22',
        firstname: 'Demo',
        surname: 'Utilisateur',
        phone: '0601020304',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
};