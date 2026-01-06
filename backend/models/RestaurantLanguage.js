'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class RestaurantLanguage extends Model {
    static associate(models) {
      // Associations optionnelles
      RestaurantLanguage.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' });
      RestaurantLanguage.belongsTo(models.Language, { foreignKey: 'languageId' });
    }
  }
  RestaurantLanguage.init(
    {
      restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'restaurants', key: 'id' }
      },
      languageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'languages', key: 'id' }
      },
      main: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, { 
      sequelize, 
      modelName: 'RestaurantLanguage', 
      tableName: 'restaurant_languages', 
      timestamps: false 
    }
  );
  return RestaurantLanguage;
};