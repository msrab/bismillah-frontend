const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Country = sequelize.define('Country', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: true, 
  },
  phone_code: {
    type: DataTypes.STRING(10),
    allowNull: true, 
  }
}, {
  tableName: 'countries',
  timestamps: false
});

module.exports = Country;
