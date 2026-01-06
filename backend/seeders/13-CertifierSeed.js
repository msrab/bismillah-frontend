'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('certifiers', [
      {
        id: 1,
        name: 'Halal Certification Europe (HCE)',
        logo: null,
        website: 'https://www.halalcertificationeurope.com',
        email: 'info@hce-halal.eu',
        phone: '+32 2 123 45 67',
        streetId: 1, // Rue Neuve, Bruxelles
        address_number: '42',
        format_regex: '^HCE-[0-9]{4}-[A-Z]{2}-[0-9]{6}$', // Ex: HCE-2025-BE-001234
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Islamic Food and Nutrition Council of Belgium (IFANC-BE)',
        logo: null,
        website: 'https://www.ifanc.be',
        email: 'certification@ifanc.be',
        phone: '+32 3 234 56 78',
        streetId: 3, // Meir, Antwerpen
        address_number: '88',
        format_regex: '^IFANC-BE-[0-9]{8}$', // Ex: IFANC-BE-20250001
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Halal Quality Control (HQC)',
        logo: null,
        website: 'https://www.hqc-halal.be',
        email: 'contact@hqc-halal.be',
        phone: '+32 4 345 67 89',
        streetId: 5, // Veldstraat, Gent
        address_number: '15',
        format_regex: '^HQC[0-9]{10}$', // Ex: HQC2025000123
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('certifiers', null, {});
  }
};
