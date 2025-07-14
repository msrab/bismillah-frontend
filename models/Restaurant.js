'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Restaurant extends Model {
    static associate(models) {
     // Ajout de l’association à la rue
     Restaurant.belongsTo(models.Street, { foreignKey: 'streetId', as: 'street' });
    }
  }

  Restaurant.init(
    {
      id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name:           { type: DataTypes.STRING, allowNull: false },
      email:          { type: DataTypes.STRING, allowNull: false, unique: true, validate:{ isEmail:true } },
      password:       { type: DataTypes.STRING, allowNull: false },
      company_number: { type: DataTypes.STRING, allowNull: false, unique: true },
      address_number: { type: DataTypes.STRING, allowNull: false },
      phone:          { type: DataTypes.STRING },
      logo:           { type: DataTypes.STRING },
      nb_followers:   { type: DataTypes.INTEGER, defaultValue: 0 },
      is_active:      { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      streetId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'streets', key: 'id' },
        onDelete: 'SET NULL'
      }
    },
    { sequelize, modelName: 'Restaurant', tableName: 'restaurants', timestamps: true }
  );
  return Restaurant;
}; 
