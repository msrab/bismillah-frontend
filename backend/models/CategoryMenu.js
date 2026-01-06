'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CategoryMenu extends Model {
    static associate(models) {
      CategoryMenu.hasMany(models.CategoryMenuDescription, { as: 'descriptions', foreignKey: 'categoryMenuId' });
      // Ajoute d'autres associations ici si besoin
    }
  }
  CategoryMenu.init(
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
      modelName: 'CategoryMenu',
      tableName: 'category_menus',
      timestamps: false
    }
  );
  return CategoryMenu;
};