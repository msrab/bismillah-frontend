'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class RestaurantLanguage extends Model {
    static associate(models) {
      RestaurantLanguage.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' });
      RestaurantLanguage.belongsTo(models.Language, { foreignKey: 'languageId' });
    }
  }
  RestaurantLanguage.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    restaurantId: { type: DataTypes.INTEGER, allowNull: false },
    languageId: { type: DataTypes.INTEGER, allowNull: false },
    main: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {
    sequelize,
    modelName: 'RestaurantLanguage',
    tableName: 'restaurant_languages',
    timestamps: true
  });
  return RestaurantLanguage;
};