'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('restaurants', {
      id:        { type: Sequelize.INTEGER, primaryKey:true, autoIncrement:true },
      email:     { type: Sequelize.STRING, allowNull:false, unique:true },
      name:     { type: Sequelize.STRING, allowNull:false },
      password:  { type: Sequelize.STRING, allowNull:false },
      company_number:  { type: Sequelize.STRING, allowNull:false },
      address_number: Sequelize.STRING,
      phone:     Sequelize.STRING,
      logo:      Sequelize.STRING,
      nb_followers: Sequelize.INTEGER,
      createdAt: { type: Sequelize.DATE, allowNull:false },
      updatedAt: { type: Sequelize.DATE, allowNull:false }
    });
  },
  async down (queryInterface) {
    await queryInterface.dropTable('restaurants');
  }
};
