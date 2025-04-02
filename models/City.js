const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Country = require('./Country');

const City = sequelize.define('City', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  postal_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
  }
}, {
  tableName: 'cities',
  timestamps: false
});

// Association : une ville appartient à un pays
City.belongsTo(Country, {
  foreignKey: {
    name: 'countryId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Country.hasMany(City, {
  foreignKey: 'countryId'
});

module.exports = City;
