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
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    },
    logging: false
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME_TEST || 'bismillah_app_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      charset: 'utf8mb4', 
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    },
    // NB : en test, on synchronisera plutôt avec `sequelize.sync({ force: true })`
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
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    },
    logging: false
  }
};
