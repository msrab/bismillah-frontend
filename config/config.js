require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'bismillah_app',
    host:     process.env.DB_HOST     || '127.0.0.1',
    dialect:  'mysql',
    dialectOptions: {
      charset: 'utf8mb4'
    },
    logging: false
  },
  test: {
    username: process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'bismillah_test',
    host:     process.env.DB_HOST     || '127.0.0.1',
    dialect:  'mysql',
    dialectOptions: {
      charset: 'utf8mb4'
    },
    logging: false
  },
  production: {
    username: process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'bismillah_prod',
    host:     process.env.DB_HOST     || '127.0.0.1',
    dialect:  'mysql',
    dialectOptions: {
      charset: 'utf8mb4'
    },
    logging: false
  }
};
