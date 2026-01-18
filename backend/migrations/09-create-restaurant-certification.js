'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('restaurant_certifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      restaurantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'restaurants',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      certifierId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'certifiers',
          key: 'id'
        },
        onDelete: 'SET NULL',
        comment: 'NULL if custom certifier (other)'
      },
      custom_certifier_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Name of certifier if not in recognized list'
      },
      certification_number: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      verified_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      verified_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Admin user who verified the certification'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add unique constraint: one certification per restaurant per certifier
    await queryInterface.addIndex('restaurant_certifications', ['restaurantId', 'certifierId'], {
      unique: true,
      name: 'unique_restaurant_certifier'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('restaurant_certifications');
  }
};
