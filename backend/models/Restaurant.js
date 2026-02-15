'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Restaurant extends Model {
    static associate(models) {
      // Association à la rue
      Restaurant.belongsTo(models.Street, { foreignKey: 'streetId', as: 'street' });
      // Association à plusieurs langues (optionnel, via table de jointure)
      Restaurant.belongsToMany(models.Language, {
        through: models.RestaurantLanguage,
        foreignKey: 'restaurantId',
        otherKey: 'languageId',
        as: 'languages'
      });
      // Association au type de restaurant
      Restaurant.belongsTo(models.RestaurantType, { foreignKey: 'restaurantTypeId', as: 'type' });
      // Association aux certifications
      Restaurant.hasMany(models.RestaurantCertification, { foreignKey: 'restaurantId', as: 'certifications' });
    }
  }

  Restaurant.init(
    {
      id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name:           { type: DataTypes.STRING, allowNull: false },
      slug:           { type: DataTypes.STRING, allowNull: false, unique: true },
      email:          { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      password:       { type: DataTypes.STRING, allowNull: false },
      company_number: { type: DataTypes.STRING, allowNull: false, unique: true },
      address_number: { type: DataTypes.STRING, allowNull: false },
      phone:          { type: DataTypes.STRING },
      logo:           { type: DataTypes.STRING },
      nb_followers:   { type: DataTypes.INTEGER, defaultValue: 0 },
      is_active:      { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      // Champs pour la vérification email
      is_email_verified:          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      verification_token:         { type: DataTypes.STRING, allowNull: true },
      verification_token_expires: { type: DataTypes.DATE, allowNull: true },
      streetId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'streets', key: 'id' },
        onDelete: 'SET NULL'
      },
      restaurantTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'restaurant_types', key: 'id' },
        onDelete: 'SET NULL'
      }
    }, { 
      sequelize, 
      modelName: 'Restaurant', 
      tableName: 'restaurants', 
      timestamps: true 
    }
  );
  return Restaurant;
};
