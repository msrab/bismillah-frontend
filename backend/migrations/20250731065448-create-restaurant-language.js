'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('restaurant_languages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      restaurantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'restaurants', key: 'id' },
        onDelete: 'CASCADE'
      },
      languageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'languages', key: 'id' },
        onDelete: 'CASCADE'
      },
      main: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }/*,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }*/
    });
    /*await queryInterface.addConstraint('restaurant_languages', {
      fields: ['restaurantId', 'main'],
      type: 'unique',
      name: 'unique_main_language_per_restaurant',
      where: { main: true }
    });*/
  },

  async down (queryInterface) {
    await queryInterface.dropTable('restaurant_languages');
  }
};
