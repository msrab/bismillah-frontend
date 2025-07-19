'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    const hash = await bcrypt.hash('Password123!', 10);
    await queryInterface.bulkInsert('users', [
      {
        login: 'userfr',
        email: 'userfr@example.com',
        password: hash,
        address_number: '12',
        firstname: 'Jean',
        surname: 'Dupont',
        phone: '0600000001',
        avatar: null,
        streetId: 1, // France, Paris
        languageId: 1, // Français
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        login: 'userbe',
        email: 'userbe@example.com',
        password: hash,
        address_number: '22',
        firstname: 'Marie',
        surname: 'Peeters',
        phone: '0200000002',
        avatar: null,
        streetId: 7, // Belgique, Bruxelles
        languageId: 6, // Nederlands
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        login: 'userde',
        email: 'userde@example.com',
        password: hash,
        address_number: '32',
        firstname: 'Hans',
        surname: 'Müller',
        phone: '0300000003',
        avatar: null,
        streetId: 13, // Allemagne, Berlin
        languageId: 4, // Deutsch
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        login: 'useres',
        email: 'useres@example.com',
        password: hash,
        address_number: '42',
        firstname: 'Carlos',
        surname: 'García',
        phone: '0400000004',
        avatar: null,
        streetId: 19, // Espagne, Madrid
        languageId: 5, // Español
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: [
        'userfr@example.com',
        'userbe@example.com',
        'userde@example.com',
        'useres@example.com'
      ]
    });
  }
};