'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ElementMenu extends Model {
    static associate(models) {
      // Un élément appartient à une catégorie menu
      ElementMenu.belongsTo(models.CategoryMenu, { foreignKey: 'categoryMenuId', as: 'categoryMenu' });
      // Un élément appartient à un restaurant
      ElementMenu.belongsTo(models.Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
      // Un élément a plusieurs descriptions
      ElementMenu.hasMany(models.ElementMenuDescription, { as: 'descriptions', foreignKey: 'elementMenuId' });
    }
  }
  ElementMenu.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      categoryMenuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'category_menus', key: 'id' }
      },
      restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'restaurants', key: 'id' }
      }
    },
    {
      sequelize,
      modelName: 'ElementMenu',
      tableName: 'element_menus',
      timestamps: false
    }
  );
  return ElementMenu;
};