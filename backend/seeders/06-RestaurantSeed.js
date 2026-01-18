'use strict';

module.exports = {
  async up (queryInterface) {
    // 5 restaurants en Belgique (1 par ville)
    await queryInterface.bulkInsert('restaurants', [
      // Bruxelles (streetId: 1)
      {
        id: 1,
        name: 'La Ruche Halal',
        slug: 'la-ruche-halal-bruxelles',
        email: 'bruxelles@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'BE0123456789',
        address_number: '10',
        phone: '0471000001',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Antwerpen (streetId: 3)
      {
        id: 2,
        name: 'Antwerp Kebab',
        slug: 'antwerp-kebab-antwerpen',
        email: 'antwerpen@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'BE0234567890',
        address_number: '15',
        phone: '0472000002',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Gent (streetId: 5)
      {
        id: 3,
        name: 'Gent Grillades',
        slug: 'gent-grillades-gent',
        email: 'gent@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'BE0345678901',
        address_number: '20',
        phone: '0473000003',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Liège (streetId: 7)
      {
        id: 4,
        name: 'Liège Délices',
        slug: 'liege-delices-liege',
        email: 'liege@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'BE0456789012',
        address_number: '25',
        phone: '0474000004',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Charleroi (streetId: 9)
      {
        id: 5,
        name: 'Charleroi Saveurs',
        slug: 'charleroi-saveurs-charleroi',
        email: 'charleroi@example.com',
        password: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        company_number: 'BE0567890123',
        address_number: '30',
        phone: '0475000005',
        logo: null,
        nb_followers: 0,
        is_active: true,
        streetId: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('restaurants', null, {});
  }
};
