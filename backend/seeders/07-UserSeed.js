'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    const hash = await bcrypt.hash('Password123!', 10);
    // 5 utilisateurs en Belgique (1 par ville)
    // Languages: 1=FR, 2=EN, 3=NL, 4=DE
    // Streets: 1-2 Bruxelles, 3-4 Antwerpen, 5-6 Gent, 7-8 Liège, 9-10 Charleroi
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        login: 'userbruxelles',
        email: 'user.bruxelles@example.com',
        password: hash,
        address_number: '10',
        firstname: 'Jean',
        surname: 'Dupont',
        phone: '0471000001',
        avatar: null,
        streetId: 1,
        languageId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        login: 'userantwerpen',
        email: 'user.antwerpen@example.com',
        password: hash,
        address_number: '20',
        firstname: 'Pieter',
        surname: 'Janssen',
        phone: '0472000002',
        avatar: null,
        streetId: 3,
        languageId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        login: 'usergent',
        email: 'user.gent@example.com',
        password: hash,
        address_number: '30',
        firstname: 'Marie',
        surname: 'Peeters',
        phone: '0473000003',
        avatar: null,
        streetId: 5,
        languageId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        login: 'userliege',
        email: 'user.liege@example.com',
        password: hash,
        address_number: '40',
        firstname: 'Sophie',
        surname: 'Lambert',
        phone: '0474000004',
        avatar: null,
        streetId: 7,
        languageId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        login: 'usercharleroi',
        email: 'user.charleroi@example.com',
        password: hash,
        address_number: '50',
        firstname: 'Thomas',
        surname: 'Martin',
        phone: '0475000005',
        avatar: null,
        streetId: 9,
        languageId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
