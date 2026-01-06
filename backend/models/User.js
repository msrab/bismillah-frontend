'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Un user appartient à une rue
      User.belongsTo(models.Street, { foreignKey: 'streetId', as: 'street' });
      User.belongsTo(models.Language, { foreignKey: 'languageId', as: 'language' });
    }
  }
  User.init(
    {
      id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      login:     { type: DataTypes.STRING, allowNull: false, unique: true },
      email:     { type: DataTypes.STRING, allowNull: false, unique: true, validate:{ isEmail:true } },
      password:  { type: DataTypes.STRING, allowNull: false },
      address_number: { type: DataTypes.STRING },
      firstname: { type: DataTypes.STRING },
      surname:   { type: DataTypes.STRING },
      phone:     { type: DataTypes.STRING },
      avatar:    { type: DataTypes.STRING },
      streetId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'streets', key: 'id' },
        onDelete: 'SET NULL'
      },
      languageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'languages', key: 'id' },
        onDelete: 'SET NULL'
      }
    }, { 
      sequelize, 
      modelName: 'User', 
      tableName: 'users', 
      timestamps: true 
    }
  );
  return User;
};