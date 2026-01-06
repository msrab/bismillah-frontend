'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('restaurant_certifications', [
      {
        id: 1,
        restaurantId: 1, // Le Kebab Royal (Bruxelles)
        certifierId: 1,  // HCE
        custom_certifier_name: null,
        certification_number: 'HCE-2025-BE-000101',
        is_verified: true,
        verified_at: new Date('2025-01-15'),
        verified_by: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        restaurantId: 2, // Anvers Halal Grill (Antwerpen)
        certifierId: 2,  // IFANC-BE
        custom_certifier_name: null,
        certification_number: 'IFANC-BE-20250002',
        is_verified: true,
        verified_at: new Date('2025-02-20'),
        verified_by: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        restaurantId: 3, // Gent Döner House (Gent)
        certifierId: 3,  // HQC
        custom_certifier_name: null,
        certification_number: 'HQC2025000003',
        is_verified: true,
        verified_at: new Date('2025-03-10'),
        verified_by: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        restaurantId: 4, // La Table du Liban (Liège)
        certifierId: 1,  // HCE
        custom_certifier_name: null,
        certification_number: 'HCE-2025-BE-000104',
        is_verified: false,
        verified_at: null,
        verified_by: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        restaurantId: 5, // Charleroi Snack Halal (Charleroi)
        certifierId: null, // Autre certificateur
        custom_certifier_name: 'Mosquée Centrale de Charleroi',
        certification_number: 'MCC-2025-042',
        is_verified: false,
        verified_at: null,
        verified_by: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurant_certifications', null, {});
  }
};
