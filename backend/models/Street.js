'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Street extends Model {
    static associate(models) {
      // Une rue appartient à une ville
      Street.belongsTo(models.City, { foreignKey: 'cityId', as: 'city' });
      // Une rue peut être référencée par plusieurs restaurants
      Street.hasMany(models.Restaurant, { foreignKey: 'streetId', as: 'restaurants' });
    }
  }

  Street.init({
    id: {
      type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    name: {
      type: DataTypes.STRING, allowNull: false
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'cities', key: 'id' },
      onDelete: 'RESTRICT'
    }
  }, {
    sequelize,
    modelName: 'Street',
    tableName: 'streets',
    timestamps: false
  });

  return Street;
};
