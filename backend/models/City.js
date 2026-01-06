'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class City extends Model {
    static associate(models) {
      // Une ville appartient à un pays
      City.belongsTo(models.Country, { foreignKey: 'countryId', as: 'country' });
      // Une ville contient plusieurs rues
      City.hasMany(models.Street, { foreignKey: 'cityId', as: 'streets' });
    }
  }

  City.init({
    id: {
      type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    name: {
      type: DataTypes.STRING, allowNull: false
    },
    postal_code: {
      type: DataTypes.STRING, allowNull: false
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'countries', key: 'id' },
      onDelete: 'RESTRICT'
    }
  }, {
    sequelize,
    modelName: 'City',
    tableName: 'cities',
    timestamps: false
  });

  return City;
};
