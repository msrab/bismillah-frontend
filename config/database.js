// backend/config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const env      = process.env.NODE_ENV || 'development';
const dbConfig = require('./config.js')[env];

console.log('>>> NODE_ENV=', env);
console.log('>>> Configuration Sequelize utilisée :', dbConfig);

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    define: dbConfig.define,
    logging: dbConfig.logging
  }
);

module.exports = sequelize;
