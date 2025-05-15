'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id:        { type: Sequelize.INTEGER, primaryKey:true, autoIncrement:true },
      login:     { type: Sequelize.STRING, allowNull:false, unique:true },
      email:     { type: Sequelize.STRING, allowNull:false, unique:true },
      password:  { type: Sequelize.STRING, allowNull:false },
      address_number: Sequelize.STRING,
      firstname: Sequelize.STRING,
      surname:   Sequelize.STRING,
      phone:     Sequelize.STRING,
      avatar:    Sequelize.STRING,
      createdAt: { type: Sequelize.DATE, allowNull:false },
      updatedAt: { type: Sequelize.DATE, allowNull:false }
    });
  },
  async down (queryInterface) {
    await queryInterface.dropTable('users');
  }
};
