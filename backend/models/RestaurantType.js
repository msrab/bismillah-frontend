'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class RestaurantType extends Model {
    static associate(models) {
      RestaurantType.hasMany(models.RestaurantTypeDescription, { as: 'RestaurantTypeDescriptions',foreignKey: 'restaurantTypeId' });
      RestaurantType.hasMany(models.Restaurant, { foreignKey: 'restaurantTypeId' });
    }
  }
  RestaurantType.init(
    {
      icon: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isValidated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'RestaurantType',
      tableName: 'restaurant_types',
      timestamps: false
    }
  );

  return RestaurantType;
};