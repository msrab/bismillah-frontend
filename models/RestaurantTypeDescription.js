'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class RestaurantTypeDescription extends Model {
    static associate(models) {
      RestaurantTypeDescription.belongsTo(models.RestaurantType, { foreignKey: 'restaurantTypeId' });
      RestaurantTypeDescription.belongsTo(models.Language, { as: 'language', foreignKey: 'languageId' });
    }
  }
  RestaurantTypeDescription.init(
    {
      restaurantTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'restaurant_types', key: 'id' }
      },
      languageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'languages', key: 'id' }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'RestaurantTypeDescription',
      tableName: 'restaurant_type_descriptions',
      timestamps: false
    }
  );

  return RestaurantTypeDescription;
};