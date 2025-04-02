const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RestaurantType = sequelize.define('RestaurantType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: true // icône pour représenter le type de restaurant
  }
}, {
  tableName: 'restaurant_types',
  timestamps: false
});

module.exports = RestaurantType;
