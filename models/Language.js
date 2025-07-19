'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Language extends Model {}
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
    timestamps: true
  });
  return Language;
};