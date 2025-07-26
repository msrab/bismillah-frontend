'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CategoryMenuDescription extends Model {
    static associate(models) {
      CategoryMenuDescription.belongsTo(models.CategoryMenu, { foreignKey: 'categoryMenuId' });
      CategoryMenuDescription.belongsTo(models.Language, { as: 'language', foreignKey: 'languageId' });
    }
  }
  CategoryMenuDescription.init(
    {
      categoryMenuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'category_menus', key: 'id' }
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
      modelName: 'CategoryMenuDescription',
      tableName: 'category_menu_descriptions',
      timestamps: false
    }
  );
  return CategoryMenuDescription;
};