'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Language extends Model {
    static associate(models) {
      // Association many-to-many avec Restaurant via RestaurantLanguage
      Language.belongsToMany(models.Restaurant, {
        through: models.RestaurantLanguage,
        foreignKey: 'languageId',
        otherKey: 'restaurantId',
        as: 'restaurants'
      });
    }
  }
  
  Language.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Language',
    tableName: 'languages',
    timestamps: false
  });
  return Language;
};