require('dotenv').config();
const { Sequelize } = require('sequelize');

const env       = process.env.NODE_ENV || 'development';
const dbConfig  = require('./config.js')[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    logging: dbConfig.logging
  }
);

module.exports = sequelize;
