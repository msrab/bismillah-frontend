'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ElementMenuDescription extends Model {
    static associate(models) {
      ElementMenuDescription.belongsTo(models.ElementMenu, { foreignKey: 'elementMenuId', as: 'elementMenu' });
      ElementMenuDescription.belongsTo(models.Language, { foreignKey: 'languageId', as: 'language' });
    }
  }
  ElementMenuDescription.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      elementMenuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'element_menus', key: 'id' }
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
      modelName: 'ElementMenuDescription',
      tableName: 'element_menu_descriptions',
      timestamps: false
    }
  );
  return ElementMenuDescription;
};