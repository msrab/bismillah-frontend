'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Country extends Model {
    static associate(models) {
      // Un pays contient plusieurs villes
      Country.hasMany(models.City, { foreignKey: 'countryId', as: 'cities' });
    }
  }

  Country.init({
    id: {
      type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    name: {
      type: DataTypes.STRING, allowNull: false
    },
    iso_code: {           // p.ex. “FR”, “US”
      type: DataTypes.STRING(2), allowNull: false, unique: true
    }
  }, {
    sequelize,
    modelName: 'Country',
    tableName: 'countries',
    timestamps: false
  });

  return Country;
};
