'use strict';

module.exports = {
  async up (queryInterface) {
    // 2 restaurants par pays, donc 12 restaurants (1 par city pour la simplicité)
    // Assure-toi que les streetId existent (voir 03-StreetSeed.js)
    await queryInterface.bulkInsert('restaurants', [
      // France (streetId: 1, 4)
      {
        name: 'Le Testeur ',
        email: 'paris@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // hash à adapter
        company_number: 'FR123456789',
        address_number: '10',
        phone: '0100000001',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Neo Crepe',
        email: 'lyon@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'FR987654321',
        address_number: '11',
        phone: '0100000002',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Belgique (streetId: 7, 10)
      {
        name: 'La Ruche',
        email: 'bruxelles@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'BE123456789',
        address_number: '12',
        phone: '0200000001',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Delhi Soup',
        email: 'anvers@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'BE987654321',
        address_number: '13',
        phone: '0200000002',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Allemagne (streetId: 13, 16)
      {
        name: 'G La Dalle',
        email: 'berlin@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'DE123456789',
        address_number: '14',
        phone: '0300000001',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 13,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'La Mama',
        email: 'munich@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'DE987654321',
        address_number: '15',
        phone: '0300000002',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 16,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Espagne (streetId: 19, 22)
      {
        name: 'La Table Servie',
        email: 'madrid@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'ES123456789',
        address_number: '16',
        phone: '0400000001',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 19,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Groupo',
        email: 'barcelone@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'ES987654321',
        address_number: '17',
        phone: '0400000002',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 22,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Italie (streetId: 25, 28)
      {
        name: 'Pomodoro',
        email: 'rome@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'IT123456789',
        address_number: '18',
        phone: '0500000001',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 25,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Gracia',
        email: 'milan@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'IT987654321',
        address_number: '19',
        phone: '0500000002',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 28,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Suisse (streetId: 31, 34)
      {
        name: 'Chico',
        email: 'geneve@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'CH123456789',
        address_number: '20',
        phone: '0600000001',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 31,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Le Mangeur',
        email: 'zurich@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'CH987654321',
        address_number: '21',
        phone: '0600000002',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 34,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('restaurants', null, {});
  }
};