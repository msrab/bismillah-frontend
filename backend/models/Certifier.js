'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Certifier extends Model {
    static associate(models) {
      // Association à la rue
      Certifier.belongsTo(models.Street, { foreignKey: 'streetId', as: 'street' });
      // Association aux certifications de restaurants
      Certifier.hasMany(models.RestaurantCertification, { foreignKey: 'certifierId', as: 'certifications' });
    }
  }

  Certifier.init(
    {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      name: { 
        type: DataTypes.STRING(100), 
        allowNull: false, 
        unique: true 
      },
      logo: { 
        type: DataTypes.STRING(255), 
        allowNull: true 
      },
      website: { 
        type: DataTypes.STRING(255), 
        allowNull: true 
      },
      email: { 
        type: DataTypes.STRING(100), 
        allowNull: true,
        validate: { isEmail: true }
      },
      phone: { 
        type: DataTypes.STRING(20), 
        allowNull: true 
      },
      streetId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'streets', key: 'id' },
        onDelete: 'SET NULL'
      },
      address_number: { 
        type: DataTypes.STRING(10), 
        allowNull: true 
      },
      format_regex: { 
        type: DataTypes.STRING(255), 
        allowNull: true,
        comment: 'Regex pattern to validate certification number format'
      }
    }, 
    { 
      sequelize, 
      modelName: 'Certifier', 
      tableName: 'certifiers', 
      timestamps: true 
    }
  );

  return Certifier;
};
