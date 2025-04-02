const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CategoryMenu = sequelize.define('CategoryMenu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: true, // pour afficher une icône à côté de la catégorie
  }
}, {
  tableName: 'category_menus',
  timestamps: false
});

module.exports = CategoryMenu;
