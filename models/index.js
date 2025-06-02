// backend/models/index.js
'use strict';

const fs       = require('fs');
const path     = require('path');
const basename = path.basename(__filename);

// 1) On importe la classe Sequelize et DataTypes
const { Sequelize, DataTypes } = require('sequelize');

// 2) On importe notre instance Sequelize configurée
//    (= la même qui est exportée par backend/config/database.js)
const sequelize = require('../config/database');

// 3) Objet qui contiendra tous les modèles
const db = {};

// 4) On parcourt tous les fichiers .js du dossier models (sauf index.js)
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&        // pas un fichier caché
      file !== basename &&              // pas index.js lui-même
      file.slice(-3) === '.js'          // extension .js
    );
  })
  .forEach(file => {
    // 5) Pour chaque fichier, on l'importe en passant (sequelize, DataTypes)
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
  });

// 6) Si certains modèles définissent une méthode static associate, on l'exécute
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 7) On ajoute l’instance Sequelize et la classe Sequelize dans l’objet exporté
db.sequelize = sequelize;
db.Sequelize  = Sequelize;

module.exports = db;
