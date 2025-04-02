const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const City = require('./City');

const Street = sequelize.define('Street', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  }
}, {
  tableName: 'streets',
  timestamps: false
});

// Association : une rue appartient à une ville
Street.belongsTo(City, {
  foreignKey: {
    name: 'cityId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

City.hasMany(Street, {
  foreignKey: 'cityId'
});

module.exports = Street;
