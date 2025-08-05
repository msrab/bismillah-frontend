'use strict';

module.exports = {
  async up (queryInterface) {
    // 17 restaurants, avec types et noms réalistes
    await queryInterface.bulkInsert('restaurants', [
      // Paris (streetId: 1, 2)
      {
        id: 1,
        name: 'Le Gourmet Parisien',
        email: 'gourmet.paris@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'FR123456789',
        address_number: '10',
        phone: '0100000001',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 1,
        restaurantTypeId: 1, // Gastronomique
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Crêperie de Montmartre',
        email: 'creperie.paris@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'FR987654321',
        address_number: '11',
        phone: '0100000002',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 2,
        restaurantTypeId: 4, // Crêperie
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Bruxelles (streetId: 7, 8, 9, 10, 11, 12, 13)
      {
        id: 3,
        name: 'Pizzeria Bella Italia',
        email: 'bella.italia.bruxelles@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'BE123456789',
        address_number: '12',
        phone: '0200000001',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 7,
        restaurantTypeId: 2, // Pizzeria
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Burger House Bruxelles',
        email: 'burgerhouse.bruxelles@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'BE987654321',
        address_number: '13',
        phone: '0200000002',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 8,
        restaurantTypeId: 3, // Fast Food
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'Sushi Royal Bruxelles',
        email: 'sushi.bruxelles@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'BE192837465',
        address_number: '14',
        phone: '0200000003',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 9,
        restaurantTypeId: 5, // Sushi Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'El Mexicano Bruxelles',
        email: 'mexicano.bruxelles@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'BE564738291',
        address_number: '15',
        phone: '0200000004',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 10,
        restaurantTypeId: 6, // Mexicain
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        name: 'Asia Palace Bruxelles',
        email: 'asia.bruxelles@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'BE246813579',
        address_number: '16',
        phone: '0200000005',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 11,
        restaurantTypeId: 7, // Asiatique
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        name: 'Green Garden Bruxelles',
        email: 'greengarden.bruxelles@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'BE135792468',
        address_number: '17',
        phone: '0200000006',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 12,
        restaurantTypeId: 9, // Végétarien
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        name: 'Steakhouse Royal',
        email: 'steakhouse.bruxelles@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'BE112233445',
        address_number: '18',
        phone: '0200000007',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 13,
        restaurantTypeId: 8, // Grill/Steakhouse
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Liège (streetId: 14, 15, 16)
      {
        id: 10,
        name: 'Le Jardin Végétarien',
        email: 'jardin.vegetarien.liege@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'BE135792468',
        address_number: '19',
        phone: '0300000001',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 14,
        restaurantTypeId: 9, // Végétarien
        createdAt: new Date(),
        updatedAt: new Date()
      }/*,
      {
        id: 11,
        name: 'Asia Palace Liège',
        email: 'asia.liege@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'BE246813579',
        address_number: '20',
        phone: '0300000002',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 15,
        restaurantTypeId: 7, // Asiatique
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 12,
        name: 'Steakhouse Liégeois',
        email: 'steakhouse.liege@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'BE112233445',
        address_number: '21',
        phone: '0300000003',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 16,
        restaurantTypeId: 8, // Grill/Steakhouse
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Allemagne (streetId: 20, 21, 22)
      {
        id: 13,
        name: 'Eis Paradies',
        email: 'eisparadies.de@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'DE123456789',
        address_number: '22',
        phone: '0400000001',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 20,
        restaurantTypeId: 10, // Glacier
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 14,
        name: 'Sushi Meister',
        email: 'sushi.meister.de@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'DE987654321',
        address_number: '23',
        phone: '0400000002',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 21,
        restaurantTypeId: 5, // Sushi Bar
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 15,
        name: 'Taco Haus',
        email: 'taco.haus.de@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'DE192837465',
        address_number: '24',
        phone: '0400000003',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 22,
        restaurantTypeId: 6, // Mexicain
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Espagne (streetId: 25, 26)
      {
        id: 16,
        name: 'La Casa de Tapas',
        email: 'tapas.madrid@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'ES123456789',
        address_number: '25',
        phone: '0500000001',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 25,
        restaurantTypeId: 1, // Gastronomique (pour la diversité)
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 17,
        name: 'Heladería Sol',
        email: 'heladeria.sol.barcelona@example.com',
        password: '$2b$10$u1pQwQw3QwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
        company_number: 'ES987654321',
        address_number: '26',
        phone: '0500000002',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 26,
        restaurantTypeId: 10, // Glacier
        createdAt: new Date(),
        updatedAt: new Date()
      }*/
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('restaurants', null, {});
  }
};