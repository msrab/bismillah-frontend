'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Restaurant extends Model {
    static associate(models) {
      // Association à la rue
      Restaurant.belongsTo(models.Street, { foreignKey: 'streetId', as: 'street' });
      // Association à la langue principale
      Restaurant.belongsTo(models.Language, { foreignKey: 'languageId', as: 'language' });
      // Association à plusieurs langues (optionnel si tu utilises une table de jointure)
      /*Restaurant.belongsToMany(models.Language, {
        through: models.RestaurantLanguage,
        foreignKey: 'restaurantId',
        otherKey: 'languageId',
        as: 'languages'
      });*/
    }
  }

  Restaurant.init(
    {
      id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name:           { type: DataTypes.STRING, allowNull: false },
      email:          { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      password:       { type: DataTypes.STRING, allowNull: false },
      company_number: { type: DataTypes.STRING, allowNull: false, unique: true },
      address_number: { type: DataTypes.STRING, allowNull: false },
      phone:          { type: DataTypes.STRING },
      logo:           { type: DataTypes.STRING },
      nb_followers:   { type: DataTypes.INTEGER, defaultValue: 0 },
      is_active:      { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
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
    },
    { sequelize, modelName: 'Restaurant', tableName: 'restaurants', timestamps: true }
  );
  return Restaurant;
};
