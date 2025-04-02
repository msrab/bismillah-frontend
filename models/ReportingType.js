const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReportingType = sequelize.define('ReportingType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  }
}, {
  tableName: 'reporting_types',
  timestamps: false
});

module.exports = ReportingType;
