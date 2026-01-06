'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class RestaurantCertification extends Model {
    static associate(models) {
      // Association au restaurant
      RestaurantCertification.belongsTo(models.Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
      // Association au certificateur (optionnel si "Autre")
      RestaurantCertification.belongsTo(models.Certifier, { foreignKey: 'certifierId', as: 'certifier' });
    }
  }

  RestaurantCertification.init(
    {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'restaurants', key: 'id' },
        onDelete: 'CASCADE'
      },
      certifierId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'certifiers', key: 'id' },
        onDelete: 'SET NULL',
        comment: 'NULL if custom certifier (other)'
      },
      custom_certifier_name: { 
        type: DataTypes.STRING(100), 
        allowNull: true,
        comment: 'Name of certifier if not in recognized list'
      },
      certification_number: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
      },
      is_verified: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false, 
        defaultValue: false 
      },
      verified_at: { 
        type: DataTypes.DATE, 
        allowNull: true 
      },
      verified_by: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
        comment: 'Admin user who verified the certification'
      }
    }, 
    { 
      sequelize, 
      modelName: 'RestaurantCertification', 
      tableName: 'restaurant_certifications', 
      timestamps: true 
    }
  );

  return RestaurantCertification;
};
